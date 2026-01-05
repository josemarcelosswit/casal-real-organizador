
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[], monthName: string) => {
  if (transactions.length === 0) return `Mês de ${monthName} e você ainda não anotou nada? O relógio tá correndo e o dinheiro tá sumindo! Como diz o Julius: 'Se eu não comprar nada, o desconto é maior!'`;

  const summary = transactions.map(t => ({
    tipo: t.type,
    valor: t.amount,
    categoria: t.category,
    descricao: t.description,
    dono: t.owner
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é o Julius da série 'Todo Mundo Odeia o Chris'. 
      Analise os gastos de ${monthName} do casal José e Stephanie. 
      Eles estão economizando para um CRUZEIRO e um CARRO NOVO. 
      Dê 3 broncas ou dicas curtas de economia extremamente pão-duro focadas em ajudar eles a chegarem no navio e no carro sem gastar 1 centavo a mais do que o necessário.
      Use frases icônicas dele. Seja engraçado e direto.
      Transações: ${JSON.stringify(summary)}`,
      config: {
        temperature: 0.9,
      }
    });

    return response.text || "Gastou o dinheiro do cruzeiro em bala? Tenta de novo!";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "O sistema caiu, mas o juros do carro não para! Tente mais tarde.";
  }
};
