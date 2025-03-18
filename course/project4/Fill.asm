// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Fill.asm

// Runs an infinite loop that listens to the keyboard input. 
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, 
// the screen should be cleared.

(RESET)
  @SCREEN
  D=A
  @addr
  M=D

(GAME_LOOP)
  @KBD
  D=A
  @addr
  D=D-M
  @END
  D;JEQ

  @KBD
  D=M
  @FILL
  D;JGT

  (CLEAR)
    @addr
    A=M
    M=0
    @INC_ADDR
    0;JMP

  (FILL)
    @addr
    A=M
    M=-1
    @INC_ADDR
    0;JMP

  (INC_ADDR)
    @addr
    M=M+1

  @GAME_LOOP
  0;JMP

(END)
  @RESET
  0;JMP
