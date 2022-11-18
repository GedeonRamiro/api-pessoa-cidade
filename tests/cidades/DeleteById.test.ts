import { StatusCodes } from "http-status-codes";

import { testServer } from "../jest.setup";

describe("Cidades - DeleteById", () => {
  it("Apaga registro", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const resultDelete = await testServer
      .delete(`/cidades/${resultCreate.body}`)
      .send();

    expect(resultDelete.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it("Tenta apagar registro que não existe", async () => {
    const resultDelete = await testServer.delete("/cidades/99999").send();

    expect(resultDelete.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(resultDelete.body).toHaveProperty("errors.default");
  });
});
