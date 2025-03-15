import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface DadosSubcategory{
    idCategoryReference:number;
}
class FindAllSubCategoryToCategory {
    async execute({idCategoryReference}:DadosSubcategory) {
        try {
            const existSubCategory = await prisma.subCategory.findFirst()
            if(!existSubCategory){
                console.log('Não há nenhuma subcategoria cadastrada')
                return {
                    success:false,
                    message:'Não há nenhuma subcategoria para listar!'
                }
            }

            // Pesquisa todas as Subcategorias
            const findAllSubCategory = await prisma.subCategory.findMany({
                where:{
                    categoryId:idCategoryReference
                },
                select:{
                    id:true,
                    name:true,
                    items:true,
                }
            })

            return {
                sucess: true,
                find: findAllSubCategory
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

export { FindAllSubCategoryToCategory };
