import { Router } from "express";
import multer from "multer";
import { isAuthenticated } from "./middlewares/isAthenticade";
import { AddVendaController } from "./controller/user/addUserController";
import { ListVendasPorLojaController } from "./controller/user/ListUserController";
import { ListAllLojasController } from "./controller/user/ListUserFuncioController";
const rotas = Router();

// Configurar o multer para armazenar em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rotas
rotas.post('/criarVenda', upload.single('image'), new AddVendaController().handle);

// Rota para listar todas as lojas
rotas.get('/lojas', new ListAllLojasController().handle);

// Rota para listar vendas de uma loja específica
rotas.get('/lojas/:loja', new ListVendasPorLojaController().handle);
export { rotas };
