import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";

import { IPessoa } from "../../database/models";
import { PessoasPoviders } from "../../database/providers/pessoas";
import { validation } from "../../shared";

interface IBodyProps extends Omit<IPessoa, "id"> {}

export const createValidation = validation((getShema) => ({
  body: getShema<IBodyProps>(
    yup.object().shape({
      nomeCompleto: yup.string().required().min(3),
      email: yup.string().required().email(),
      cidadeId: yup.number().integer().required(),
    })
  ),
}));

export const create = async (req: Request<{}, {}, IPessoa>, res: Response) => {
  const result = await PessoasPoviders.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};
