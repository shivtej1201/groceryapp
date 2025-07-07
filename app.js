import "dotenv/config";
import fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = fastify();

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Server is running on ${PORT}`);
    }
  });
};
start();

// shivatejsonawane3149===kx6U2oPFVvtdzDcH
