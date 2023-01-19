import { Router } from "express";
import {
  CidadesController,
  PessoasController,
  UsuariosController,
} from "../controllers";

import { endureAuthenticated } from "../shared/middleware/EndureAuthenticated";

const router = Router();

router.get("/", endureAuthenticated, (_, res) => {
  return res.send("Olá, DEV!");
});

router.get(
  "/cidades",
  endureAuthenticated,
  CidadesController.getAllValidation,
  CidadesController.getAll
);

router.get(
  "/cidades/:id",
  endureAuthenticated,
  CidadesController.getByIdValidation,
  CidadesController.getById
);

router.post(
  "/cidades",
  endureAuthenticated,
  CidadesController.createValidation,
  CidadesController.create
);

router.put(
  "/cidades/:id",
  endureAuthenticated,
  CidadesController.updateByIdValidation,
  CidadesController.UpdateById
);

router.delete(
  "/cidades/:id",
  endureAuthenticated,
  CidadesController.deleteByIdValidation,
  CidadesController.deleteById
);

router.get(
  "/pessoas",
  endureAuthenticated,
  PessoasController.getAllValidation,
  PessoasController.getAll
);

router.get(
  "/pessoas/:id",
  endureAuthenticated,
  PessoasController.getByIdValidation,
  PessoasController.getById
);

router.post(
  "/pessoas",
  endureAuthenticated,
  PessoasController.createValidation,
  PessoasController.create
);

router.delete(
  "/pessoas/:id",
  endureAuthenticated,
  PessoasController.deleteByIdValidation,
  PessoasController.deleteById
);

router.put(
  "/pessoas/:id",
  endureAuthenticated,
  PessoasController.updateByIdValidation,
  PessoasController.UpdateById
);

router.post(
  "/cadastrar",
  UsuariosController.signUpValidation,
  UsuariosController.signUp
);
router.post(
  "/entrar",
  UsuariosController.signInValidation,
  UsuariosController.signIn
);

export { router };
