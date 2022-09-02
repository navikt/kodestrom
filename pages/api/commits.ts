import { NextApiRequest, NextApiResponse } from "next";
import { EventStream } from "../../lib/eventStream";
import crypto from "crypto";
import { PushEvent, Repository } from "../../lib/github/types";
import { githubEvents } from "./webhook";

const sse = new EventStream();

githubEvents.on("hook", (body) => {
  sse.send(body);
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return sse.handle(req, res);
};

export default handler;
