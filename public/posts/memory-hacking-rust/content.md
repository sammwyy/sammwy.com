# Process Memory Hacking

Manipulating the memory of an arbitrary process allows us to control its internal behavior to cause another operation than the programmed one. For example:

- Game cheat development.
- Software reverse engineering.
- DRM bypassing (Software cracking).
- Malware development.
- Debugging.
- Performance analysis.

We are going to use the [windows](https://github.com/microsoft/windows-rs) crate to manipulate the memory of a process as we wish.

## Initializing Project

We just need to create a new Rust project and add the windows crate to the dependencies in the `Cargo.toml` file.

```bash
cargo init --bin memory-hacking
```

```toml
[package]
name = "memory-hacking"
version = "0.1.0"
edition = "2021"

# Add this
[dependencies.windows]
version = "0.56.0"
features = [
    "Win32_System_Diagnostics_Debug",
    "Win32_System_Diagnostics_ToolHelp",
    "Win32_Foundation",
    "Win32_System_Threading",
    "Win32_System_LibraryLoader",
]
```

## Creating our Dummy

We are going to create a dummy program to manipulate its memory. The dummy program is going to be a simple loop that prints a message every second.

```rust
use std::{process, ptr::addr_of, thread, time::Duration};

fn main() {
    let pid = process::id();
    let value: i32 = 1337;
    let ptr = addr_of!(value);

    loop {
        println!("PID: {} PTR: {:?}       {}", pid, ptr, value);
        thread::sleep(Duration::from_secs(1));
    }
}
```

Our dummy program is going to print the process ID, the pointer to the text, and the text itself every second. Our goal is to change the text from another process.

## Getting process handle

Before we can manipulate the memory of another process, we need to get a handle to it. We are going to use the `OpenProcess` function to get the handle. The `OpenProcess` function is used to open an existing local process object and returns a handle to the process object. We only need to know the process ID.

```rust
fn main() {
    let pid = 12345; // Dummy program PID
    let handle = unsafe { OpenProcess(PROCESS_VM_READ, false, pid) };

    // Check if the process is open
    if handle.is_err() {
        println!("Failed to open process");
        return;
    }

    let handle = handle.unwrap();
    println!("Process opened!");
}
```

## Reading Memory

We are going to read the memory of the dummy program to get the pointer to the text. We are going to create a function that makes this task easier for us, and we can also pass it any type of primitive data to be able to receive the correct value.

```rust
fn read<T: Default>(handle: HANDLE, pointer: usize) -> T {
    let mut value: T = Default::default();
    let lpbaseaddress = pointer as *const c_void;
    let lpbuffer = &mut value as *mut _ as *mut c_void;
    let nsize = mem::size_of::<T>();

    unsafe {
        let result = ReadProcessMemory(handle, lpbaseaddress, lpbuffer, nsize, None);

        if result.is_err() {
            panic!("Failed to read memory");
        }
    }

    value
}
```

Now we are going to use this in conjunction with what we have written previously. To manipulate data in memory we must have the pointer where it is stored:

```rust
fn main() {
    let pid = 14780; // Dummy program PID
    let pointer = 0xb539b6f43c; // Dummy program pointer
    let handle = unsafe { OpenProcess(PROCESS_VM_READ, false, pid) };

    // Check if the process is open
    if handle.is_err() {
        println!("Failed to open process");
        return;
    }

    let handle = handle.unwrap();
    let value: i32 = read(handle, pointer);

    println!("Value: {}", value);
}
```

All that remains is to run our dummy program, copy the PID, the memory pointer, place it in our main.rs and simultaneously run our script to read its memory. If we did everything right then we will see the following result:

![Result](/posts/memory-hacking-rust/media/screenshot_1.jpg)

## Writing Memory

Now that we can read the memory of another process, we can also write to it. We are going to create a function that makes this task easier for us, and we can also pass it any type of primitive data to be able to write the correct value.

```rust
fn write<T: Default>(handle: HANDLE, pointer: usize, mut data: T) -> bool {
    let lpbaseaddress = pointer as *mut c_void;
    let lpbuffer = &mut data as *mut T as *mut c_void;
    let nsize = mem::size_of::<T>();

    unsafe {
        let result = WriteProcessMemory(handle, lpbaseaddress, lpbuffer, nsize, None);

        if result.is_err() {
            panic!("Failed to write memory");
        }
    }

    true
}
```

We already have our function to write to memory, but we have to make a change in the way we open the process.

Previously we had the following line, which opens a read-only process.

```bash
let handle = unsafe { OpenProcess(PROCESS_VM_READ, false, pid) };
```

Now we are going to open the process with all the permissions to be able to write to it.

```bash
let handle = unsafe { OpenProcess(PROCESS_ALL_ACCESS, false, pid) };
```

Now we can use the function we wrote earlier to manipulate the memory value of our victim process. Let's call it from our main function.

```rust
fn main() {
    let pid = 14780; // Dummy program PID
    let pointer = 0xb539b6f43c; // Dummy program pointer
    let handle = unsafe { OpenProcess(PROCESS_ALL_ACCESS, false, pid) };

    // Check if the process is open
    if handle.is_err() {
        println!("Failed to open process");
        return;
    }

    let handle = handle.unwrap();
    let value: i32 = read(handle, pointer);
    println!("Old value: {}", value);

    // Write new value and check if it was written
    write(handle, pointer, 7777 as i32);

    let value: i32 = read(handle, pointer);
    println!("New value: {}", value);
}
```

If we did everything right, we will see the following result:

![Result](/posts/memory-hacking-rust/media/screenshot_2.jpg)

## All Together

Here is the complete code:

```rust
use std::{mem, os::raw::c_void, panic};

use windows::Win32::{
    Foundation::HANDLE,
    System::{
        Diagnostics::Debug::{ReadProcessMemory, WriteProcessMemory},
        Threading::{OpenProcess, PROCESS_ALL_ACCESS},
    },
};

fn read<T: Default>(handle: HANDLE, pointer: usize) -> T {
    let mut value: T = Default::default();
    let lpbaseaddress = pointer as *const c_void;
    let lpbuffer = &mut value as *mut _ as *mut c_void;
    let nsize = mem::size_of::<T>();

    unsafe {
        let result = ReadProcessMemory(handle, lpbaseaddress, lpbuffer, nsize, None);

        if result.is_err() {
            panic!("Failed to read memory");
        }
    }

    value
}

fn write<T: Default>(handle: HANDLE, pointer: usize, mut data: T) -> bool {
    let lpbaseaddress = pointer as *mut c_void;
    let lpbuffer = &mut data as *mut T as *mut c_void;
    let nsize = mem::size_of::<T>();

    unsafe {
        let result = WriteProcessMemory(handle, lpbaseaddress, lpbuffer, nsize, None);

        if result.is_err() {
            panic!("Failed to write memory");
        }
    }

    true
}

fn main() {
    let pid = 14780; // Dummy program PID
    let pointer = 0xb539b6f43c; // Dummy program pointer
    let handle = unsafe { OpenProcess(PROCESS_ALL_ACCESS, false, pid) };

    // Check if the process is open
    if handle.is_err() {
        println!("Failed to open process");
        return;
    }

    let handle = handle.unwrap();
    let value: i32 = read(handle, pointer);
    println!("Old value: {}", value);

    // Write new value and check if it was written
    write(handle, pointer, 7777 as i32);

    let value: i32 = read(handle, pointer);
    println!("New value: {}", value);
}
```

## Extra: Reading Strings

We can also read strings from memory, but we need to know the length of the string to be able to read it. We are going to create a function "read_str" that will use the previous "read" function to read each character of the string and join it.

```rust
fn read_str(address: usize, size: usize) -> String {
    let mut str = String::new();
    let mut i = 0;

    while i < size {
        let char_ptr = address + (i * 1);
        let char_index: u8 = read(char_ptr);
        let char = char::from(char_index);
        str.push(char);

        i += 1;
    }

    return str;
}
```

## Extra: Writing Strings

Just as we can read strings, we can also write a utility function to write a series of characters in order to memory. Remember that we must have the size of the string before writing it.

```rust
fn write_str(address: usize, str: &str) {
    let mut i = 0;

    for char in str.chars() {
        let char_ptr = address + (i * 1);
        write(char_ptr, char as u8);

        i += 1;
    }
}
```

## Conclusion

We can really put many useful uses to this, it's just a matter of using our manipulation. Rust is a powerful language to perform all kinds of tasks :p
