"use server";

export async function askBeth(prompt: string) {
  const apiUrl = process.env.MOONDUST_API_URL || "https://api.moondust.cloud/api/generate";
  const authSecret = process.env.MOONDUST_AUTH || "";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authSecret) {
      // Formate l'authentification en Base64 comme exigé par Moondust
      headers["Authorization"] = `Basic ${Buffer.from(authSecret).toString("base64")}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "llama3.2:latest",
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
    console.log('--- DEBUG MOONDUST START ---', JSON.stringify(data, null, 2), '--- END ---');

    const content = data.response || "Désolée, je n'ai pas pu extraire la réponse.";
    return content;
  } catch (error) {
    console.error("Erreur Beth Service:", error);
    return "Une erreur technique s'est produite lors de la transmission vers le serveur souverain.";
  }
}
