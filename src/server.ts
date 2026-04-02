import express from "express";
import type { Request, Response } from "express";
import router from "@/routes/index.js";
import notFoundErrorHandler from "@/middleware/notFoundRouteHandler.js";
import { errorHandler } from "@/middleware/errorHandler.js";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

import { connectToDb } from "./data/dbConnection.js";

const app = express();
const PORT = 3001;

//database connection
let db: any;

connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`The server has started on port: ${PORT}`);
    });
  } else {
    console.error("Failed to connect to the database:", err);
  }
});

app.use(helmet());
app.use(cors());
app.use(morgan(":method :url :date[clf]"));
app.use(express.json());

//todos routes
app.use("/api", router);

//main route
app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Todo API",
    version: "1.0.0",
    links: {
      todos: "/api/todos",
      health: "/api/health",
    },
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  const dbConnected = db ? true : false;

  res.json({
    status: dbConnected ? "ok" : "error",
    db: dbConnected ? "connected" : "disconnected",
  });
});

//not found URL route
app.use(notFoundErrorHandler);

//error handler
app.use(errorHandler);
