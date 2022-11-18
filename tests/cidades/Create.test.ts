import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";

describe("Cidades - Create", () => {
  it("Cria registro", async () => {
    const resultCreate = await testServer
      .post("/cidades")
      .send({ nome: "Timon" });

    expect(resultCreate.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof resultCreate.body).toEqual("number");
  });

  it("Tenta criar registro sem nome", async () => {
    const resultCreateNameUndefined = await testServer.post("/cidades").send();

    expect(resultCreateNameUndefined.statusCode).toEqual(
      StatusCodes.BAD_REQUEST
    );
    expect(resultCreateNameUndefined.body).toHaveProperty("errors.body.nome");
  });

  it("Tenta criar registro com nome muito curto", async () => {
    const resultCreateNameShort = await testServer
      .post("/cidades")
      .send({ nome: "Ti" });

    expect(resultCreateNameShort.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(resultCreateNameShort.body).toHaveProperty("errors.body.nome");
  });
});
