
import { GoogleGenAI, Type } from "@google/genai";

export async function extractHomeworkFromImage(base64Image: string): Promise<{ homeworkText: string; summary: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Tu es MaîtreNotifie, l'assistant expert du professeur João Ferreira au Conservatoire d'Élancourt.
    Analyse cette photo de carnet de musique (style Seyes/Clairefontaine).

    MISSION : Isoler uniquement les instructions de travail pour la séance PROCHAINE.

    DÉTECTION DE STRUCTURE (Basée sur l'image) :
    1. Le haut de la page (ex: 13/12) contient ce qui a été fait AUJOURD'HUI. Résume cela dans 'summary'.
    2. Cherche la ligne charnière, souvent introduite par un jour de la semaine et une date future (ex: "Jeudi pour le 20/12").
    3. Tout ce qui suit cette ligne charnière sont les DEVOIRS. Extrais-les dans 'homeworkText'.

    EXEMPLE DE CIBLE (selon ton image) :
    - "page 44 n° 4 Rythmes + notes"
    - "page 42 n° 1C lecture notes"

    FORMATAGE DU MESSAGE AUX PARENTS :
    Mets en forme de liste claire et élégante. Utilise des emojis musicaux.
    Exemple: "🎼 Devoirs pour le 20/12 : \n- Page 44 n° 4 (Rythmes + notes)..."

    RÉPONSE JSON :
    {
      "homeworkText": "Le texte finalisé pour les parents.",
      "summary": "Résumé de la séance d'aujourd'hui."
    }
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
      homeworkText: result.homeworkText || "Aucun devoir détecté.",
      summary: result.summary || "Séance du jour enregistrée."
    };
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error("Échec de l'analyse.");
  }
}
