import "@logtail/pino";
import pino from "pino";

const logger = pino(
  pino.transport({
    target: "@logtail/pino",
    options: { sourceToken: process.env.LOGTAIL_SOURCE_TOKEN },
  })
);

export default logger;
