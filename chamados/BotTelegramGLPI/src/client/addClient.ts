import { PrismaClient } from '@prisma/client';

interface DadosClient {
    username: string;
    email?: string;
    userId: string;
}

const prisma = new PrismaClient();

class AddClient {
    async execute({
        username,
        email,
        userId
    }: DadosClient) {
        try {
            // cliente já existe?
            const existClient = await prisma.user.findFirst({
                where: {
                    userId: userId,
                }
            });

            if (existClient) {
                console.log('Cliente já existe')
                return {
                    userId:existClient.userId,
                    username:existClient.username,
                    saldo:existClient.balance,
                    bonus:existClient.balanceDiamonds
                };
            }

            // Cria um novo cliente
            const createClient = await prisma.user.create({
                data: {
                  email:'',
                  userId: userId,
                  username: username,
                }, select:{
                  userId:true,
                  username:true,
                  balance:true,
                  balanceDiamonds:true
                }
            });

            return {
                userId:createClient.userId,
                username:createClient.username,
                saldo:createClient.balance,
                bonus:createClient.balanceDiamonds
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao criar cliente:", error);
        }
    }
}

export { AddClient };
