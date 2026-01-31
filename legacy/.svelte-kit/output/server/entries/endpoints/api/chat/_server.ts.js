import { json } from "@sveltejs/kit";
import { g as getProvider } from "../../../../chunks/registry.js";
class ProviderClient {
  constructor(providerId, baseUrl, config) {
    this.providerId = providerId;
    this.baseUrl = baseUrl;
    this.config = config;
  }
  async *streamChat(model, messages) {
    const { apiKey, baseUrl: customBaseUrl } = this.config;
    const url = customBaseUrl || this.baseUrl;
    if (this.providerId === "ollama") {
      yield* this.streamOllama(url, model, messages);
    } else if (this.providerId === "google") {
      yield* this.streamGoogle(url, model, messages, apiKey);
    } else if (this.providerId === "anthropic") {
      yield* this.streamAnthropic(url, model, messages, apiKey);
    } else if (this.providerId === "huggingface") {
      yield* this.streamHuggingFace(url, model, messages, apiKey);
    } else if (this.providerId === "minimax") {
      yield* this.streamMiniMax(url, model, messages, apiKey);
    } else if (this.providerId === "moonshot") {
      yield* this.streamOpenAI(url, model, messages, apiKey);
    } else if (this.providerId === "xai") {
      yield* this.streamOpenAI(url, model, messages, apiKey);
    } else {
      yield* this.streamOpenAI(url, model, messages, apiKey);
    }
  }
  async *streamOpenAI(url, model, messages, apiKey) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.providerId === "megallm" || this.providerId === "agentrouter") {
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else if (this.providerId === "openrouter") {
      headers["Authorization"] = `Bearer ${apiKey}`;
      headers["HTTP-Referer"] = typeof window !== "undefined" ? window.location.origin : "https://chatgpt-clone.vercel.app";
      headers["X-Title"] = "Multi-Provider AI Chat";
    } else {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }
    const response = await fetch(`${url}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: messages.filter((m) => m.role !== "system" || m.content),
        stream: true,
        temperature: 0.7,
        max_tokens: 2e3
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) yield content;
          } catch {
          }
        }
      }
    }
  }
  async *streamOllama(url, model, messages) {
    const response = await fetch(`${url}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, stream: true })
    });
    if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) yield parsed.message.content;
        } catch {
        }
      }
    }
  }
  async *streamGoogle(url, model, messages, apiKey) {
    const contents = messages.filter((m) => m.role !== "system").map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    const response = await fetch(`${url}/models/${model}:streamGenerateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });
    if (!response.ok) throw new Error(`Google error: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) yield text;
        } catch {
        }
      }
    }
  }
  async *streamAnthropic(url, model, messages, apiKey) {
    const response = await fetch(`${url}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: messages.filter((m) => m.role !== "system"),
        system: messages.find((m) => m.role === "system")?.content,
        max_tokens: 2e3,
        stream: true
      })
    });
    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta") {
              yield parsed.delta?.text || "";
            }
          } catch {
          }
        }
      }
    }
  }
  async *streamHuggingFace(url, model, messages, apiKey) {
    const prompt = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
    const response = await fetch(`${url}/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 2e3, temperature: 0.7 },
        stream: true
      })
    });
    if (!response.ok) throw new Error(`HuggingFace error: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      try {
        const parsed = JSON.parse(text);
        if (parsed.generated_text) yield parsed.generated_text;
        else if (parsed.token?.text) yield parsed.token.text;
      } catch {
        yield text;
      }
    }
  }
  async *streamMiniMax(url, model, messages, apiKey) {
    const response = await fetch(`${url}/text/chatcompletion_v2`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: messages.filter((m) => m.role !== "system" || m.content),
        stream: true,
        temperature: 0.7
      })
    });
    if (!response.ok) throw new Error(`MiniMax error: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) yield content;
          } catch {
          }
        }
      }
    }
  }
}
async function POST({ request }) {
  try {
    const { messages, provider: providerId, model, config } = await request.json();
    const provider = getProvider(providerId);
    if (!provider) {
      return json({ error: "Provider not found" }, { status: 400 });
    }
    if (provider.requiresApiKey && !config?.apiKey) {
      return json({ error: "API key required" }, { status: 401 });
    }
    const systemMessage = { role: "system", content: "You are a helpful AI assistant." };
    const allMessages = [systemMessage, ...messages];
    const client = new ProviderClient(providerId, provider.baseUrl || "", config);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of client.streamChat(model, allMessages)) {
            const data = { choices: [{ delta: { content: chunk } }] };
            controller.enqueue(`data: ${JSON.stringify(data)}

`);
          }
          controller.enqueue("data: [DONE]\n\n");
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          let errorMsg = "Unknown error occurred";
          if (error instanceof Error) {
            errorMsg = error.message;
            if (errorMsg.includes("401")) {
              errorMsg = "Invalid API key. Please check your API key in Settings.";
            } else if (errorMsg.includes("402")) {
              errorMsg = "Payment required. Your API key may need credits or a valid payment method.";
            } else if (errorMsg.includes("429")) {
              errorMsg = "Rate limit exceeded. Please wait and try again.";
            } else if (errorMsg.includes("500")) {
              errorMsg = "Provider service error. Please try again later.";
            }
          }
          const data = { choices: [{ delta: { content: `❌ Error: ${errorMsg}` } }] };
          controller.enqueue(`data: ${JSON.stringify(data)}

`);
          controller.enqueue("data: [DONE]\n\n");
          controller.close();
        }
      }
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } catch (error) {
    console.error("API error:", error);
    return json({ error: "Internal error" }, { status: 500 });
  }
}
export {
  POST
};
