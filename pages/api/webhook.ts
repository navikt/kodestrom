import { NextApiRequest, NextApiResponse } from "next";
import EventEmitter from "events";
import { mockPushEvent } from "../../lib/github/mock";
import verifySignature from "../../lib/github/verifySignature";
import getRawBody from "raw-body";

export const githubEvents = new EventEmitter();

if (process.env.NODE_ENV == "development") {
  setInterval(() => {
    githubEvents.emit("push", mockPushEvent());
  }, 1500);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body: string = await getRawBody(req, true);
    await verifySignature(req, body);
    githubEvents.emit("push", JSON.parse(body));
  } catch (e) {
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
