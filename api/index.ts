/**
 * Vercel Serverless Function — API entry point.
 *
 * Vercel invoca este archivo para cualquier petición que comience con /api.
 * El Express app se exporta como default handler compatible con Vercel.
 *
 * Variables de entorno requeridas en el Dashboard de Vercel:
 *   DATABASE_URL      → URL de conexión MySQL
 *   JWT_SECRET        → Clave secreta JWT
 *   VITE_APP_ID       → App ID
 *   NODE_ENV          → production
 */
import "dotenv/config";
import express, { type Request, type Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerStorageProxy(app);
registerOAuthRoutes(app);

// tRPC — todas las rutas bajo /api/trpc
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Ruta base de salud
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export como handler de Vercel (función serverless)
export default app;
