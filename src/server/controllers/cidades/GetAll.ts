import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validation } from "../../shared/middleware/Validation";
import * as yup from "yup";

interface IQueryProps {
  page?: number;
  limit?: number;
  filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    yup.object().shape({
      page: yup.number().notRequired().moreThan(0),
      limit: yup.number().notRequired().moreThan(0),
      filter: yup.string().notRequired(),
    })
  ),
}));

export const getAll = (
  req: Request<{}, {}, {}, IQueryProps>,
  res: Response
) => {
  console.log(req.query);

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send("Não implementado!");
};
