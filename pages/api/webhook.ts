import { NextApiRequest, NextApiResponse } from "next";
import EventEmitter from "events";
import { mockPushEvent } from "../../lib/github/mock";
import verifySignature from "../../lib/github/verifySignature";
import getRawBody from "raw-body";
import logger from "../../lib/logger";
import { eventHeaderName } from "../../lib/github/api";

export const githubEvents = new EventEmitter();

if (process.env.NODE_ENV == "development") {
  setInterval(() => {
    githubEvents.emit("push", mockPushEvent());
  }, 1500);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  logger.info("Fikk event fra GitHub");
  try {
    const body: string = await getRawBody(req, true);
    await verifySignature(req, body);

    const eventType = (req.headers[eventHeaderName] as string) || "push";
    logger.info(`Distribuerer event=${eventType} fra GitHub via SSE`);
    githubEvents.emit(eventType, JSON.parse(body));
  } catch (e) {
    logger.error("Kunne ikke verifisere signaturen");
    return res.status(401).end();
  }

  res.status(200).end();
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
