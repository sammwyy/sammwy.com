# Build My Own CPU

Heyoo! In this post, we'll delve into the technical workings of a microprocessor and guide you through implementing a basic microprocessor emulation in C. Whether you're an aspiring hardware engineer, a software developer interested in low-level programming, or just a tech enthusiast, this post will provide a comprehensive understanding.

## Overview

A microprocessor (CPU) is the brain of a computer, responsible for executing program instructions and coordinating the system's operations. Let's break down the key components and processes involved.

### ISA

The ISA (Instruction set architecture) is a critical component of a CPU, defining the set of instructions the processor can execute. It acts as an interface between software and hardware. Different processors have different ISAs, which can affect compatibility, performance, and power consumption.

- **Instruction Types:** Instructions are typically categorized into arithmetic, logical, data transfer, and control flow instructions. For example, an ADD instruction performs addition, while a LOAD instruction moves data from memory to a register.
- **Addressing Modes:** These define how the operand of an instruction is chosen. Common addressing modes include immediate (direct value), direct (specific memory address), indirect (address stored in a register), and indexed (base address plus an offset).
- **Registers:** The ISA defines the set of registers available for use. These include general-purpose registers, special-purpose registers (like the program counter or stack pointer), and status registers.

### Execution Cycle

The execution cycle of a CPU involves several stages, each crucial for processing instructions:

- **Fetch:** The CPU reads the next instruction from memory into the instruction register.
- **Decode:** The control unit decodes the instruction to determine the required actions and operands.
- **Execute:** The ALU performs the operation specified by the instruction.
- **Memory Access:** If the instruction involves memory, the CPU reads or writes data to the specified address.
- **Write-back:** The result of the operation is written back to the register or memory.

Each of these stages must be precisely timed and coordinated to ensure smooth execution of instructions.

### Main Components

- **Control Unit (CU):** The CU manages the instruction fetch, decode, and control signals. It generates the necessary control signals for other components and coordinates the overall operation of the CPU.
- **Arithmetic Logic Unit (ALU):** The ALU performs arithmetic operations (like addition and subtraction) and logical operations (like AND, OR, NOT). It is a fundamental part of the CPU that handles computation.
- **Registers:** Registers are small, fast storage locations within the CPU used for holding data and instructions temporarily. Common registers include the accumulator, program counter, instruction register, and general-purpose registers.
- **Cache:** The cache is high-speed memory located close to the CPU core. It stores frequently accessed data and instructions to reduce the time needed to access memory.

### Pipelining

Pipelining is a technique used to improve the CPU's throughput by allowing multiple instructions to be processed simultaneously at different stages of the execution cycle. This is analogous to an assembly line in a factory, where each stage performs part of the task.

For example, while one instruction is being decoded, another can be fetched from memory, and yet another can be executed. This overlapping of stages increases the CPU's efficiency and overall performance.

### Parallelism

Parallelism further enhances CPU performance by executing multiple instructions or operations simultaneously. There are several forms of parallelism:

- **Instruction-Level Parallelism (ILP):** Multiple instructions are executed in parallel within a single core using techniques like pipelining and out-of-order execution.
- **Data-Level Parallelism (DLP):** The same operation is applied to multiple data elements simultaneously, often using vector processors or SIMD (Single Instruction, Multiple Data) extensions.
- **Multi-core Processing:** Multiple processor cores are integrated onto a single chip, allowing different threads or processes to be executed simultaneously. This form of parallelism is prevalent in modern CPUs.

### Branch Prediction

Branch prediction is a technique used to improve the flow of instruction execution by guessing the outcome of conditional branches. When a branch instruction is encountered, the CPU predicts whether the branch will be taken or not and continues execution accordingly.

Accurate branch prediction helps keep the pipeline full and avoids stalls, improving overall performance. Modern CPUs use sophisticated algorithms and history tables to make accurate predictions.

## Hardware

To understand how a CPU works at a deeper level, it's essential to know about hardware components and logic gates.

### Transistors

Transistors are the fundamental building blocks of modern electronic devices, acting as switches that control the flow of electrical current. In a CPU, billions of transistors are combined to perform complex computations.

- **Bipolar Junction Transistor (BJT):** An early type of transistor used in electronics.
- **Field-Effect Transistor (FET):** Includes MOSFETs (Metal-Oxide-Semiconductor FETs), which are widely used in modern CPUs due to their efficiency and scalability.

