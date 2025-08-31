import { TRPCError } from "@trpc/server";

export class InvalidTopicInputError extends TRPCError {
  private static readonly message = "Invalid topic input";

  constructor() {
    const { message } = InvalidTopicInputError;
    super({ message, code: "BAD_REQUEST" });
    Object.defineProperty(this, "name", { value: this.constructor.name });
    return this;
  }
}
