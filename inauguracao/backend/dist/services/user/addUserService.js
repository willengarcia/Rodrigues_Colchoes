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
exports.AddVendaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const stream_1 = require("stream");
class AddVendaService {
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUrl = "";
                if (data.imageBuffer) {
                    console.log("Enviando imagem para o Cloudinary...");
                    imageUrl = yield new Promise((resolve, reject) => {
                        const uploadStream = cloudinary_1.default.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                            if (error) {
                                console.error("Erro no upload do Cloudinary:", error);
                                return reject(error);
                            }
                            console.log("Upload feito com sucesso:", result === null || result === void 0 ? void 0 : result.secure_url);
                            resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
                        });
                        const stream = stream_1.Readable.from(data.imageBuffer);
                        stream.pipe(uploadStream).on("error", reject);
                    });
                }
                const novaVenda = yield prisma_1.default.venda.create({
                    data: {
                        codVendedor: data.codVendedor,
                        nome: data.nome,
                        cpf: data.cpf,
                        email: data.email,
                        cep: data.cep,
                        endereco: data.endereco,
                        formaPagamento: data.formaPagamento,
                        cv: data.cv,
                        auto: data.auto,
                        qtdTravesseiro: data.qtdTravesseiro,
                        travesseiro: data.travesseiro,
                        sanduicheiraElgin: data.sanduicheiraElgin,
                        sanduicheiraMystic: data.sanduicheiraMystic,
                        subtotal: data.subtotal,
                        loja: data.loja,
                        linkImage: imageUrl,
                        // status padrão PENDING pelo schema
                    },
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        formaPagamento: true,
                        subtotal: true,
                        status: true,
                        loja: true,
                        createdAt: true,
                        linkImage: true,
                    },
                });
                console.log("imagem: " + data.imageBuffer);
                return novaVenda;
            }
            catch (err) {
                console.error("Erro ao criar venda:", err);
                throw new Error("Erro ao registrar a venda.");
            }
        });
    }
}
exports.AddVendaService = AddVendaService;
//# sourceMappingURL=addUserService.js.map