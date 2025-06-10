"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
require("dotenv/config");
const app = (0, express_1.default)();
const porta = process.env.PORT || 4000;
const corsOptions = {
    origin: ['https://node-y4wr.vercel.app', 'http://localhost:3000'], // Remova a barra final
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(routes_1.rotas);
app.listen(porta, () => { console.log('Servidor Online'); });
//# sourceMappingURL=server.js.map