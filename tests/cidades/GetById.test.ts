import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - GetById", () => {
  it("Buscar registro por id", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

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

describe("Cidades - GetById", () => {
  it("Busca registro por id", async () => {
    const res1 = await testServer
      .post("/cidades")
      .send({ nome: "Caxias do sul" });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resBuscada = await testServer.get(`/cidades/${res1.body}`).send();

    expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
    expect(resBuscada.body).toHaveProperty("nome");
  });
  it("Tenta buscar registro que não existe", async () => {
    const res1 = await testServer.get("/cidades/99999").send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });
});
