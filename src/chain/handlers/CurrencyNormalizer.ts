import { AbstractHandler } from "../AbstractHandler";
import { TransactionRecord } from "../../models/DataRecord";

export class CurrencyNormalizer extends AbstractHandler {
  protected process(record: TransactionRecord): TransactionRecord {
    if (!record.currency || typeof record.currency !== "string") {
      throw new Error("Invalid or missing currency");
    }

    const normalized = record.currency.toUpperCase();
    return { ...record, currency: normalized };
  }
}