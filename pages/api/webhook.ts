import { NextApiRequest, NextApiResponse } from "next";
import EventEmitter from "events";
import { mockPushEvent } from "../../lib/github/mock";
import verifySignature from "../../lib/github/verifySignature";
import getRawBody from "raw-body";
import logger from "../../lib/logger";

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
    githubEvents.emit("push", JSON.parse(body));
    logger.info("Distribuerer event fra GitHub via SSE");
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
