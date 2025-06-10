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
exports.ListAllLojasController = void 0;
const ListUserFuncioServices_1 = require("../../services/user/ListUserFuncioServices");
class ListAllLojasController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = new ListUserFuncioServices_1.ListAllLojasService();
                const lojas = yield service.execute();
                return res.json(lojas);
            }
            catch (err) {
                return res.status(500).json({ erro: err.message });
            }
        });
    }
}
exports.ListAllLojasController = ListAllLojasController;
//# sourceMappingURL=ListUserFuncioController.js.map