import { textModel, embedModel, defaultSafety } from "@/src/lib/vertex";

export async function aiGenerateText(system: string, user: string) {
  const res = await textModel.generateContent({
    contents: [
      { role: "user", parts: [{ text: `${system}\n\nUSER:\n${user}` }] },
    ],
    safetySettings: defaultSafety,
  });
  return res.response?.candidates?.[0]?.content?.parts?.map(p => (p as any).text).join("") ?? "";
}

export async function aiEmbed(texts: string[]) {
  // gemini-embedding-001 çok parçalı girişi destekler
  const res = await embedModel.batchEmbedContents({
    requests: texts.map(t => ({ model: embedModel.model, content: { role: "user", parts: [{ text: t }] } })),
  });
  return res.embeddings?.map(e => e.values || []) || [];
}
