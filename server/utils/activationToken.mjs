import jwt from "jsonwebtoken";

export const createActivationToken = (user) => {
  const token = jwt.sign(user, "shivam", { expiresIn: "5min" });
  return { token };
};
