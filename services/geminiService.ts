
import { GoogleGenAI, Type } from "@google/genai";

export async function extractHomeworkFromImage(base64Image: string): Promise<{ homeworkText: string; summary: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Tu es MaîtreNotifie, l'assistant IA spécialisé pour le professeur de musique João Ferreira.
    Analyse cette image d'un tableau ou d'un carnet de musique.
    
    CRITÈRES D'EXTRACTION (CONTEUX FRANÇAIS) :
    1. Repère la section des 'Devoirs' ou 'À faire pour le...'.
    
    2. Transcription fidèle des termes de musique français :
       - 'Rythmes + notes'
       - 'Travail d'oreille'
       - 'Lecture de notes'
       - 'Correction exercice gammes'
       - Références de pages (ex: p. 37 n° 5 et 7, p. 39 n° 10).
    
    3. Si une date est indiquée (ex: 13/12 ou Pour le 20/12), inclus-la obligatoirement.
    
    STRUCTURE DE RÉPONSE JSON :
    - "homeworkText": Le texte structuré des devoirs pour les parents (soit poli et clair).
    - "summary": Un résumé pédagogique de ce qui a été travaillé durant le cours.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            homeworkText: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["homeworkText", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      homeworkText: result.homeworkText || "Transcription impossible.",
      summary: result.summary || "Résumé non disponible."
    };
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error("Échec de l'analyse. Vérifiez l'image.");
  }
}
