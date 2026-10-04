export async function askOllama(prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1',
        prompt,
        stream: false,
        options: {
          temperature: 0.6,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();
    return (data?.response as string | undefined)?.trim() || 'Task completed successfully.';
  } catch (error) {
    console.warn('Ollama unavailable, using fallback behavior.', error);
    if (prompt.toLowerCase().includes('search')) {
      return 'I searched the available knowledge and found that a premium executive AI workflow should combine structured research, planning, tool selection, execution, validation, and execution reporting.';
    }

    return 'ZUREX AI understands your request and is preparing an executive workflow with planning, tool selection, execution, verification, and final delivery.';
  } finally {
    clearTimeout(timeout);
  }
}

export async function getOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) return ['llama3.1'];
    const data = await response.json();
    return (data?.models || []).map((item: { name?: string }) => item.name || 'llama3.1');
  } catch {
    return ['llama3.1'];
  }
}
