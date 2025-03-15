import { PrismaClient } from '@prisma/client';

interface DadosSubCategory {
    nameSubCategory: string;
    idCategoryReference:number;
}

const prisma = new PrismaClient();

class AddSubCategory {
    async execute({
        nameSubCategory,
        idCategoryReference
    }: DadosSubCategory) {
        try {
            // Subcategoria existe
            const existSubCategory = await prisma.subCategory.findFirst({
                where: {
                    name: nameSubCategory,
                }
            });

            if (existSubCategory) {
                console.log('SubCategoria já existe')
                return {
                    sucess:false,
                    idSubCategory: existSubCategory.id,
                    name:existSubCategory.name,
                    
                };
            }

            // Cria uma nova categoria
            const createSubCategory = await prisma.subCategory.create({
                data: {
                  name:nameSubCategory,
                  categoryId:idCategoryReference,
                }, select:{
                  name:true,
                  id:true
                }
            });

            return {
                sucess:true,
                nameCategory:createSubCategory.name,
                idCategory:createSubCategory.id
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao criar cliente:", error);
            return {
                sucess:false,
                error:error.message
            }
        }
    }
}

export { AddSubCategory };
