import { Request, Response } from "express";
import * as yup from "yup";

interface ICidade {
  name: string;
  estado: string;
}

const bodyValidation: yup.SchemaOf<ICidade> = yup.object().shape({
  name: yup.string().required().min(3),
  estado: yup.string().required().min(3),
});

export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
  let validatedData: ICidade | undefined = undefined;

  try {
    validatedData = await bodyValidation.validate(req.body);
  } catch (error) {
    const yupError = error as yup.ValidationError;

    return res.json({
      errors: {
        default: yupError.message,
      },
    });
  }
  console.log(validatedData);

  return res.send("Cidades");
};
