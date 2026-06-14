import { AbstractHandler } from "../AbstractHandler";
import { DataRecord } from "../../models/DataRecord";

export class TimestampParser extends AbstractHandler {
  protected process(record: DataRecord): DataRecord {
    if (!record.timestamp || isNaN(Date.parse(record.timestamp))) {
      throw new Error("Invalid or missing timestamp");
    }

    const isoTimestamp = new Date(record.timestamp).toISOString();
    return { ...record, timestamp: isoTimestamp };
  }
}