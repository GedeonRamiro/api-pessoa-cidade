import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("Pessoas - GetById", () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resultCidade = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    cidadeId = resultCidade.body;
  });

  it("Buscar registro por id", async () => {
    const resultCreate = await testServer.post("/pessoas").send({
      cidadeId,
      nomeCompleto: "Gedeon",
      email: "gedeon_ramiro@hotmail.com",
    });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);

    const ressultSearch = await testServer
      .get(`/pessoas/${resultCreate.body}`)
      .send();

    expect(ressultSearch.statusCode).toEqual(StatusCodes.OK);
    expect(ressultSearch.body).toHaveProperty("nomeCompleto");
  });

  it("tentar buscar registro que não existe", async () => {
    const ressultSearch = await testServer.get("/pessoas/99999").send();

    expect(ressultSearch.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(ressultSearch.body).toHaveProperty("errors.default");
  });
});
