import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - Create", () => {
  it("Cria registro", async () => {
    const result = await testServer.post("/cidades").send({ nome: "Timon" });

    expect(result.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof result.body).toEqual("number");
  });

  it("Tenta criar registro sem nome", async () => {
    const result = await testServer.post("/cidades").send();

    expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.body).toHaveProperty("errors.body.nome");
  });

  it("Tenta criar registro com nome muito curto", async () => {
    const result = await testServer.post("/cidades").send({ nome: "Ti" });

    expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.body).toHaveProperty("errors.body.nome");
  });
});
