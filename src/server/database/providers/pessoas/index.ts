import * as create from "./Create";
import * as getById from "./GetById";
import * as deleteById from "./DeleteById";
import * as updateById from "./UpdateById";
import * as getAll from "./GetAll";
import * as count from "./Count";

export const PessoasPoviders = {
  ...create,
  ...getById,
  ...deleteById,
  ...updateById,
  ...getAll,
  ...count,
};