### Logic Gates

Logic gates are the basic building blocks of digital circuits, performing simple logical functions like AND, OR, NOT, NAND, NOR, XOR, and XNOR. They are used to create more complex components like adders, multiplexers, and flip-flops.

- **AND Gate:** Outputs true if both inputs are true.
- **OR Gate:** Outputs true if at least one input is true.
- **NOT Gate:** Outputs the inverse of the input.
- **NAND Gate:** Outputs the inverse of the AND gate.
- **NOR Gate:** Outputs the inverse of the OR gate.
- **XOR Gate:** Outputs true if the inputs are different.
- **XNOR Gate:** Outputs true if the inputs are the same.

### Combinational Logic Circuits

These circuits output a specific result based on the inputs provided, with no memory element. Examples include adders, subtractors, and multiplexers.

- **Adder:** Performs binary addition.
- **Half Adder:** Adds two single-bit binary numbers.
- **Full Adder:** Adds three single-bit binary numbers (including carry).
- **Multiplexer:** Selects one of many inputs to be sent to the output.
- **Decoder:** Converts binary data from n input lines to 2^n output lines.

### Sequential Logic Circuits

These circuits have memory elements and can store information. Examples include flip-flops, registers, and counters.

- **Flip-Flop:** A basic memory element that can store one bit of data.
- **SR Flip-Flop:** Set-Reset flip-flop.
- **D Flip-Flop:** Data or Delay flip-flop.
- **JK Flip-Flop:** A versatile flip-flop with inputs J and K.
- **T Flip-Flop:** Toggle flip-flop.
- **Register:** A group of flip-flops used to store multi-bit values.
- **Counter:** A sequential circuit that goes through a prescribed sequence of states.

### Registers and Memory

Registers are small storage locations within the CPU used for holding data temporarily during computations. Memory refers to larger storage areas used for storing instructions and data for longer periods.

- **SRAM (Static RAM):** Faster, used for cache memory.
- **DRAM (Dynamic RAM):** Slower but more cost-effective, used for main memory.
- **ROM (Read-Only Memory):** Non-volatile memory used for firmware.

## Emulation

Creating a microprocessor from scratch is a complex task typically undertaken by specialized teams. However, we can emulate a simple 8-bit processor with a basic instruction set in C.

**1. Define the ISA:**

First, we need to define the set of instructions our processor will support. For example:

```asm
LOAD R1, 0x01  ; Load the value 0x01 into register R1
ADD R1, R2     ; Add the value of R2 to R1
STORE R1, 0x02 ; Store the value of R1 into memory address 0x02
HALT           ; Stop execution
```

**2. Design the Control Unit and ALU:**

The Control Unit decodes instructions and generates control signals to manage the processor.
The ALU performs arithmetic and logical operations.

**3. Create Registers and Memory:**

We need to define registers for temporary data storage and memory for storing instructions and data.

**4. Implement the Execution Cycle:**

Each instruction will go through fetch, decode, execute, memory access, and write-back stages.

**5. Integrate Everything:**

Finally, we integrate all components into a cohesive design that allows the processor to execute a program stored in memory.

### Example code in C

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>

// Define memory and registers
#define MEMORY_SIZE 256
#define NUM_REGISTERS 4

uint8_t memory[MEMORY_SIZE];
uint8_t registers[NUM_REGISTERS];
uint8_t pc = 0; // Program counter

// Instruction set
typedef enum {
    NOP = 0x00, // No operation
    LOAD = 0x01, // LOAD reg, addr
    STORE = 0x02, // STORE reg, addr
    ADD = 0x03, // ADD reg1, reg2
    HALT = 0xFF // HALT
} InstructionSet;

// Decode and execute instructions
void execute_instruction() {
    uint8_t instruction = memory[pc++];
    switch (instruction) {
        case NOP:
            // No operation, simply increment PC
            break;
        case LOAD: {
            uint8_t reg = memory[pc++];
            uint8_t addr = memory[pc++];
            registers[reg] = memory[addr];
            break;
        }
        case STORE: {
            uint8_t reg = memory[pc++];
            uint8_t addr = memory[pc++];
            memory[addr] = registers[reg];
            break;
        }
        case ADD: {
            uint8_t reg1 = memory[pc++];
            uint8_t reg2 = memory[pc++];
            registers[reg1] += registers[reg2];
            break;
        }
        case HALT:
            // Stop execution by setting the PC to an invalid address
            pc = MEMORY_SIZE;
            break;
        default:
            printf("Unknown instruction: 0x%02X\n", instruction);
            exit(1);
    }
}

