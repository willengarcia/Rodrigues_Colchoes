import { PrismaClient } from '@prisma/client';

interface DadosCategory {
    name: string;
}

const prisma = new PrismaClient();

class AddCategory {
    async execute({
        name
    }: DadosCategory) {
        try {
            // cliente já existe?
            const existCategory = await prisma.category.findFirst({
                where: {
                    name: name,
                }
            });

            if (existCategory) {
                console.log('Categoria já existe')
                return {
                    idCategory: existCategory.id,
                    name:existCategory.name
                };
            }

            // Cria uma nova Category
            const createCategory = await prisma.category.create({
                data: {
                  name:name
                }, select:{
                  name:true,
                  id:true
                }
            });

            return {
                sucess:true,
                nameCategory:createCategory.name,
                idCategory:createCategory.id
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao criar cliente:", error);
        }
    }
}

export { AddCategory };
