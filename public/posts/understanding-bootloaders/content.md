# Understanding Bootloaders: A Technical Dive into BIOS, UEFI, and Entry Points

Heyoo!! Bootloaders are crucial components in the process of booting up a computer system. They bridge the gap between the firmware and the operating system, initializing hardware and loading the operating system kernel. We will delve into how bootloaders work, their stages, and provide detailed examples in assembly and C, focusing on both BIOS and UEFI systems.

## What is a Bootloader?

A bootloader is a small program that is executed when a computer is powered on or reset. Its primary purpose is to load and transfer control to the operating system kernel. The bootloader operates in several stages, gradually initializing hardware and setting up the necessary environment for the kernel to execute.

## BIOS vs UEFI

Before diving into the specifics of bootloader stages, it's important to understand the two primary types of firmware interfaces: BIOS (Basic Input/Output System) and UEFI (Unified Extensible Firmware Interface).

### Overview

**BIOS** is the traditional firmware interface used in most PCs until the advent of UEFI. It initializes and tests the system hardware components and loads a bootloader from a storage device. BIOS operates in 16-bit real mode, providing a limited environment for bootloaders.

**UEFI** is the modern replacement for BIOS, offering a more flexible and feature-rich interface. It operates in 32-bit or 64-bit mode, provides a more extensive set of services, and can boot from larger storage devices. UEFI also includes a feature called Secure Boot, which ensures that only trusted software is loaded during the boot process.

## Stages of a Bootloader

A bootloader typically operates in multiple stages. The number of stages and their complexity can vary, but a common design involves two main stages:

1. **Stage 1:** This is a small piece of code that fits within the first sector of a storage device (typically 512 bytes for BIOS systems). Its primary job is to load the Stage 2 bootloader.
2. **Stage 2:** This stage is larger and contains more complex logic for loading the operating system kernel.

## BIOS Bootloader in ASM

Here is an example of a simple Stage 1 bootloader written in x86 assembly for a BIOS system:

```asm
; bootloader.asm
BITS 16
ORG 0x7C00

start:
    ; Print a message
    mov si, message
    call print_string

    ; Load the kernel (let's assume the kernel is at sector 2)
    mov ax, 0x0000
    mov es, ax
    mov bx, 0x1000   ; Load at 0x1000:0000 (physical address 0x10000)
    mov ah, 0x02
    mov al, 0x04     ; Number of sectors to load
    mov ch, 0x00
    mov cl, 0x02     ; Starting at sector 2
    mov dh, 0x00
    mov dl, 0x00     ; First (and only) floppy drive
    int 0x13

    ; Jump to the kernel entry point
    jmp 0x1000:0x0000

print_string:
    .loop:
        lodsb
        test al, al
        jz .done
        mov ah, 0x0E
        int 0x10
        jmp .loop
    .done:
        ret

message db 'Loading...', 0

TIMES 510-($-$$) db 0
DW 0xAA55
```

### Explanation of the Assembly Code

1. **BITS 16 and ORG 0x7C00:**
    - These directives set the code to 16-bit mode and specify the origin address (0x7C00) where the BIOS loads the bootloader.

2. **start:**
    - The entry point of the bootloader. It prints a message, loads the kernel from the disk, and jumps to the kernel entry point.

3. **print_string:**
    - A simple routine to print a null-terminated string using BIOS interrupt 0x10.

4. **Loading the Kernel:**
    - The code segment moves the kernel to the memory address 0x10000 (segment:offset 0x1000:0x0000) and uses BIOS interrupt 0x13 to read the kernel from the disk starting from sector 2.

5. **Jump to the Kernel Entry Point:**
    - The `jmp 0x1000:0x0000` instruction jumps to the loaded kernel at the specified memory address.

6. **TIMES 510-($-$$) db 0:**
    - Pads the bootloader to 510 bytes to ensure the boot sector is exactly 512 bytes in size.

7. **DW 0xAA55:**
    - The boot signature, required for BIOS to recognize the bootloader. This must be the last two bytes of the boot sector.

## UEFI Bootloader in C

Creating a bootloader for UEFI is more complex due to the advanced features and 64-bit mode. Below is a simplified example in C:

