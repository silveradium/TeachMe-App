import { TRPCError } from "@trpc/server";

export class ActiveSessionRecordExistsError extends TRPCError {
  private static readonly message = "Please finish your active session before starting a new one.";

  constructor() {
    const { message } = ActiveSessionRecordExistsError;
    super({ message, code: "BAD_REQUEST" });
    Object.defineProperty(this, "name", { value: this.constructor.name });
    return this;
  }
}
