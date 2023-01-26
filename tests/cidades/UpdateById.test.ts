import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - UpdateById", () => {
  let accessToken = "";

  beforeAll(async () => {
    await testServer
      .post("/cadastrar")
      .send({ email: "gedeon@hotmail.com", senha: "12345678", nome: "Gedeon" });

    const signIn = await testServer
      .post("/entrar")
      .send({ email: "gedeon@hotmail.com", senha: "12345678" });

    accessToken = signIn.body.accessToken;
  });

  it("Tenta atualizar cidade sem usar token de autenticação", async () => {
    const resultUpdate = await testServer
      .put("/cidades/1")
      .send({ nome: "Timon" });

    expect(resultUpdate.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultUpdate.body).toHaveProperty("errors.default");
  });

  it("Atualiza registro", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const resultUpdate = await testServer
      .put(`/cidades/${resultCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Caxias" });

    expect(resultUpdate.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it("Tenta atualizar registro que não existe", async () => {
    const result = await testServer
      .put("/cidades/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Caxias" });

    expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.body).toHaveProperty("errors.default");
  });
});
