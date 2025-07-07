// F:\Working\server\src\middlewares\auth.js

import jwt from "jsonwebtoken";

export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    request.user = decoded;

    // ✅ No need for `next()` — just return
    return;
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
};
