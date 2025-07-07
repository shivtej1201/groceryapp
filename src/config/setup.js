// src/config/setup.js
import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "./adminjs-themes.js";

// Register Mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

// Create AdminJS instance
export const adminJs = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ["role", "phone", "isActivated"],
        filterProperties: ["role", "phone"],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ["role", "phone", "isActivated"],
        filterProperties: ["role", "phone"],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["role", "phone", "isActivated"],
        filterProperties: ["role", "phone"],
      },
    },
    { resource: Models.Branch },
    { resource: Models.Category },
    { resource: Models.Product },
    { resource: Models.Order },
    { resource: Models.Counter },
  ],
  branding: {
    companyName: "Grocery Store",
    withMadeWithLove: false,
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
});

// Register AdminJS router with Fastify
export const buildAdminRouter = async (fastify) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    adminJs, // ✅ Corrected from 'admin'
    {
      authenticate,
      cookiePassword: COOKIE_PASSWORD,
      cookieName: "adminjs",
    },
    fastify, // ✅ Corrected from 'app'
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
