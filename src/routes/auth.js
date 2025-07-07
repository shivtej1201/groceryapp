import {
  fetchUser,
  loginCustomer,
  loginDeliveryPartner,
  refreshToken,
} from "../controllers/auth/auth.js";

import { verifyToken } from "../middleware/auth.js";
import { updateUser } from "../controllers/tracking/user.js";
import fastifyPlugin from "fastify-plugin";

// 🔧 Rename the inner function to avoid naming collision
async function authRoutesPlugin(fastify, options) {
  fastify.post("/customer/login", loginCustomer);
  fastify.post("/delivery/login", loginDeliveryPartner);
  fastify.get("/refresh-token", refreshToken);
  fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
  fastify.patch("/user", { preHandler: [verifyToken] }, updateUser);
}

export const authRoutes = fastifyPlugin(authRoutesPlugin);
