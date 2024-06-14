import express from "express";
export const app = express();
import dotenv from "dotenv";

dotenv.config();
import paypal from 'paypal-rest-sdk';

import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { ErrorMiddleWare } from "./middlewares/error.mjs";
import { allRouter } from "./routes/index.mjs";
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(cookieParser());
console.log(process.env.ORIGIN,"ORIGIN")
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.ORIGIN.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

paypal.configure({
  "mode":'sandbox',
  "client_id": "AfcMmK9NTk_xMdkk9Y1MAyG0H3WezrRYPGfeOFVqROpDNsRbxgyo7KXByFcyXZJCdHKtlgzPSQnJPA5H",
  "client_secret": 'EKU2b6KgrFtKWD-l81EgyXDmqP1RIMzZw2LS17g9WHU3YTrVolJjHBH68Jbkv6kVro9Ozdh2bj_Xd80j',
});

app.use("/", express.static("./utils/uploads"));
app.use(cors(corsOptions));

app.use("/api/v1", allRouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Hello from server!" });
});





app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleWare);
