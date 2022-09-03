import { PushEvent, Repository } from "./api";
import crypto from "crypto";

function hash(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

export function mockPushEvent(): PushEvent {
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
    sender: {
      login: "Codertocat",
      id: 21031067,
      node_id: "MDQ6VXNlcjIxMDMxMDY3",
      avatar_url: "https://avatars1.githubusercontent.com/u/21031067?v=4",
      gravatar_id: "",
      html_url: "https://github.com/Codertocat",
    },
  };
}
