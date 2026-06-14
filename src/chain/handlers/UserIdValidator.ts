import { AbstractHandler } from "../AbstractHandler";
import { AccessLogRecord } from "../../models/DataRecord";

export class UserIdValidator extends AbstractHandler {
  protected process(record: AccessLogRecord): AccessLogRecord {
    if (!record.userId || typeof record.userId !== "string" || record.userId.trim() === "") {
      throw new Error("Invalid or missing userId");
    }

    return record;
  }
}