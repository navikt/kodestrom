import ecsFormat from "@elastic/ecs-pino-format";
import pino from "pino";

export default pino(ecsFormat());