```c
// bootloader.c
#include <efi.h>
#include <efilib.h>

EFI_STATUS
EFIAPI
efi_main (EFI_HANDLE ImageHandle, EFI_SYSTEM_TABLE *SystemTable) {
    InitializeLib(ImageHandle, SystemTable);
    Print(L"Hello, UEFI World!\n");

    // Load and start the kernel
    EFI_LOADED_IMAGE *LoadedImage;
    EFI_FILE_IO_INTERFACE *FileSystem;
    EFI_FILE *Root, *KernelFile;
    UINTN FileInfoSize = 0;
    EFI_FILE_INFO *FileInfo = NULL;
    EFI_PHYSICAL_ADDRESS KernelBase = 0x100000;

    // Get the loaded image protocol
    SystemTable->BootServices->HandleProtocol(ImageHandle, &gEfiLoadedImageProtocolGuid, (void **)&LoadedImage);
    
    // Get the file system protocol
    SystemTable->BootServices->HandleProtocol(LoadedImage->DeviceHandle, &gEfiSimpleFileSystemProtocolGuid, (void **)&FileSystem);
    
    // Open the root directory
    FileSystem->OpenVolume(FileSystem, &Root);
    
    // Open the kernel file
    Root->Open(Root, &KernelFile, L"kernel.bin", EFI_FILE_MODE_READ, 0);
    
    // Get the file info size
    KernelFile->GetInfo(KernelFile, &gEfiFileInfoGuid, &FileInfoSize, NULL);
    FileInfo = AllocatePool(FileInfoSize);
    KernelFile->GetInfo(KernelFile, &gEfiFileInfoGuid, &FileInfoSize, FileInfo);

    // Read the kernel file into memory
    KernelFile->Read(KernelFile, &FileInfo->FileSize, (void *)KernelBase);

    // Close the file
    KernelFile->Close(KernelFile);

    // Jump to the kernel entry point
    void (*KernelEntry)(void) = (void (*)(void))KernelBase;
    KernelEntry();

    // Halt the system
    while (1);
    
    return EFI_SUCCESS;
}
```

### Explanation of the UEFI C Code

1. **efi_main:**
    - The entry point for UEFI applications. It initializes the UEFI library and prints a message.

2. **EFI_LOADED_IMAGE and EFI_FILE_IO_INTERFACE:**
    - Structures for handling the loaded image and file system.

3. **Loading the Kernel:**
    - **HandleProtocol:** Obtains the loaded image protocol and file system protocol.
    - **OpenVolume:** Opens the root directory of the file system.
    - **Open:** Opens the kernel file.
    - **GetInfo:** Retrieves file information (size, attributes) for the kernel file.
    - **Read:** Reads the kernel file into memory at the specified physical address (0x100000).

4. **Jump to the Kernel Entry Point:**
    - Converts the kernel base address to a function pointer and calls it, transferring control to the kernel.

5. **Halt the System:**
    - Enters an infinite loop to halt the system after the kernel is executed.

## Writing a Kernel

Here is a simple example of a microkernel or kernel entry point in C:

```c
// kernel.c
void kernel_main(void) {
    char *video_memory = (char *)0xb8000;
    const char *message = "Hello, Kernel!";
    for (int i = 0; message[i] != '\0'; ++i) {
        video_memory[i * 2] = message[i];
        video_memory[i * 2 + 1] = 0x07; // Light grey on black
    }

    // Halt the system
    while (1);
}

```

### Explanation of the Kernel Code

1. **kernel_main:**
    - The entry point of the kernel.

2. **video_memory:**
    - Points to the video memory address for text mode (0xb8000).

3. **Display Message:**
    - Writes a message directly to the video memory.

4. **Halt the System:**
    - Enters an infinite loop to halt the system.

## Conclusion

Here the conclusion, YAYYY. I mean, creating a bootloader involves understanding the intricacies of BIOS and UEFI, and writing low-level code to load and start the operating system kernel. While BIOS bootloaders are simpler and operate in 16-bit real mode, UEFI bootloaders are more complex, operating in 32-bit or 64-bit mode with advanced features. By breaking down the process into stages and using examples in assembly and C, we can gain a deeper understanding of how bootloaders work and how to create them.
