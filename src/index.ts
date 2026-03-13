import express from "express";
import type { Request, Response } from "express";
import router from "@/routes/index.js";
import notFoundErrorHandler from "@/middleware/notFoundRouteHandler.js";
import { errorHandler } from "@/middleware/errorHandler.js";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = 3001;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
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

//not found URL route
app.use(notFoundErrorHandler);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`The server has started on port: ${PORT}`);
});
