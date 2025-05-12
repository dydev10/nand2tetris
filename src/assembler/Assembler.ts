import CodeGen from "./CodeGen";
import FileHandler from "./FileHandler";
import Parser from "./Parser";

class Assembler {
  file: File;
  code: string;
  lineCount: number;


  constructor(file: File) {
    this.file = file;
    this.code = '';
    this.lineCount = 0;
  }

  async symbolPass() {
    console.log('Symbol parsing not implemented yet. Skipping');
    
  }

  async codePass () {
    const fileHandler = new FileHandler();

    for await (const sourceLine of fileHandler.streamTextFileLines(this.file)) {
      const parser = new Parser(sourceLine);
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