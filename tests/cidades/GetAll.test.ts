import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - GetAll", () => {
  it("Buscar todos os registros", async () => {
    const resultGetAll = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    expect(resultGetAll.statusCode).toEqual(StatusCodes.CREATED);

    const resultSearch = await testServer.get("/cidades").send();

    expect(Number(resultSearch.header["x-total-count"])).toBeGreaterThan(0);
    expect(resultSearch.statusCode).toEqual(StatusCodes.OK);
    expect(resultSearch.body.length).toBeGreaterThan(0);
  });
});
