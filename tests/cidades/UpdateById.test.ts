import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - UpdateById", () => {
  it("Atualiza registro", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const resultUpdate = await testServer
      .put(`/cidades/${resultCreate.body}`)
      .send({ nome: "Caxias" });

    expect(resultUpdate.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });
  it("Tenta atualizar registro que não existe", async () => {
    const result = await testServer
      .put("/cidades/99999")
      .send({ nome: "Caxias" });

    expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.body).toHaveProperty("errors.default");
  });
});
