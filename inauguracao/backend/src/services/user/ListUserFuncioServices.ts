// services/user/ListAllLojasService.ts
import prismaClient from "../../prisma";

class ListAllLojasService {
  async execute() {
    try {
      const lojas = await prismaClient.venda.findMany({
        select: { id:true, loja: true },
        distinct: ["loja"], // para não repetir
      });

      return lojas;
    } catch (err: any) {
      throw new Error("Erro ao listar lojas: " + err.message);
    }
  }
}

export { ListAllLojasService };
