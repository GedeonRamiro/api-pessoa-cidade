import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Usuarios - SignIn", () => {
  beforeAll(async () => {
    await testServer.post("/cadastrar").send({
      nome: "Gedeon",
      senha: "12345678",
      email: "gedeon@hotmail.com",
    });
  });

  it("Fazer Login", async () => {
    const resultLogin = await testServer.post("/entrar").send({
      email: "gedeon@hotmail.com",
      senha: "12345678",
    });

    expect(resultLogin.statusCode).toEqual(StatusCodes.OK);
    expect(resultLogin.body).toHaveProperty("accessToken");
  });

  it("Entrar sem propriedades", async () => {
    const resultLogin = await testServer.post("/entrar").send({});

    expect(resultLogin.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultLogin.body).toHaveProperty("errors.body.email");
    expect(resultLogin.body).toHaveProperty("errors.body.senha");
  });

  it("Entrar sem email", async () => {
    const resultLogin = await testServer.post("/entrar").send({
      senha: "12345678",
    });

    expect(resultLogin.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultLogin.body).toHaveProperty("errors.body.email");
  });

  it("Entrar com email inválido", async () => {
    const resultLogin = await testServer.post("/entrar").send({
      email: "gedeonhotmail.com",
      senha: "12345678",
    });

    expect(resultLogin.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultLogin.body).toHaveProperty("errors.body.email");
  });

  it("Entrar com email errado", async () => {
    const resultLogin = await testServer.post("/entrar").send({
      email: "gedeonnnn@hotmail.com",
      senha: "12345678",
    });

    expect(resultLogin.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultLogin.body).toHaveProperty("errors.default");
  });

  it("Entrar com senha invalida", async () => {
    const resultLogin = await testServer.post("/entrar").send({
      email: "gedeon@hotmail.com",
      senha: "87654321",
    });

    expect(resultLogin.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultLogin.body).toHaveProperty("errors.default");
  });

  it("Entrar com senha muito curta", async () => {
    const resultLogin = await testServer.post("/entrar").send({
      email: "gedeonhotmail.com",
      senha: "1234",
    });

    expect(resultLogin.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultLogin.body).toHaveProperty("errors.body.senha");
  });

  it("Entrar sem senha", async () => {
    const resultLogin = await testServer.post("/entrar").send({
      email: "gedeonhotmail.com",
    });

    expect(resultLogin.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultLogin.body).toHaveProperty("errors.body.senha");
  });
});
