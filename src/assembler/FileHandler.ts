class FileHandler {
  async *streamTextFileLines(file: File): AsyncGenerator<string, void, void> {
    const decoder = new TextDecoder('utf-8');
    const reader = file.stream().getReader();
    let { value: chunk, done } = await reader.read();
    let buffer = '';

    while (!done) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';

      for (const line of lines) {
        yield line;
      }

      ({ value: chunk, done } = await reader.read());
    }

    if (buffer) {
      yield buffer;
    }
  }
}

export default FileHandler;
