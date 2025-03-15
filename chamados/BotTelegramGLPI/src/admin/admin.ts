import { Telegraf, Context } from 'telegraf';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const api = process.env.TOKEN_API || "";
const bot = new Telegraf(api);

