import CodeGen from "./CodeGen";
import SourceFile from "./SourceFile";
import Parser from "./Parser";
import SymbolTable from "./SymbolTable";

class Assembler {
  file: File;
  code: string;
  lineCount: number;
  symbolTable: SymbolTable;

  constructor(file: File) {
    this.file = file;
    this.code = '';
    this.lineCount = 0;

    this.symbolTable = new SymbolTable();
  }

  async symbolPass() {
    const sourceFile = new SourceFile();
    for await (const sourceLine of sourceFile.streamSourceLines(this.file)) {
      this.symbolTable.processLine(sourceLine);
    }
  }

  async codePass () {
    const sourceFile = new SourceFile();

    for await (const sourceLine of sourceFile.streamSourceLines(this.file)) {
      const parser = new Parser(sourceLine, this.symbolTable);
      if (!parser.skip) {
        const codeGen = new CodeGen(parser); 
        this.code += codeGen.result;
        this.code += '\n';
      }
    }
  }

  async assemble() {
    await this.symbolPass();
    await this.codePass();

    return this.code;
  }
}

export default Assembler;