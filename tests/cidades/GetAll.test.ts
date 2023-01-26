import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - GetAll", () => {
  let accessToken = "";
  beforeAll(async () => {
    await testServer
      .post("/cadastrar")
      .send({ email: "gedeon@hotmail.com", senha: "12345678", nome: "Gedeon" });
    const signInRes = await testServer
      .post("/entrar")
      .send({ email: "gedeon@hotmail.com", senha: "12345678" });

    accessToken = signInRes.body.accessToken;
  });

  it("Tenta consultar sem usar token de autenticação", async () => {
    const resultSearch = await testServer.get("/cidades").send();

    expect(resultSearch.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultSearch.body).toHaveProperty("errors.default");
  });

  it("Buscar todos os registros", async () => {
    const resultGetAll = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Timon" });

    expect(resultGetAll.statusCode).toEqual(StatusCodes.CREATED);

    const resultSearch = await testServer
      .get("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(Number(resultSearch.header["x-total-count"])).toBeGreaterThan(0);
    expect(resultSearch.statusCode).toEqual(StatusCodes.OK);
    expect(resultSearch.body.length).toBeGreaterThan(0);
  });
});
