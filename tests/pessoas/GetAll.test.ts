import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Pessoas - GetAll", () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resultCidade = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    cidadeId = resultCidade.body;
  });

  it("Buscar todos os registros", async () => {
    const resultGetAll = await testServer
      .post("/pessoas")
      .send({ cidadeId, nomeCompleto: "Gedeon", email: "gedeon@hotmail.com" });

    expect(resultGetAll.statusCode).toEqual(StatusCodes.CREATED);

    const resultSearch = await testServer.get("/pessoas").send();

    expect(Number(resultSearch.header["x-total-count"])).toBeGreaterThan(0);
    expect(resultSearch.statusCode).toEqual(StatusCodes.OK);
    expect(resultSearch.body.length).toBeGreaterThan(0);
  });
});
