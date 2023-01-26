import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Pessoas - GetAll", () => {
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

  it("Tenta buscar cidades sem usar token de autenticação", async () => {
    const resultGetAll = await testServer.get("/cidades").send();

    expect(resultGetAll.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultGetAll.body).toHaveProperty("errors.default");
  });

  it("Buscar todos os registros", async () => {
    const resultGetAll = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ cidadeId, nomeCompleto: "Gedeon", email: "gedeon@hotmail.com" });

    expect(resultGetAll.statusCode).toEqual(StatusCodes.CREATED);

    const resultSearch = await testServer
      .get("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(Number(resultSearch.header["x-total-count"])).toBeGreaterThan(0);
    expect(resultSearch.statusCode).toEqual(StatusCodes.OK);
    expect(resultSearch.body.length).toBeGreaterThan(0);
  });
});
