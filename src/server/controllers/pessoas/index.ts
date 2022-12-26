import * as create from "./Create";
import * as getById from "./GetById";

export const PessoasController = {
  ...create,
  ...getById,
};
