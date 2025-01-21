# Understanding Assembly Language

Assembly language (or just ASM) is a low-level programming language that is closely related to machine code, which is directly executed by the computer's CPU. Each instruction in ASM corresponds to a specific operation in the machine code of the CPU. ASM is specific to a particular computer architecture, so different processors have different assembly languages.

## Hello World

For this example, we'll use x86 assembly language, which is used by Intel and AMD processors. We'll write a simple "Hello, World!" program for a 32-bit Linux system.

### Writing the Code

Here’s the complete code for a "Hello, World!" program in assembly language:

```assembly
section .data
    hello db 'Hello, World!', 0   ; The string to print, with a null terminator

section .text
    global _start

_start:
    ; Write the string to stdout
    mov eax, 4       ; syscall number for sys_write
    mov ebx, 1       ; file descriptor 1 is stdout
    mov ecx, hello   ; pointer to the string
    mov edx, 13      ; number of bytes to write
    int 0x80         ; call the kernel

    ; Exit the program
    mov eax, 1       ; syscall number for sys_exit
    xor ebx, ebx     ; exit code 0
    int 0x80         ; call the kernel

```

## Code Explained

Let's break down the "Hello, World!" program to understand how it works:

1. `section .data`:
   - This is a section of the program where you declare initialized data or constants. The .data section typically contains variables that you need to access throughout the program.

   ```plaintext
    section .data
        hello db 'Hello, World!', 0
    ```

    - This declares a string variable hello with the value 'Hello, World!' and a null terminator (`0`).

2. `db (Define Byte):`
   - `db` is used to define a byte or string. It allocates storage space for a variable and initializes it with a specified value.

   ```plaintext
   hello db 'Hello, World!', 0
   ```

   - This defines a byte array (string) with the characters "Hello, World!" followed by a null terminator.

3. `section .text`:
    - This is the section of the program that contains the executable code. The `.text` section is usually marked as read-only and executable.

    ```plaintext
    section .text
        global _start
    ```

    - This marks the beginning of the code section and declares the entry point _start.

4. `global`:
    - The `global` directive makes the specified symbol (label) visible to the linker. This is necessary for defining the entry point of the program.

    ```plaintext
    global _start
    ```

    - This declares `_start` as the entry point of the program, making it accessible to the linker.

5. `_start:`
   - `_start` is the label for the entry point of the program. When the program starts executing, it begins at this label.

    ```plaintext
    _start:
    ```

## Compiling

