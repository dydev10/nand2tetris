import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function ParserPage(): JSX.Element {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const lineNumbers: string = Array.from({ length: input.split("\n").length }, (_, i) => i + 1).join("\n");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
    };
    reader.readAsText(file);
  };

  const handleDownload = (): void => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateOutput = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await mockAsyncParser(input);
      setOutput(result);
    } catch (error) {
      setOutput("Error generating output");
    } finally {
      setLoading(false);
    }
  };

  const mockAsyncParser = async (text: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(text.toUpperCase());
      }, 1000);
    });
  };

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="w-1/2 h-full flex flex-col font-mono text-sm overflow-auto">
        <div className="p-2 bg-zinc-200 dark:bg-zinc-700 border-b border-zinc-300 dark:border-zinc-600 flex items-center gap-2">
          <input type="file" accept=".asm" onChange={handleFileChange} className="text-sm" />
          <button
            onClick={generateOutput}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Generate Output
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-4 text-right select-none">
            <pre>{lineNumbers}</pre>
          </div>
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none p-4 bg-white dark:bg-zinc-900 text-black dark:text-white border-r border-zinc-300 dark:border-zinc-700 outline-none overflow-hidden"
            value={input}
            onChange={handleChange}
            placeholder="Enter your text here..."
          />
        </div>
      </div>
      <div className="w-1/2 h-full flex flex-col bg-zinc-50 dark:bg-zinc-800 text-sm text-black dark:text-white overflow-auto">
        <div className="p-2 border-b border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-700 flex justify-between items-center">
          <span>{loading ? "Generating..." : "Output"}</span>
          <button
            onClick={handleDownload}
            disabled={!output || loading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Download Output
          </button>
        </div>
        <div className="p-4 overflow-auto">
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}
