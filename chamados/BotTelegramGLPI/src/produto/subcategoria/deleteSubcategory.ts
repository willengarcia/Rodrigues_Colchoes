import { PrismaClient } from '@prisma/client';

interface DadosCategory {
    idSubCategory:number;
}

const prisma = new PrismaClient();

class DeleteSubCategory {
    async execute({
        idSubCategory,
    }: DadosCategory) {
        try {
            // há produtos na subcategoria?
            const existItems = await prisma.subCategory.findFirst({
                where: {
                    id: idSubCategory,
                    items:{
                        some:{}
                    }
                }
            });

            if (existItems) {
                console.log('Há produtos nessa Subcategoria')
                return {
                    sucess:false,
                    message: 'Há produtos nessa subcategoria!'
                };
            }

            // deleta subcategoria
            const deleteSubCategory = await prisma.subCategory.delete({
                where:{
                    id:idSubCategory
                }
            })

            return {
                sucess:true,
                isDelete:true,
                message:'Subcategoria deletada com sucesso!'
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao deletar SubCategoria:", error);
            return {
                'sucess':false,
                'error': error.message
            }
        }
    }
}

export { DeleteSubCategory };
