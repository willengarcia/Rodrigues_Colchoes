import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface DadosItens{
    idSubcategoryReference:number;
}
class FindAllItemToSubcategory {
    async execute({idSubcategoryReference}:DadosItens) {
        try {
            const existItem = await prisma.item.findFirst()
            if(!existItem){
                console.log('Não há nenhuma subcategoria cadastrada')
                return {
                    success:false,
                    message:'Não há nenhuma subcategoria para listar!'
                }
            }

            // Pesquisa todas as Subcategorias
            const findAllItemtoSubcategory = await prisma.item.findMany({
                where:{
                    subCategoryId:idSubcategoryReference
                },
                select:{
                    id:true,
                    name:true,
                    imagePath:true,
                    link:true,
                    price:true,
                    sales:true,
                }
            })

            return {
                sucess: true,
                find: findAllItemtoSubcategory
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao pesquisar subcategorias:", error);
            return {
                'sucess':false,
                'error': error.message
            }
        }
    }
}

export { FindAllItemToSubcategory };
