import express from "express";
import { router } from "./router";
import "dotenv/config";

const server = express();

server.use(express.json());

server.use(router);

export { server };
