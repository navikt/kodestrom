import { NextApiRequest, NextApiResponse } from "next";
import { PushEvent, Repository } from "../../lib/github/types";
import EventEmitter from "events";
import crypto from "crypto";

export const githubEvents = new EventEmitter();

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  githubEvents.emit("hook", body);

  res.status(200).end();
};

export default handler;

if (process.env.NODE_ENV == "development") {
  setInterval(() => {
    githubEvents.emit("hook", pushEvent());
  }, 1500);
}

function hash(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function pushEvent(): PushEvent {
  let repository: () => Repository = () =>
    Math.random() > 0.5
      ? {
          id: 186853002,
          node_id: "MDEwOlJlcG9zaXRvcnkxODY4NTMwMDI=",
          name: "Hello-World",
          full_name: "Codertocat/Hello-World",
          private: false,
        }
      : {
          id: 186853003,
          node_id: "OlJlcG9zaXRvcnkxODY4NTMwMDi=",
          name: "dp-dagpenger",
          full_name: "navikt/dp-dagpegnger",
          private: false,
        };
  return {
    ref: "refs/branches/main",
    before: hash(Math.random().toString()),
    after: hash(Math.random().toString()),
    commits: [],
    repository: repository(),
  };
}
