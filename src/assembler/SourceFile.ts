class SourceFile {
  async *streamSourceLines(file: File): AsyncGenerator<string, void, void> {
    const decoder = new TextDecoder('utf-8');
    const reader = file.stream().getReader();
    let { value: chunk, done } = await reader.read();
    let buffer = '';

    while (!done) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // skip empty and comment lines
        if (!trimmedLine.length || trimmedLine.startsWith('//')) {
          continue;
        }

        yield trimmedLine;
      }

      ({ value: chunk, done } = await reader.read());
    }

    if (buffer) {
      const trimmedBuffer = buffer.trim();
      yield trimmedBuffer;
    }
  }
}

export default SourceFile;
