import { StatusCodes } from "http-status-codes";

import { testServer } from "../jest.setup";

describe("Pessoas - DeleteById", () => {
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

  it("Tenta apagar cidade sem usar token de autenticação", async () => {
    const resultDelete = await testServer.delete("/cidades/1").send();

    expect(resultDelete.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resultDelete.body).toHaveProperty("errors.default");
  });

  it("Apagar registro", async () => {
    const resultCreate = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: "Gedeon",
        email: "gedeon_ramiro@hotmail.com",
      });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const resultDelete = await testServer
      .delete(`/pessoas/${resultCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resultDelete.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it("Tenta apagar registro que não existe", async () => {
    const resultCreate = await testServer
      .delete("/pessoas/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resultCreate.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(resultCreate.body).toHaveProperty("errors.default");
  });
});
