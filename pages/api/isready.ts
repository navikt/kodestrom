import type { NextApiRequest, NextApiResponse } from "next";

export default function isReadyHandler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send("ready");
}
