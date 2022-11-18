import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - GetById", () => {
  it("Buscar registro por id", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .send({ id: 1, nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const ressultSearch = await testServer
      .get(`/cidades/${resultCreate.body}`)
      .send();

    expect(ressultSearch.statusCode).toEqual(StatusCodes.OK);
    expect(ressultSearch.body).toHaveProperty("nome");
  });

  it("Tentar buscar registro que não existe ", async () => {
    const ressultSearch = await testServer.get("/cidades/99999").send();

    expect(ressultSearch.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(ressultSearch.body).toHaveProperty("errors.default");
  });
});
