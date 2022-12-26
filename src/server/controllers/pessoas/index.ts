import * as create from "./Create";
import * as getById from "./GetById";
import * as deleteById from "./DeleteById";

export const PessoasController = {
  ...create,
  ...getById,
  ...deleteById,
};
