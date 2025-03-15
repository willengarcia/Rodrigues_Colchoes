import { PrismaClient } from '@prisma/client';

interface DadosClient {
    userId: string;
}

const prisma = new PrismaClient();

class FindClient {
    async execute({
        userId
    }: DadosClient) {
        try {
            // cliente existe?
            const existClient = await prisma.user.findFirst({
                where: {
                    userId: userId,
                }
            });

            if (!existClient) {
                console.log("Cliente não existe");
                return {alert:'Cliente não existe!'};
            }

            // Pesquisa dados do client
            const pesquisaClient = await prisma.user.findMany({
                where:{
                    userId:userId
                },
                select:{
                    userId:true,
                    username:true,
                    balance:true,
                    balanceDiamonds:true,
                    lastBought:true,
                    isActionPending:true,
                    isBlacklisted:true,
                    sales:true,
                    purchasedItems:true
                }
            });

            return pesquisaClient;

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao pesquisar cliente:", error);
        }
    }
}

export { FindClient };
