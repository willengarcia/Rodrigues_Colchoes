import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class FindAllCategory {
    async execute() {
        try {
            const existCategory = await prisma.category.findFirst()
            if(!existCategory){
                console.log('Não há nenhuma categoria cadastrada')
                return {
                    success:false,
                    message:'Não há nenhuma categoria para listar!'
                }
            }
            // Pesquisa todas as categorias
            const findAllCategory = await prisma.category.findMany({
                select:{
                    id:true,
                    name:true,
                    items:true,
                }
            })

            return {
                sucess: true,
                find: findAllCategory
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao pesquisar categorias:", error);
            return {
                'sucess':false,
                'error': error.messsage
            }
        }
    }
}

export { FindAllCategory };
