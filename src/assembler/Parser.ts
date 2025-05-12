

class Parser {
  // label: string | null;
  address: string | null;
  dest: string | null;
  comp: string | null;
  jump: string | null;
  skip: boolean;

  constructor(source: string) {
    // this.label = null;
    this.address = null;
    this.dest = null;
    this.comp = null;
    this.jump = null;
    this.skip = false;

    this.parse(source);
  }

  separateCodeParts(inputStr: string): { dest: string | null, comp: string | null, jump: string | null } {
    const regex = /^([^=;]*)(?:=([^;]*))?(?:;(.*))?$/;
    const matchResult = inputStr.match(regex);

    if (!matchResult) {
      // This case should theoretically not be reached with this specific regex.
      // However, it's good practice for robustness if the regex were to change.
      return { dest: null, comp: null, jump: null };
    }

    return {
      dest: matchResult[1]?.length ? matchResult[1] : null, // Group 1 will always be a string (can be empty).
      comp: matchResult[2]?.length ? matchResult[2] : null, // Group 2 is undefined if "=partB" section didn't match.
      jump: matchResult[3]?.length ? matchResult[3] : null, // Group 3 is undefined if ";partC" section didn't match.
    };
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
    } else if(!this.comp) {
      this.comp = buffer
    }
  }

  parse(source: string) {
    const sourceTrimmed = source.trim();
    
    // set skip flag for empty or comment line and stop parsing
    if (!sourceTrimmed.length || sourceTrimmed.startsWith('//')) {
      this.skip = true;
      return;
    }

    if (this.isAddress(sourceTrimmed)) {
      this.parseAddress(sourceTrimmed);
    } else {
      this.parseCode(sourceTrimmed);
    }
  }
}

export default Parser;
