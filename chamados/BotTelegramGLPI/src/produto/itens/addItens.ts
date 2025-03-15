import { PrismaClient } from '@prisma/client';

interface DadosItem {
    nameItem: string;
    idCategoryReference?:number;
    idSubcateogryReference?:number;
    price:string;
    link?:string;
    imagePath?:string;
}

const prisma = new PrismaClient();

class AddItem {
    async execute({
        nameItem,
        idCategoryReference,
        idSubcateogryReference,
        price,
        link,
        imagePath,
    }: DadosItem) {
        try {
            // Subcategoria existe
            const existItem = await prisma.item.findFirst({
                where: {
                    name: nameItem,
                }
            });

            if (existItem) {
                console.log('Item já existe!')
                return {
                    sucess:false,
                    idSubCategory: existItem.id,
                    name:existItem.name,
                    
                };
            }

            // Cria uma nova categoria
            const createItem = await prisma.item.create({
                data: {
                  name:nameItem,
                  categoryId:idCategoryReference || null,
                  subCategoryId:idSubcateogryReference || null,
                  price:Number(price),
                  link:link,
                  imagePath:imagePath
                }, select:{
                  id:true,
                  name:true,
                  price:true,
                  link:true,
                  imagePath:true
                }
            });

            return {
                sucess:true,
                nameItem:createItem.name,
                idItem:createItem.id,
                price:createItem.price,
                link:createItem.link,
                imagePath:createItem.imagePath
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao criar Produto:", error);
            return {
                sucess:false,
                error:error.message
            }
        }
    }
}

export { AddItem };
