import { NextApiRequest } from "next";
import crypto from "crypto";

const sigHeaderName = "x-hub-signature-256";

export default function verifySignature(req: NextApiRequest, body: string) {
  const sig = Buffer.from((req.headers[sigHeaderName] as string) || "", "utf8");
  const hmac = crypto.createHmac(
    "sha256",
    process.env.WEBHOOK_SECRET as string
  );
  const digest = Buffer.from(
    "sha256" + "=" + hmac.update(body).digest("hex"),
    "utf8"
  );
  if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
    throw new Error(
      `Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`
    );
  }
}
