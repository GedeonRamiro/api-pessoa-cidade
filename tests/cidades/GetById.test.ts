import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - GetById", () => {
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

  it("Tenta buscar cidade sem usar token de autenticação", async () => {
    const resultSearch = await testServer.get("/cidades/1").send();

    expect(resultSearch.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultSearch.body).toHaveProperty("errors.default");
  });

  it("Buscar registro por id", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const ressultSearch = await testServer
      .get(`/cidades/${resultCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(ressultSearch.statusCode).toEqual(StatusCodes.OK);
    expect(ressultSearch.body).toHaveProperty("nome");
  });

  it("Tentar buscar registro que não existe ", async () => {
    const ressultSearch = await testServer
      .get("/cidades/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(ressultSearch.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(ressultSearch.body).toHaveProperty("errors.default");
  });
});
