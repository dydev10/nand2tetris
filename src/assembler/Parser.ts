class Parser {
  // label: string | null;
  address: string | null;
  dest: string | null;
  comp: string | null;
  jump: string | null;

  constructor(source: string) {
    // this.label = null;
    this.address = null;
    this.dest = null;
    this.comp = null;
    this.jump = null;

    this.parse(source);
  }

  isAddress(source: string) {
    return source?.startsWith('@');
  }

  parseAddress(source: string) {
    this.address = source.substring(1);
  }

  parseCode(source: string) {
    let buffer = '';
    for (let i = 0; i < source.length; i++) {
      const c = source[i];

      switch (c) {
        case '=':
          this.dest = buffer;
          buffer = '';
          break;
      
        case ';':
          this.comp = buffer
          buffer = '';
          break;
      
        default:
          buffer += c;
          break;
      }
    }

    if (this.comp) {
      this.jump = buffer;
    } else {
      this.comp = buffer
    }
  }

  parse(source: string) {
    const sourceTrimmed = source.trim();
    
    if (this.isAddress(sourceTrimmed)) {
      this.parseAddress(sourceTrimmed);
    } else {
      this.parseCode(sourceTrimmed);
    }
  }
}

export default Parser;
