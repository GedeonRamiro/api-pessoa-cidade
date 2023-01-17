import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Usuarios - SignUp", () => {
  it("Cadastrar usuário 01", async () => {
    const resultCreate = await testServer.post("/cadastrar").send({
      nome: "Gedeon",
      email: "gedeon@hotmail.com",
      senha: "12345678",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof resultCreate.body).toEqual("number");
  });

  it("Cadastrar usuário sem propriedades", async () => {
    const resultCreate = await testServer.post("/cadastrar").send({});

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nome");
    expect(resultCreate.body).toHaveProperty("errors.body.email");
    expect(resultCreate.body).toHaveProperty("errors.body.senha");
  });

  it("Cadastrar usuário com nome muito curto", async () => {
    const resultCreate = await testServer.post("/cadastrar").send({
      nome: "Ge",
      email: "gedeon@hotmail.com",
      senha: "12345678",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nome");
  });

  it("Cadastrar usuário sem nome", async () => {
    const resultCreate = await testServer.post("/cadastrar").send({
      email: "gedeon@hotmail.com",
      senha: "12345678",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nome");
  });

  it("Cadastrar usuário com email duplicado", async () => {
    const resultCreate01 = await testServer.post("/cadastrar").send({
      nome: "Gedeon",
      email: "gedeon@hotmail.com",
      senha: "12345678",
    });

    const resultCreate02 = await testServer.post("/cadastrar").send({
      nome: "Gedeon Duplicado",
      email: "gedeon@hotmail.com",
      senha: "12345678",
    });

    expect(resultCreate02.statusCode).toEqual(
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    expect(resultCreate02.body).toHaveProperty("errors.default");
  });

  it("Cadastrar usuário com email inválido", async () => {
    const resultCreate = await testServer.post("/cadastrar").send({
      nome: "Gedeon",
      email: "gedeonhotmail.com",
      senha: "12345678",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.email");
  });

  it("Cadastrar usuário sem email", async () => {
    const resultCreate = await testServer.post("/cadastrar").send({
      nome: "Gedeon",
      senha: "12345678",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.email");
  });

  it("Cadastrar usuário com senha muito curta", async () => {
    const resultCreate = await testServer.post("/cadastrar").send({
      nome: "Gedeon",
      email: "gedeonhotmail.com",
      senha: "1234",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.senha");
  });

  it("Cadastrar usuário sem senha", async () => {
    const resultCreate = await testServer.post("/cadastrar").send({
      nome: "Gedeon",
      email: "gedeonhotmail.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.senha");
  });
});