To compile the assembly code, you will use an assembler like [NASM (Netwide Assembler)](https://www.nasm.us/). First, save the above code to a file named hello.asm. Then, you can compile and link the program as follows:

```bash
nasm -f elf hello.asm  # Assemble the code to an object file
ld -m elf_i386 -s -o hello hello.o  # Link the object file to create the executable
./hello  # Run the executable
```

## How ASM Works

Assembly language provides a way to write programs that are very close to the hardware, giving the programmer fine-grained control over the CPU and memory. Here are some key concepts:

1. **Instructions:** Each line of assembly code is an instruction that tells the CPU to perform a specific operation, such as moving data between registers, performing arithmetic, or interacting with memory.
2. **Registers:** The CPU has a limited number of registers, which are small storage locations used to hold data that the CPU is currently working on. Common registers in x86 architecture include `eax`, `ebx`, `ecx`, and `edx`.
3. **Memory Addressing:** Assembly language allows direct access to memory addresses. You can load data from memory into registers, store data from registers into memory, and perform operations on memory addresses.
4. **System Calls:** To interact with the operating system, assembly programs often use system calls. These are special instructions that transition control from user space to kernel space, allowing the program to request services from the operating system, such as writing to the screen or reading from a file.
5. **Control Flow:** Assembly language provides instructions for controlling the flow of the program, such as jumps (`jmp`), conditional jumps (`je`, `jne`, etc.), and function calls (call and ret).

Understanding assembly language requires a solid grasp of computer architecture and how the CPU executes instructions. By learning assembly, you gain a deeper understanding of how high-level programming languages are translated into machine code and how the hardware executes those instructions.

## Instructions

Instructions in assembly language are the basic building blocks of a program. Each instruction corresponds to a specific operation that the CPU can perform. Here are some common instructions in x86 assembly language:

1. **Data Movement:** Move data between registers, memory, and immediate values.
   - `mov dest, src`: Move data from source to destination.
   - `push value`: Push a value onto the stack.
   - `pop dest`: Pop a value from the stack into a destination.
2. **Arithmetic:** Perform arithmetic operations on data.
   - `add dest, src`: Add source to destination.
   - `sub dest, src`: Subtract source from destination.
   - `imul dest, src`: Multiply destination by source.
   - `idiv divisor`: Divide the contents of `edx:eax` by the divisor.
3. **Logical:** Perform bitwise logical operations.
   - `and dest, src`: Bitwise AND operation.
   - `or dest, src`: Bitwise OR operation.
   - `xor dest, src`: Bitwise XOR operation.
   - `not dest`: Bitwise NOT operation.
4. **Comparison:** Compare two values and set the flags register.
   - `cmp op1, op2`: Compare op1 and op2.
5. **Control Flow:** Manage the flow of execution.
    - `jmp label`: Unconditional jump to a label.
    - `je label`: Jump if equal (ZF=1).
    - `jne label`: Jump if not equal (ZF=0).
    - `jg label`: Jump if greater (SF = OF and ZF = 0).
    - `jl label`: Jump if less (SF ≠ OF).
    - `call label`: Call a function or subroutine.
    - `ret`: Return from a function.
  
## Registers

Registers are small, fast storage locations within the CPU that hold data to be processed. They are essential for executing instructions and performing calculations. Here are some common registers in the x86 architecture:

- **EAX (Accumulator):** Used for arithmetic operations and storing function return values.
- **EBX (Base  Register):** Often used to hold the base address of arrays on memory buffers.
- **ECX (Count Register):** Used as a loop counter in string and memory operations.
- **EDX (Data Register):** Used for I/O operations and storing results of arithmetic operations.
- **ESI (Source Index) and EDI (Destination Index):** Used for string and array operations.
- **EBP (Base Pointer) and ESP (Stack Pointer):** Used for stack operations and function calls.
- **EIP (Instruction Pointer):** Points to the next instruction to be executed.

## Memory Addressing

Memory addressing modes in assembly language allow you to specify where data is located. Some common addressing modes include:

- **Immediate Addressing:** The operand is a constant value.
  - `mov eax, 5`: Loads the constant value 5 into the `eax` register.
- **Register Addressing:** The operand is a register.
  - `mov eax, ebx`: Copies the value in `ebx` to `eax`.
- **Direct Addressing:** The operand is a memory address.
  - `mov eax, [1234h]`: Loads the value at memory address `1234h` into `eax`.
- **Indirect Addressing:** The operand is a memory address stored in a register.
  - `mov eax, [ebx]`: Loads the value at the address pointed to by `ebx` into `eax`.
- **Indexed Addressing:** Combines base and index registers to calculate the memory address.
  - `mov eax, [ebx + ecx]`: Adds the values in `ebx` and `ecx` to form the address from which the value is loaded into `eax`.

## Control Flow Instructions

Control flow instructions manage the sequence of execution of instructions in a program. They include jumps, loops, and function calls.

### Jumps

Jumps are used to transfer control to another part of the program. They can be unconditional or conditional.

- **Unconditional Jumps:**
  - `jmp label`: Jumps to the specified label unconditionally.
- **Conditional Jumps:**s Execute based on the state of the flags in the EFLAGS register.
  - `je label`: Jump if equal (ZF=1).
  - `jne label`: Jump if not equal (ZF=0).
  - `jg label`: Jump if greater (SF = OF and ZF = 0).
  - `jl label`: Jump if less (SF ≠ OF).

Example of an unconditional jump:

```assembly
_start:
    jmp end_program  ; Unconditional jump to end_program label

end_program:
    ; Program ends here
```

Example of a conditional jump:

```assembly
_start:
    mov eax, 5
    cmp eax, 5       ; Compare eax with 5
    je equal_label   ; Jump to equal_label if eax == 5

equal_label:
    ; Code to execute if eax is equal to 5
```

### Loops

Loops allow repeated execution of a block of code. The `loop` instruction decrements the `ecx` register and jumps to the specified label if `ecx` is not zero.

Example of a loop:

```assembly
section .data
    count db 5

section .text
    global _start

_start:
    mov ecx, [count] ; Load count into ecx
loop_start:
    ; Code to repeat
    loop loop_start  ; Decrement ecx and jump to loop_start if ecx != 0

    ; Exit the program
    mov eax, 1       ; syscall number for sys_exit
    xor ebx, ebx     ; exit code 0
    int 0x80         ; call the kernel
```

## Functions in ASM

Functions in assembly language are blocks of code that perform a specific task and can be called from various places in the program. Functions typically save the state of the registers they use and restore it before returning to the caller.

Example of a function:

```assembly
section .text
    global _start

_start:
    push dword 3     ; Push the second argument
    push dword 5     ; Push the first argument
    call add_numbers ; Call the function
    add esp, 8       ; Clean up the stack (2 arguments * 4 bytes each)

    ; Exit the program
    mov eax, 1       ; syscall number for sys_exit
    xor ebx, ebx     ; exit code 0
    int 0x80         ; call the kernel

add_numbers:
    push ebp         ; Save the base pointer
    mov ebp, esp     ; Set the base pointer to the top of the stack
    mov eax, [ebp+8] ; Get the first argument
    add eax, [ebp+12]; Add the second argument
    pop ebp          ; Restore the base pointer
    ret              ; Return to the caller
```

In this function:

- `push` and `pop` are used to save and restore the base pointer (`ebp`), ensuring that the caller's stack frame is not disrupted.
- `mov` instructions are used to access function arguments from the stack.
- `ret` returns control to the caller by popping the return address from the stack.

## System Calls

System calls are special instructions that allow a program to request services from the operating system kernel, such as input/output operations, process control, and communication. In Linux x86 assembly, the `int 0x80` instruction is used to make a system call. The syscall number is loaded into the `eax` register, and any arguments are loaded into `ebx`, `ecx`, `edx`, etc.

Example of a system call to write to the screen:

```assembly
section .data
    msg db 'Hello, World!', 0   ; The string to print

section .text
    global _start

_start:
    mov eax, 4       ; syscall number for sys_write
    mov ebx, 1       ; file descriptor 1 is stdout
    mov ecx, msg     ; pointer to the string
    mov edx, 13      ; number of bytes to write
    int 0x80         ; call the kernel
```
