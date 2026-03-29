export async function callMoondustApi(prompt: string): Promise<string> {
  const apiUrl = process.env.AI_ENDPOINT || "https://api.moondust.cloud/api/generate";
  const authSecret = process.env.AI_AUTH_TOKEN || "";
  const modelName = process.env.AI_MODEL_NAME || "llama3.2:latest";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authSecret) {
      headers["Authorization"] = `Basic ${Buffer.from(authSecret).toString("base64")}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error("Moondust API Error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Détails:", errorText);
      return `[Erreur] Je n'ai pas pu me connecter à mon noyau cognitif Moondust (Code ${response.status}).`;
    }

    const data = await response.json();
    return data.response || "Désolée, je n'ai pas pu extraire la réponse.";
  } catch (error) {
    console.error("Erreur Appel Moondust:", error);
    return "Une erreur technique s'est produite lors de la transmission vers le serveur souverain.";
  }
}