void load_program(const uint8_t *program, size_t program_size) {
    if (program_size > MEMORY_SIZE) {
        fprintf(stderr, "Program size exceeds memory capacity.\n");
        exit(1);
    }
    // Load program into memory
    for (size_t i = 0; i < program_size; i++) {
        memory[i] = program[i];
    }
}

int main() {
    // Example program: LOAD R0, 0x01; ADD R0, R1; STORE R0, 0x02; HALT
    uint8_t program[] = {
        LOAD, 0x00, 0x01,   // Load value at address 0x01 into R0
        ADD, 0x00, 0x01,    // Add value in R1 to R0
        STORE, 0x00, 0x02,  // Store value of R0 into address 0x02
        HALT                // Halt the program
    };

    // Initialize memory and registers
    memory[0x01] = 0x10; // Data at address 0x01
    registers[0x01] = 0x20; // Initial value in R1

    load_program(program, sizeof(program));

    // Run the CPU until HALT instruction
    while (pc < MEMORY_SIZE) {
        execute_instruction();
    }

    // Output the results
    printf("Final value at memory[0x02]: 0x%02X\n", memory[0x02]);

    return 0;
}
```

### Explanation of the Code

1. **Memory and Registers:**
    The code defines a memory array of 256 bytes and a set of 4 registers, each 8 bits wide. The program counter (pc) keeps track of the current instruction.

2. **Instruction Set:**
    The InstructionSet enum defines the simple instruction set:

    - NOP: No operation.
    - LOAD: Load a value from memory into a register.
    - STORE: Store a value from a register into memory.
    - ADD: Add the value of one register to another.
    - HALT: Stop execution.

3. **Instruction Execution:**
    The execute_instruction function fetches and decodes the next instruction from memory, then executes it by manipulating registers and memory as needed.

4. **Program Loading and Execution:**
    The load_program function loads a program into memory. The main function initializes the memory and registers, loads a simple program, and runs the CPU until a HALT instruction is encountered.

5. **Logic Gates and Basic Circuits:**
    At the lowest level, the operations in our CPU are built using logic gates:

    - AND, OR, NOT Gates: These gates are the building blocks for creating complex logic circuits.
    - Multiplexers and Demultiplexers: Used to select and route signals based on control inputs.
    - Adders: Built using combinations of XOR, AND, and OR gates to perform addition, just like our ADD instruction.

    In a real CPU, the ALU would be composed of these gates to perform arithmetic operations like addition and logical operations like AND, OR, and NOT.

6. **Sequential Circuits:**
    Sequential circuits, like flip-flops and registers, are used to store the state within a CPU. For example, our registers array in the code represents registers that, in hardware, would be implemented using flip-flops or latches.

    - Flip-Flops: Store single bits of data and are used in building registers.
    - Registers: Groups of flip-flops that can store multi-bit values.
    - Counters: These are used to keep track of sequences, similar to how our pc tracks the instruction sequence.

7. Memory and Storage
    In real hardware, memory is implemented using SRAM or DRAM cells, where each cell is built from transistors and capacitors to store bits. The memory array in our code emulates this storage.

8. Control Unit
    The control unit (CU) coordinates the execution of instructions by generating control signals based on the instruction being executed. In hardware, this could be implemented using a combination of logic gates, flip-flops, and microcode (a lower-level set of instructions that controls the CPU).

    In our software emulation, the execute_instruction function acts as the control unit, determining what operations to perform based on the fetched instruction.

## Conclusion

Building your own CPU, whether through hardware design or software emulation, is an enriching way to understand how computers operate at a fundamental level. The process involves mastering both the theoretical aspects of computer architecture and the practical skills of programming and circuit design.

While this blog post provides a basic introduction to CPU design and emulation, the field is vast and complex. Advanced topics like pipelining, branch prediction, out-of-order execution, and multi-core processing offer further opportunities for exploration.

Whether you're diving into digital logic design, exploring assembly programming, or simply emulating a CPU in software, each step brings you closer to understanding the inner workings of the technology that drives the modern world.

Happy coding and happy building! ⸜(｡˃ ᵕ ˂ )⸝♡
