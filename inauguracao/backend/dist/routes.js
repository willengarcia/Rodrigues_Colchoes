"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotas = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const addUserController_1 = require("./controller/user/addUserController");
const ListUserController_1 = require("./controller/user/ListUserController");
const ListUserFuncioController_1 = require("./controller/user/ListUserFuncioController");
const rotas = (0, express_1.Router)();
exports.rotas = rotas;
// Configurar o multer para armazenar em memória
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// Rotas
rotas.post('/criarVenda', upload.single('image'), new addUserController_1.AddVendaController().handle);
// Rota para listar todas as lojas
rotas.get('/lojas', new ListUserFuncioController_1.ListAllLojasController().handle);
// Rota para listar vendas de uma loja específica
rotas.get('/lojas/:loja', new ListUserController_1.ListVendasPorLojaController().handle);
//# sourceMappingURL=routes.js.map