import { GoogleGenAI, Type } from "@google/genai";
import { OPTData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getAiAnalysis = async (data: OPTData[], userPrompt: string) => {
  // FIX: Removed redundant API key check. Per coding guidelines, we must assume the API key is always available from process.env.API_KEY.
  const dataString = JSON.stringify(data.map(d => ({
    komoditas: d.komoditas,
    jenisOpt: d.jenisOpt,
    kabKota: d.kabKota,
    luasSerangan: d.luasSeranganRingan + d.luasSeranganSedang + d.luasSeranganBerat + d.luasSeranganPuso,
    luasPengendalian: d.pengendalianPM + d.pengendalianKimia + d.pengendalianNabati + d.pengendalianAH + d.pengendalianCL,
  })), null, 2);

  const prompt = `
    Analyze the following plantation pest (OPT) data from Ciamis Regency.
    Data:
    ${dataString}

    Based on this data, perform the following tasks based on the user request: "${userPrompt}"

    1.  **Summary:** Provide a concise, insightful text summary of the data. Highlight key trends, significant pest outbreaks, and the most affected commodities or regions.
    2.  **Bar Chart Data:** Generate data for a bar chart showing the total pest attack area ('luasSerangan') per commodity ('komoditas').
    3.  **Pie Chart Data:** Generate data for a pie chart showing the distribution of total pest attack area ('luasSerangan') by pest type ('jenisOpt').

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
                    barChartData: {
                        type: Type.ARRAY,
                        description: "Data for bar chart.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Commodity name" },
                                luasSerangan: { type: Type.NUMBER, description: "Total attack area" }
                            },
                        }
                    },
                    pieChartData: {
                        type: Type.ARRAY,
                        description: "Data for pie chart.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Pest name" },
                                value: { type: Type.NUMBER, description: "Total attack area for this pest" }
                            }
                        }
                    }
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


export const getPublicAiAnalysis = async (data: OPTData[]) => {
  const dataString = JSON.stringify(data.map(d => ({
    komoditas: d.komoditas,
    jenisOpt: d.jenisOpt,
    tahun: d.tahun,
    periode: d.periode,
    luasSerangan: d.luasSeranganRingan + d.luasSeranganSedang + d.luasSeranganBerat + d.luasSeranganPuso,
  })), null, 2);

  const prompt = `
    Analyze the following plantation pest (OPT) data from Ciamis Regency.
    Data:
    ${dataString}

    Based on this data, perform the following tasks:

    1.  **Summary:** Provide a concise, insightful text summary of the data in Indonesian. Highlight key trends, significant pest outbreaks, and the most affected commodities.
    2.  **Bar Chart Data:** Generate data for a bar chart showing the total pest attack area ('luasSerangan') per commodity ('komoditas').
    3.  **Line Chart Data:** Generate data for a line chart showing the trend of total pest attack area over time. Aggregate the 'luasSerangan' for each period, and use a combined 'Tahun-Periode' (e.g., '2023-Triwulan I') as the name/label for the X-axis. Ensure the data is sorted chronologically.

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
                    summary: { type: Type.STRING, description: "Detailed text analysis of the data in Indonesian." },
                    barChartData: {
                        type: Type.ARRAY,
                        description: "Data for bar chart showing attack area per commodity.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Commodity name" },
                                "Luas Serangan": { type: Type.NUMBER, description: "Total attack area" }
                            },
                        }
                    },
                    lineChartData: {
                        type: Type.ARRAY,
                        description: "Data for line chart showing attack area trend over time.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Period (e.g., '2023-Triwulan I')" },
                                "Luas Serangan": { type: Type.NUMBER, description: "Total attack area for that period" }
                            }
                        }
                    }
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
