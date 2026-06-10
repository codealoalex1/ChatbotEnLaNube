import { main } from "../services/model.azure.service.js";

export async function responseModel(req, res) {
  const { input } = req.body;
  if (!input)
    return res
      .status(400)
      .json({ message: "El usuario debe ingresar un input" });
  try {
    const response = await main(input);
    return res.status(200).json({
      message: response,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
}
