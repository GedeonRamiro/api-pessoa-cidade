import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("Pessoas - GetById", () => {
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

  it("Tenta buscar cidade sem usar token de autenticação", async () => {
    const resultGetById = await testServer.get("/cidades/1").send();

    expect(resultGetById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultGetById.body).toHaveProperty("errors.default");
  });

  it("Buscar registro por id", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: "Gedeon",
        email: "gedeon_ramiro@hotmail.com",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const ressultSearch = await testServer
      .get(`/pessoas/${resultCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(ressultSearch.statusCode).toEqual(StatusCodes.OK);
    expect(ressultSearch.body).toHaveProperty("nomeCompleto");
  });

  it("tentar buscar registro que não existe", async () => {
    const ressultSearch = await testServer
      .get("/pessoas/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(ressultSearch.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(ressultSearch.body).toHaveProperty("errors.default");
  });
});
