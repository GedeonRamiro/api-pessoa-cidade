import { Router } from "express";
import { CidadesController, PessoasController } from "../controllers";

const router = Router();

router.get("/", (_, res) => {
  return res.send("Olá, DEV!");
});

router.get(
  "/cidades",
  CidadesController.getAllValidation,
  CidadesController.getAll
);

router.get(
  "/cidades/:id",
  CidadesController.getByIdValidation,
  CidadesController.getById
);

router.post(
  "/cidades",
  CidadesController.createValidation,
  CidadesController.create
);

router.put(
  "/cidades/:id",
  CidadesController.updateByIdValidation,
  CidadesController.UpdateById
);

router.delete(
  "/cidades/:id",
  CidadesController.deleteByIdValidation,
  CidadesController.deleteById
);

router.get(
  "/pessoas",
  PessoasController.getAllValidation,
  PessoasController.getAll
);

router.get(
  "/pessoas/:id",
  PessoasController.getByIdValidation,
  PessoasController.getById
);

router.post(
  "/pessoas",
  PessoasController.createValidation,
  PessoasController.create
);

router.delete(
  "/pessoas/:id",
  PessoasController.deleteByIdValidation,
  PessoasController.deleteById
);

router.put(
  "/pessoas/:id",
  PessoasController.updateByIdValidation,
  PessoasController.UpdateById
);

export { router };
