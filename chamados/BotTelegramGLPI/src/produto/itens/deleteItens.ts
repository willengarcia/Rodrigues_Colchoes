import { PrismaClient } from '@prisma/client';

interface DadosItens {
    IdItem:number;
}

const prisma = new PrismaClient();

class DeleteItens {
    async execute({
        IdItem,
    }: DadosItens) {
        try {
            // há produtos na subcategoria?
            const existItems = await prisma.item.findFirst({
                where: {
                    id: IdItem,
                    sales:{
                        some:{}
                    }
                }
            });

            if (existItems) {
                console.log('Há vendas nesse produto')
                return {
                    sucess:false,
                    message: 'Há vendas nesse produto'
                };
            }

            // deleta subcategoria
            const deleteSubCategory = await prisma.item.delete({
                where:{
                    id:IdItem
                }
            })

            return {
                sucess:true,
                isDelete:true,
                message:'Produto deletado com sucesso!'
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao deletar Produto:", error);
            return {
                'sucess':false,
                'error': error.message
            }
        }
    }
}

export { DeleteItens };
