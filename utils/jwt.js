import jwt from "jsonwebtoken";


export const generateAccessToken = (validateUser) => {
  return jwt.sign(
    {
      id: validateUser._id,
      isAdmin: validateUser.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (validateUser) => {
  return jwt.sign(
    {
      id: validateUser._id,
      isAdmin: validateUser.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
