import dotenv from "dotenv";
import express, { Request, Response, json } from "express";

dotenv.config();

export const app = express();

app.use(json());

app.get("/health", (req: Request, res: Response) => res.send("Ok"));
