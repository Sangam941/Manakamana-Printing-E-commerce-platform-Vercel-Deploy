import "dotenv/config";
<<<<<<< HEAD
import express from "express";
import cors from "cors";

import adminRoutes from "./routes/admin.routes";
import clientRoutes from "./routes/client.routes";
import { globalErrorHandler } from "./middleware/error.middleware";
=======
import express, { Request,Response } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import publicRoutes from "./routes/public.routes";
import userRoutes from "./routes/user.routes";
import templateRoutes from "./routes/template.routes";
import designSubmissionRoutes from "./routes/design-submission.routes";
import designRoutes from "./routes/design.routes";
import productOrderRoutes from "./routes/product-order.routes";
import clientWalletRoutes from "./routes/wallet/client-wallet.routes";
import adminWalletRoutes from "./routes/wallet/admin-wallet.routes";
import { globalErrorHandler } from "./middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
const swaggerOutput = require("../swagger-output.json");
>>>>>>> feat/updatedb

const app = express();
const port = process.env.PORT || 8005;

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/admin", adminRoutes);
=======
app.use("/api/v1", publicRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/templates", templateRoutes);
app.use("/api/v1/design-submissions", designSubmissionRoutes);
app.use("/api/v1", designRoutes);
app.use("/api/v1/orders", productOrderRoutes);
app.use("/api/v1/wallet", clientWalletRoutes);
app.use("/api/v1/admin/wallet", adminWalletRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

//health check
app.get("/",(req:Request,res:Response)=>{
  res.json({message:"API is running"})
}
)
>>>>>>> feat/updatedb

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;