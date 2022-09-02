import { NextApiRequest, NextApiResponse } from "next";
import { EventStream } from "../../lib/eventStream";
import { githubEvents } from "./webhook";

const sse = new EventStream();

githubEvents.on("push", (body) => {
  sse.send(body);
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return sse.handle(req, res);
};

export default handler;
