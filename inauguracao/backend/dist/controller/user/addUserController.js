"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVendaController = void 0;
const addUserService_1 = require("../../services/user/addUserService");
class AddVendaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { codVendedor, nome, cpf, email, cep, endereco, formaPagamento, cv, auto, qtdTravesseiro, travesseiro, sanduicheiraElgin, sanduicheiraMystic, subtotal, loja, } = req.body;
            // Pega o buffer da imagem (se existir), via multer no middleware
            const imageBuffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
            console.log("Arquivo recebido:", req.file); // <- deve mostrar info do multer
            const addVendaService = new addUserService_1.AddVendaService();
            try {
                const venda = yield addVendaService.execute({
                    codVendedor,
                    nome,
                    cpf,
                    email,
                    cep,
                    endereco,
                    formaPagamento,
                    cv,
                    auto,
                    qtdTravesseiro: Number(qtdTravesseiro),
                    travesseiro: String(travesseiro),
                    sanduicheiraElgin: String(sanduicheiraElgin),
                    sanduicheiraMystic: String(sanduicheiraMystic),
                    subtotal: Number(subtotal),
                    loja,
                    imageBuffer,
                });
                return res.status(201).json(venda);
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.AddVendaController = AddVendaController;
//# sourceMappingURL=addUserController.js.map