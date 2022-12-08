import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { CidadesProviders } from "../../database/providers/cidades";

import { validation } from "../../shared/middleware";

interface IQueryProps {
  page?: number;
  limit?: number;
  filter?: string;
  id?: number;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    yup.object().shape({
      page: yup.number().notRequired().moreThan(0),
      limit: yup.number().notRequired().moreThan(0),
      filter: yup.string().notRequired(),
      id: yup.number().integer().notRequired().default(0),
    })
  ),
}));

export const getAll = async (
  req: Request<{}, {}, {}, IQueryProps>,
  res: Response
) => {
  const result = await CidadesProviders.getAll(
    req.query.page || 1,
    req.query.limit || 10,
    req.query.filter || "",
    Number(req.query.id)
  );

  const count = await CidadesProviders.count("");

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  } else if (count instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: count.message,
      },
    });
  }

  res.setHeader("access-control-expose-header", "x-total-count");
  res.setHeader("x-total-count", count);

  return res.status(StatusCodes.OK).json(result);
};
