// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
// The algorithm is based on repetitive addition.

// Reset R2 register
  @R2
  M=0

  @R0
  D=M
  @a
  M=D

  @R1
  D=M
  @b
  M=D

  @mul
  M=0
  @i
  M=0

(LOOP)
  @i
  D=M
  @b
  D=M-D
  @STOP
  D;JEQ
  
  @i
  D=M
  @b
  D=D+M
  @STOP
  D;JEQ

  @a
  D=M
  @mul
  M=D+M

  @i
  M=M+1

  @LOOP
  0;JMP
  
(STOP)

  @b
  D=M
  @NEG_B
  D;JLT

  @mul
  D=M
  @R2
  M=D
  @END
  0;JMP

  (NEG_B)
    @mul
    D=M
    @R2
    M=-D

(END)
  @END
  0;JMP