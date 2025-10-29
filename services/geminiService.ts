import { Type } from "@google/genai";
import { OPTData, FilterState } from "../types";
import { ai } from "./geminiClient";

export const getAiAnalysis = async (data: OPTData[], userPrompt: string) => {
  // FIX: Removed redundant API key check. Per coding guidelines, we must assume the API key is always available from process.env.API_KEY.
  const dataString = JSON.stringify(data.map(d => ({
    komoditas: d.komoditas,
    jenis_opt: d.jenis_opt,
    kab_kota: d.kab_kota,
    luas_serangan: d.luas_serangan_ringan + d.luas_serangan_sedang + d.luas_serangan_berat + d.luas_serangan_puso,
    luas_pengendalian: d.pengendalian_pm + d.pengendalian_kimia + d.pengendalian_nabati + d.pengendalian_ah + d.pengendalian_cl,
  })), null, 2);

  const prompt = `
    Analyze the following plantation pest (OPT) data from Ciamis Regency.
    Data:
    ${dataString}

    Based on this data, perform the following tasks based on the user request: "${userPrompt}"

    **Summary:** Provide a concise, insightful text summary of the data. Highlight key trends, significant pest outbreaks, and the most affected commodities or regions.

    Return the entire response as a single JSON object. Do not include any text outside of the JSON object.
    `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: "Detailed text analysis of the data." },
                }
            },
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. Please check the console for details.");
  }
};


export const getPublicAiAnalysis = async (data: OPTData[], filters: FilterState, userQuestion?: string) => {
  const dataString = JSON.stringify(data.map(d => ({
    komoditas: d.komoditas,
    jenis_opt: d.jenis_opt,
    tahun: d.tahun,
    periode: d.periode,
    kab_kota: d.kab_kota,
    luas_serangan: d.luas_serangan_ringan + d.luas_serangan_sedang + d.luas_serangan_berat + d.luas_serangan_puso,
  })), null, 2);

  const filterSummary = Object.entries(filters)
    .filter(([, value]) => value !== 'Semua' && value)
    .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
    .join(', ');

  const requestText = userQuestion
    ? `Jawab pertanyaan berikut berdasarkan data dan konteks filter: "${userQuestion}"`
    : `Berikan ringkasan teks yang ringkas dan mendalam tentang data dalam bahasa Indonesia. Sorot tren utama, wabah hama yang signifikan, serta komoditas dan kecamatan yang paling terpengaruh.`;

  const prompt = `
    Anda adalah seorang analis data pertanian ahli. Analisislah data serangan OPT (Organisme Pengganggu Tumbuhan) dari Kabupaten Ciamis berikut.

    Konteks Filter Aktif: ${filterSummary || 'Semua Data'}

    Data:
    ${dataString}

    Tugas Anda:
    ${requestText}

    Pastikan jawaban Anda relevan dengan konteks filter yang diberikan. Kembalikan seluruh respons sebagai objek JSON tunggal. Jangan sertakan teks apa pun di luar objek JSON.
    `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: "Detailed text analysis of the data in Indonesian." },
                }
            },
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. Please check the console for details.");
  }
};
