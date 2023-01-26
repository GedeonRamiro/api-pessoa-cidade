import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Pessoas - UpdateById", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "create-pessoas@gmail.com";
    await testServer
      .post("/cadastrar")
      .send({ email, senha: "123456", nome: "Teste" });
    const signInRes = await testServer
      .post("/entrar")
      .send({ email, senha: "123456" });

    accessToken = signInRes.body.accessToken;
  });

  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resultCidade = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Timon" });

    cidadeId = resultCidade.body;
  });

  it("Tenta atualizar cidades sem usar token de autenticação", async () => {
    const resultGetAll = await testServer.put("/cidades/1").send();

    expect(resultGetAll.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultGetAll.body).toHaveProperty("errors.default");
  });

  it("Atualizar registro", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: "Gedeon",
        email: "gedeon@hotmail.com",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const resultUpdate = await testServer
      .put(`/pessoas/${resultCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: "Ramiro",
        email: "ramiro@hotmail.com",
      });

    expect(resultUpdate.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it("Tenta atualizar registro que não existe", async () => {
    const resultUpdate = await testServer
      .put("/pessoas/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ cidadeId, nomeCompleto: "Ramiro", email: "ramiro@hotmail.com" });

    expect(resultUpdate.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(resultUpdate.body).toHaveProperty("errors.default");
  });

  it("Atualizar registro sem nenhuma propriedade", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({});

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nomeCompleto");
    expect(resultCreate.body).toHaveProperty("errors.body.email");
    expect(resultCreate.body).toHaveProperty("errors.body.cidadeId");
  });

  it("Atualizar registro com nomeCompleto muito curto", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: "Ge",
        email: "gedeon@hotmail.com",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nomeCompleto");
  });

  it("Atualizar registro sem nomeCompleto", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "gedeon@hotmail.com",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.nomeCompleto");
  });

  it("Atualizar registro com email duplicado", async () => {
    const resultCreate01 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: "Gedeon",
        email: "gedeon@hotmail.com",
      });

    const resultCreate02 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: "Gedeon Duplicado",
        email: "gedeon@hotmail.com",
      });

    expect(resultCreate02.statusCode).toEqual(
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    expect(resultCreate02.body).toHaveProperty("errors.default");
  });

  it("Atualizar registro com email inválido", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: "Gedeon",
        email: "gedeon.com",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.email");
  });

  it("Atualizar registro sem email", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nome: "Gedeon",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.email");
  });

  it("Atualizar registro com cidadeId inválido", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId: "grbc",
        nomeCompleto: "Gedeon",
        email: "gedeon.com",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.cidadeId");
  });

  it("Atualizar registro sem cidadeId", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nomeCompleto: "Gedeon",
        email: "gedeon.com",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreate.body).toHaveProperty("errors.body.cidadeId");
  });
});
