import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/", (_, res) => {
  return res.send("Olá, DEV!");
});

router.post("/teste/:id", (req, res) => {
  console.log(req.params.id);
  return res.status(StatusCodes.UNAUTHORIZED).json(req.params.id);
});

export { router };
