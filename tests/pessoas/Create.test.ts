import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Pessoas - Create", () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resultCidade = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    cidadeId = resultCidade.body;
  });

  it("Cria registro", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      cidadeId,
      nomeCompleto: "Gedeon",
      email: "gedeon@hotmail.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof resultCreate.body).toEqual("number");
  });

  it("Cria registro sem nenhuma propriedade", async () => {
    const resultCreate = await testServer.post("/pessoas").send({});

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nomeCompleto");
    expect(resultCreate.body).toHaveProperty("errors.body.email");
    expect(resultCreate.body).toHaveProperty("errors.body.cidadeId");
  });

  it("Cria registro com nomeCompleto muito curto", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      cidadeId,
      nomeCompleto: "Ge",
      email: "gedeon@hotmail.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nomeCompleto");
  });

  it("Cria registro sem nomeCompleto", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      cidadeId,
      email: "gedeon@hotmail.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nomeCompleto");
  });

  it("Cria registro com email duplicado", async () => {
    const resultCreate01 = await testServer.post("/pessoas").send({
      cidadeId,
      nomeCompleto: "Gedeon",
      email: "gedeon@hotmail.com",
    });

    const resultCreate02 = await testServer.post("/pessoas").send({
      cidadeId,
      nomeCompleto: "Gedeon Duplicado",
      email: "gedeon@hotmail.com",
    });

    expect(resultCreate02.statusCode).toEqual(
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    expect(resultCreate02.body).toHaveProperty("errors.default");
  });

  it("Cria registro com email inválido", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      cidadeId,
      nomeCompleto: "Gedeon",
      email: "gedeon.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.email");
  });

  it("Cria registro sem email", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      cidadeId,
      nome: "Gedeon",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.email");
  });

  it("Cria registro com cidadeId inválido", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      cidadeId: "grbc",
      nomeCompleto: "Gedeon",
      email: "gedeon.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.cidadeId");
  });

  it("Cria registro sem cidadeId", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      nomeCompleto: "Gedeon",
      email: "gedeon.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.cidadeId");
  });
});
