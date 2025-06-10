import { Request, Response } from "express";
import { ListVendasPorLojaService } from "../../services/user/ListUserService";

export class ListVendasPorLojaController {
  async handle(req: Request, res: Response) {
    const loja = req.params.loja;

    if (!loja) {
      return res.status(400).json({ erro: "Parâmetro 'loja' é obrigatório" });
    }

    try {
      const service = new ListVendasPorLojaService();
      const vendas = await service.execute({ loja });
      return res.json(vendas);
    } catch (err: any) {
      return res.status(500).json({ erro: err.message });
    }
  }
}
