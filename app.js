import "dotenv/config";
import fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import fastifySoket from "fastify-socket.io";
import { registerRoutes } from "./src/routes/index.js";
import { buildAdminRouter, adminJs } from "./src/config/setup.js";

const start = async () => {
  await connectDB(process.env.MONGODB_URI);
  const app = fastify();

  app.register(fastifySoket, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });

  await registerRoutes(app);

  await buildAdminRouter(app);
  app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Server is running on ${PORT}, ${adminJs.options.rootPath}`);
    }
  });

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("New client connected");
      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log(`Client joined room: ${orderId}`);
      });
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  });
};
start();

// shivatejsonawane3149===kx6U2oPFVvtdzDcH
