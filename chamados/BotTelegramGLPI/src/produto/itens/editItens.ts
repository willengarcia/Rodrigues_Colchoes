import { PrismaClient } from '@prisma/client';

interface DadosItens {
    nameItem: string;
    idItem:number;
    price:string;
    link?:string;
    imagePath?:string;
}

const prisma = new PrismaClient();

class EditItens {
    async execute({
        nameItem,
        idItem,
        price,
        link,
        imagePath,
    }: DadosItens) {
        try {
            // categoria existe
            const existItem = await prisma.item.findFirst({
                where: {
                    name: nameItem,
                }
            });
            
            // Possível erro de lógica.
            if (existItem) {
                console.log('Categoria já existe')
                return {
                    sucess:false,
                    idItem: existItem.id,
                    name:existItem.name
                };
            }

            // Editar Categoria
            const editItem = await prisma.item.update({
                where:{
                    id:idItem,
                },
                data:{
                    name: nameItem,
                    price:Number(price),
                    link:link,
                    imagePath:imagePath
                }
            });

            return {
                sucess:true,
                nameCategory:editItem.name,
                idCategory:editItem.id
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

export { EditItens };
