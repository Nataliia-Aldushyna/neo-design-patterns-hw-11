import { DataRecord } from "../models/DataRecord";
import { AccessLogWriter } from "./writers/AccessLogWriter";
import { TransactionWriter } from "./writers/TransactionWriter";
import { ErrorLogWriter } from "./writers/ErrorLogWriter";
import { RejectedWriter } from "./writers/RejectedWriter";

type WriterMap = {
  access_log: AccessLogWriter;
  transaction: TransactionWriter;
  system_error: ErrorLogWriter;
};

export class ProcessingMediator {
  private writerMap: WriterMap;
  private rejectedWriter: RejectedWriter;

  private successCount = 0;
  private rejectedCount = 0;

  constructor(
    accessLogWriter: AccessLogWriter,
    transactionWriter: TransactionWriter,
    errorLogWriter: ErrorLogWriter,
    rejectedWriter: RejectedWriter
  ) {
    this.writerMap = {
      access_log: accessLogWriter,
      transaction: transactionWriter,
      system_error: errorLogWriter,
    };

    this.rejectedWriter = rejectedWriter;
  }

  onSuccess(record: DataRecord): void {
    this.successCount++;
    this.writerMap[record.type].write(record as never);
  }

  onRejected(original: DataRecord, error: string): void {
    this.rejectedCount++;
    this.rejectedWriter.write(original, error);
  }

  async finalize(): Promise<void> {
    await Promise.all([
      this.writerMap.access_log.finalize(),
      this.writerMap.transaction.finalize(),
      this.writerMap.system_error.finalize(),
      this.rejectedWriter.finalize(),
    ]);

    console.log(`[INFO] Успішно оброблено: ${this.successCount}`);
    console.log(`[WARN] Відхилено з помилками: ${this.rejectedCount}`);
    console.log(`[INFO] Звіт збережено у директорії src/output/`);
  }
}