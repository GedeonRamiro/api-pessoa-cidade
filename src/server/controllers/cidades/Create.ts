import { Request, Response } from "express";

interface ICidade {
  name: string;
}

export const create = (req: Request<{}, {}, ICidade>, res: Response) => {
  console.log(req.body);

  return res.send("Cidades");
};
