import { StatusCodes } from "http-status-codes";

import { testServer } from "../jest.setup";

describe("Pessoas - DeleteById", () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resultCidade = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    cidadeId = resultCidade.body;
  });

  it("Apagar registro", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      cidadeId,
      nomeCompleto: "Gedeon",
      email: "gedeon_ramiro@hotmail.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const resultDelete = await testServer
      .delete(`/pessoas/${resultCreate.body}`)
      .send();

    expect(resultDelete.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  it("Tenta apagar registro que não existe", async () => {
    const resultCreate = await testServer.delete("/pessoas/99999").send();

    expect(resultCreate.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(resultCreate.body).toHaveProperty("errors.default");
  });
});
