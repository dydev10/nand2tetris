export default class Input {
  keys: string[];

  constructor() {
    this.keys = [];

    // add listeners
    this.setup();
  }
  
  onKeyDown = (e: KeyboardEvent) => {
    const isPressed = this.keys.find((val) => val === e.code);
    if (!isPressed) {
      this.keys = [e.code, ...this.keys];
    }
  }
  
  onKeyUp = (e: KeyboardEvent) => {
    this.keys = this.keys.filter((val) => val !== e.code);    
  }

  setup = () => {    
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  destroy = () => {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
}
