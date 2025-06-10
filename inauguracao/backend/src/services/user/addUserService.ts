import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";
import { Readable } from "stream";

interface VendaRequest {
  codVendedor: string;
  nome: string;
  cpf: string;
  email: string;
  cep: string;
  endereco: string;
  formaPagamento: "DINHEIRO" | "PIX" | "CREDITO" | "DEBITO";
  cv?: string;
  auto?: string;
  qtdTravesseiro: number;
  travesseiro: string;
  sanduicheiraElgin: string;
  sanduicheiraMystic: string;
  subtotal: number;
  loja: string;
  imageBuffer?: Buffer; // imagem opcional
}

class AddVendaService {
  async execute(data: VendaRequest) {
    try {
      let imageUrl = "";

      if (data.imageBuffer) {
        console.log("Enviando imagem para o Cloudinary...");

        imageUrl = await new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) {
                console.error("Erro no upload do Cloudinary:", error);
                return reject(error);
              }
              console.log("Upload feito com sucesso:", result?.secure_url);
              resolve(result?.secure_url || "");
            }
          );

          const stream = Readable.from(data.imageBuffer);
          stream.pipe(uploadStream).on("error", reject);
        });
      }


      const novaVenda = await prismaClient.venda.create({
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
      console.log("imagem: "+data.imageBuffer)
      return novaVenda;
    } catch (err: any) {
      console.error("Erro ao criar venda:", err);
      throw new Error("Erro ao registrar a venda.");
    }
  }
}

export { AddVendaService };
