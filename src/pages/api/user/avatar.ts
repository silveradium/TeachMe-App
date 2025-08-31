import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { defaultAvatarSrc } from "~/lib/defaultAvatarImage";
import { prisma } from "~/server/db";

const querySchema = z
  .object({
    email: z.string().email(),
  })
  .partial();

async function getIdentityData(req: NextApiRequest) {
  const { email } = querySchema.parse(req.query);
  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { name: true, email: true, avatar: true },
  });
  return {
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const identity = await getIdentityData(req);
  const img = identity?.avatar;
  // If image isn't set or links to this route itself, use default avatar
  if (!img) {
    res.writeHead(302, {
      Location: defaultAvatarSrc({
        md5: crypto
          .createHash("md5")
          .update(identity?.email || "guest@example.com")
          .digest("hex"),
      }),
    });
    return res.end();
  }

  if (!img.includes("data:image")) {
    res.writeHead(302, { Location: img });
    return res.end();
  }

  const decoded = img.toString().replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "");
  const imageResp = Buffer.from(decoded, "base64");
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": imageResp.length,
  });
  res.end(imageResp);
}
