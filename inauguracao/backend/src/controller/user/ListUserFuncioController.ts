import { Request, Response } from "express";
import { ListAllLojasService } from "../../services/user/ListUserFuncioServices";

export class ListAllLojasController {
  async handle(req: Request, res: Response) {
    try {
      const service = new ListAllLojasService();
      const lojas = await service.execute();
      return res.json(lojas);
    } catch (err: any) {
      return res.status(500).json({ erro: err.message });
    }
  }
}
