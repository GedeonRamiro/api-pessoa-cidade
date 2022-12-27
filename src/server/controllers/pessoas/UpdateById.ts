import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { IPessoa } from "../../database/models";
import { PessoasPoviders } from "../../database/providers/pessoas";

import { validation } from "../../shared/middleware";

interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<IPessoa, "id"> {}

export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nomeCompleto: yup.string().required(),
      email: yup.string().required().email(),
      cidadeId: yup.number().required(),
    })
  ),
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const UpdateById = async (
  req: Request<IParamProps, {}, IPessoa>,
  res: Response
) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'O parâmetro "id" precisa ser informado.',
      },
    });
  }

  const result = await PessoasPoviders.updateById(req.params.id, req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).json(result);
};
