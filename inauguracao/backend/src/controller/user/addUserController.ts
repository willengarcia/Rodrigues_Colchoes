import { Request, Response } from "express";
import { AddVendaService } from "../../services/user/addUserService";

export class AddVendaController {
  async handle(req: Request, res: Response) {
    const {
      codVendedor,
      nome,
      cpf,
      email,
      cep,
      endereco,
      formaPagamento,
      cv,
      auto,
      qtdTravesseiro,
      travesseiro,
      sanduicheiraElgin,
      sanduicheiraMystic,
      subtotal,
      loja,
    } = req.body;

    // Pega o buffer da imagem (se existir), via multer no middleware
    const imageBuffer = req.file?.buffer;
    console.log("Arquivo recebido:", req.file); // <- deve mostrar info do multer

    const addVendaService = new AddVendaService();

    try {
      const venda = await addVendaService.execute({
        codVendedor,
        nome,
        cpf,
        email,
        cep,
        endereco,
        formaPagamento,
        cv,
        auto,
        qtdTravesseiro: Number(qtdTravesseiro),
        travesseiro: String(travesseiro),
        sanduicheiraElgin: String(sanduicheiraElgin),
        sanduicheiraMystic: String(sanduicheiraMystic),
        subtotal: Number(subtotal),
        loja,
        imageBuffer,
      });

      return res.status(201).json(venda);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
