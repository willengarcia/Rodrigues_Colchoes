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
exports.ListVendasPorLojaController = void 0;
const ListUserService_1 = require("../../services/user/ListUserService");
class ListVendasPorLojaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loja = req.params.loja;
            if (!loja) {
                return res.status(400).json({ erro: "Parâmetro 'loja' é obrigatório" });
            }
            try {
                const service = new ListUserService_1.ListVendasPorLojaService();
                const vendas = yield service.execute({ loja });
                return res.json(vendas);
            }
            catch (err) {
                return res.status(500).json({ erro: err.message });
            }
        });
    }
}
exports.ListVendasPorLojaController = ListVendasPorLojaController;
//# sourceMappingURL=ListUserController.js.map