import express from "express";
export const app = express();
import dotenv from "dotenv";

dotenv.config();
import paypal from 'paypal-rest-sdk';
import { allRouter } from "./routes/index.mjs";
import { fileURLToPath } from 'url';
import path from  "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { ErrorMiddleWare } from "./middlewares/error.mjs"
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(cookieParser());
const corsOptions = {
  origin:'https://operator-steel.vercel.app',
//  origin: 'https://operator-steel.vercel.app', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};
console.log(corsOptions);
paypal.configure({
  "mode":'sandbox',
  "client_id": "AX6923l9wsuCrhtwNQxBGObDVIf6uYmljXjLwaZOeaLSvBijJJwnYllebRA9368GTzQCSM67PzKeHUq0",
  "client_secret": 'EK4X4QGpIAgRwr46MlnxwloV2jEMkOyRL69AQLJoOfUcr5NaYEDLJ45v-ywCriuX-JJViM3eeogjZlQ8',
});
// paypal.configure({
//   "mode":'sandbox',
//   "client_id": "AfcMmK9NTk_xMdkk9Y1MAyG0H3WezrRYPGfeOFVqROpDNsRbxgyo7KXByFcyXZJCdHKtlgzPSQnJPA5H",
//   "client_secret": 'EKU2b6KgrFtKWD-l81EgyXDmqP1RIMzZw2LS17g9WHU3YTrVolJjHBH68Jbkv6kVro9Ozdh2bj_Xd80j',
// });

app.use("/", express.static("./utils/uploads"));
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "build")));
// Define a route for handling requests to the root URL
app.get(/^(?!\/?api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/server", (req, res) => {
  res.status(200).json({ success: true, message: "Hello from server!" });
});

app.use("/api/v1", allRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleWare);
