import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";

export const PORT = process.env.PORT || 5000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});
sessionStore.on("error", (error) => {
  console.error("Session store error:", error);
});

export const authenticate = async (email, Password) => {
  // if (email && Password) {
  //   if (email == "shivtej@gmail.com" && Password == "123456789") {
  //     return Promise.resolve({ email: email, password: Password });
  //   } else {
  //     return null;
  //   }
  // }

  //   //Uncommented code
  if (email && Password) {
    const user = await Admin.findOne({ email });
    if (!user) {
      return null;
    }
    if (user.password === Password) {
      return Promise.resolve({ email: email, password: password });
    } else {
      return null;
    }
  }
  return null;
};
