import { PrismaClient } from '@prisma/client';

interface DadosCategory {
    nameSubCategory: string;
    idSubCategory:number;
}

const prisma = new PrismaClient();

class EditSubCategory {
    async execute({
        nameSubCategory,
        idSubCategory
    }: DadosCategory) {
        try {
            // categoria existe
            const existSubCategory = await prisma.subCategory.findFirst({
                where: {
                    name: nameSubCategory,
                }
            });
            
            // Possível erro de lógica.
            if (existSubCategory) {
                console.log('Categoria já existe')
                return {
                    sucess:false,
                    idCategory: existSubCategory.id,
                    name:existSubCategory.name
                };
            }

            // Editar Categoria
            const editCategory = await prisma.subCategory.update({
                where:{
                    id:idSubCategory,
                },
                data:{
                    name: nameSubCategory
                }
            });

            return {
                sucess:true,
                nameCategory:editCategory.name,
                idCategory:editCategory.id
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao editar SubCategoria:", error);
            return {
                'sucess':false,
                'error': error.message
            }
        }
    }
}

export { EditSubCategory };
