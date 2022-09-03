import { NextApiRequest } from "next";
import verifySignature from "../../../lib/github/verifySignature";
import { signatureHeaderName } from "../../../lib/github/api";

test("verifies signatures", () => {
  process.env.WEBHOOK_SECRET = "foo";
  const signature =
    "sha256=c76356efa19d219d1d7e08ccb20b1d26db53b143156f406c99dcb8e0876d6c55";
  const req = {
    headers: { [signatureHeaderName]: signature },
  } as unknown as NextApiRequest;

  expect(() => verifySignature(req, "{}")).not.toThrow("did not match");
});
