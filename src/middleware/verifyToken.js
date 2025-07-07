import jwt from "jsonwebtoken";

export const verifyToken = async (req, reply) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];

    const decoded = req.server.jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = decoded; // Attach user info to request object
    return true; // Token is valid
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
};
