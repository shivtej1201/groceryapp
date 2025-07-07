import { cache } from "react";
import { Customer, DeliveryPartner } from "../../models/user";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({ phone, role: "customer", isActivated: true });
      await customer.save();
    }
    const { accessToken, refreshToken } = generateToken(customer);
    return reply.send({
      message: "Customer logged in successfully",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    console.error("Error during customer login:", error);
    return reply.status(500).send({ error: "Internal server error" });
  }
};

export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return reply.status(404).send({ error: "Delivery partner not found" });
    }
    const isMatch = password === deliveryPartner.password; // Replace with proper password hashing in production
    if (!isMatch) {
      return reply.status(400).send({ error: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = generateToken(deliveryPartner);
    return reply.send({
      message: "Delivery partner logged in successfully",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    return reply.status(500).send({ error: "Internal server error" });
  }
};

export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(400).send({ error: "Refresh token is required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;
    if (decoded.role === "customer") {
      user = await Customer.findById(decoded.userid);
    } else if (decoded.role === "deliveryPartner") {
      user = await DeliveryPartner.findById(decoded.useridid);
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }
    if (!user) {
      return reply.status(403).send({ error: "User not found" });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
    return reply.send({
      message: "Tokens refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
      user,
    });
  } catch (error) {
    return reply.status(403).send({ message: "Invalid Refresh Token" });
  }
};

export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;
    let user;
    if (role === "customer") {
      user = await Customer.findById(userId);
    } else if (role === "deliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return reply.status(403).send({ message: "Invalid Role" });
    }
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }
    return reply.send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return reply.status(500).send({ message: "Internal server error", error });
  }
};
