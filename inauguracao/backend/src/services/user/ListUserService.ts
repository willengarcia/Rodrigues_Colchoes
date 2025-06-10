// services/user/ListVendasPorLojaService.ts
import prismaClient from "../../prisma";

interface LojaQuery {
  loja: string;
}

class ListVendasPorLojaService {
  async execute({ loja }: LojaQuery) {
    try {
      const vendas = await prismaClient.venda.findMany({
        where: { loja },
        orderBy: { createdAt: "desc" }, // opcional
        select: {
          id: true,
          nome: true,
          email: true,
          formaPagamento: true,
          subtotal: true,
          status: true,
          loja: true,
          linkImage: true,
          codVendedor:true,
          cep:true,
          cpf:true,
          cv:true,
          auto:true,
          endereco:true,
          qtdTravesseiro:true,
          sanduicheiraElgin:true,
          sanduicheiraMystic:true,
          travesseiro:true,
          createdAt: true,
          updatedAt:true
        },
      });

      return vendas;
    } catch (err: any) {
      throw new Error("Erro ao buscar vendas da loja: " + err.message);
    }
  }
}

export { ListVendasPorLojaService };
