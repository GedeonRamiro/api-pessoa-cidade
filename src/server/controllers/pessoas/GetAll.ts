import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { PessoasPoviders } from "../../database/providers/pessoas";

import { validation } from "../../shared/middleware";

interface IQueryProps {
  page?: number;
  limit?: number;
  filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    yup.object().shape({
      page: yup.number().integer().notRequired().moreThan(0).default(1),
      limit: yup.number().notRequired().moreThan(0).default(10),
      filter: yup.string().notRequired().default(""),
    })
  ),
}));

export const getAll = async (
  req: Request<{}, {}, {}, IQueryProps>,
  res: Response
) => {
  const result = await PessoasPoviders.getAll(
    req.query.page || 1,
    req.query.limit || 10,
    req.query.filter || ""
  );

  const count = await PessoasPoviders.count(req.query.filter);

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
