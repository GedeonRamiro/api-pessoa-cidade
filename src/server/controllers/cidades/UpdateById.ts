import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { ICidade } from "../../database/models";
import { CidadesProviders } from "../../database/providers/cidades";

import { validation } from "../../shared/middleware";

interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<ICidade, "id"> {}

export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      nome: yup.string().required().min(3),
    })
  ),
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const UpdateById = async (
  req: Request<IParamProps, {}, ICidade>,
  res: Response
) => {
  const result = await CidadesProviders.updateById(
    Number(req.params.id),
    req.body
  );

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};
