import { StatusCodes } from "http-status-codes";

import { testServer } from "../jest.setup";

describe("Cidades - DeleteById", () => {
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

  it("Tenta deletar cidade sem usar token de autenticação", async () => {
    const resultDelete = await testServer
      .delete("/cidades/1")
      .send({ nome: "Timon" });

    expect(resultDelete.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultDelete.body).toHaveProperty("errors.default");
  });

  it("Apaga registro", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const resultDelete = await testServer
      .delete(`/cidades/${resultCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resultDelete.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it("Tenta apagar registro que não existe", async () => {
    const resultDelete = await testServer
      .delete("/cidades/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resultDelete.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(resultDelete.body).toHaveProperty("errors.default");
  });
});
