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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListVendasPorLojaService = void 0;
// services/user/ListVendasPorLojaService.ts
const prisma_1 = __importDefault(require("../../prisma"));
class ListVendasPorLojaService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ loja }) {
            try {
                const vendas = yield prisma_1.default.venda.findMany({
                    where: { loja },
                    orderBy: { createdAt: "desc" }, // opcional
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        formaPagamento: true,
                        subtotal: true,
                        status: true,
                        loja: true,
                        linkImage: true,
                        codVendedor: true,
                        cep: true,
                        cpf: true,
                        cv: true,
                        auto: true,
                        endereco: true,
                        qtdTravesseiro: true,
                        sanduicheiraElgin: true,
                        sanduicheiraMystic: true,
                        travesseiro: true,
                        createdAt: true,
                        updatedAt: true
                    },
                });
                return vendas;
            }
            catch (err) {
                throw new Error("Erro ao buscar vendas da loja: " + err.message);
            }
        });
    }
}
exports.ListVendasPorLojaService = ListVendasPorLojaService;
//# sourceMappingURL=ListUserService.js.map