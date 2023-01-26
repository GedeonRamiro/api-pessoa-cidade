import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - Create", () => {
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

  it("Tenta criar cidade sem usar token de autenticação", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultCreate.body).toHaveProperty("errors.default");
  });

  it("Cria registro", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof resultCreate.body).toEqual("number");
  });

  it("Tenta criar registro sem nome", async () => {
    const resultCreateNameUndefined = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resultCreateNameUndefined.statusCode).toEqual(
      StatusCodes.BAD_REQUEST
    );
    expect(resultCreateNameUndefined.body).toHaveProperty("errors.body.nome");
  });

  it("Tenta criar registro com nome muito curto", async () => {
    const resultCreateNameShort = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Ti" });

    expect(resultCreateNameShort.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreateNameShort.body).toHaveProperty("errors.body.nome");
  });
});
