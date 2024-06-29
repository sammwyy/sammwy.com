# The Minecraft Protocol

The Minecraft Protocol is the set of rules and conventions that define how data is exchanged between the client and server in the Minecraft game. The protocol is used to establish a connection, authenticate users, and exchange game data, such as player movements, chat messages, and block updates.

In this post, we will explore the Minecraft Protocol and learn how to read and write packets to communicate with the Minecraft server.

## Data types

The Minecraft Protocol uses various data types to represent different values, such as integers, strings, and arrays. Understanding these data types is essential for reading and writing packets correctly.

### Data Types Overview

Here are some common data types used in the Minecraft Protocol:

| Name | Size | Encodes | Notes |
|------|------|---------|-------|
| Boolean | 1 | `true` or `false` | Encoded as `0x00` for `false` and `0x01` for `true`. |
| Byte | 1 | Signed 8-bit integer | Range from -128 to 127. |
| Unsigned Byte | 1 | Unsigned 8-bit integer | Range from 0 to 255. |
| Short | 2 | Signed 16-bit integer | Range from -32,768 to 32,767. |
| Unsigned Short | 2 | Unsigned 16-bit integer | Range from 0 to 65,535. |
| Int | 4 | Signed 32-bit integer | Range from -2,147,483,648 to 2,147,483,647. |
| Long | 8 | Signed 64-bit integer | Range from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807. |
| Float | 4 | 32-bit floating-point number | IEEE 754 single-precision floating-point format. |
| Double | 8 | 64-bit floating-point number | IEEE 754 double-precision floating-point format. |
| Text Component |  | NBT Tag | Represents a String for plain text or a compound tag for formatted text. |
| JSON Text |  | JSON string | Encoded as a String with JSON formatting. |
| [VarInt](#varint) |  | Signed 32-bit integer | Variable-length encoding for integers. |
| [VarLong](#varlong) |  | Signed 64-bit integer | Variable-length encoding for long integers. |
| [BitSet](#bitset) |  | Bit Flags | Encoded as a VarInt length followed by a byte array of bit flags. |
| [Fixed BitSet](#fixed-bitset-example) |  | Fixed-Length Bit Flags | Encoded as a byte array of bit flags with a fixed length. |
| [String](#strings) |  | UTF-8 string | Encoded as VarInt length followed by UTF-8 bytes. |
| [Identifier](#identifier) |  | String | Encoded as a String with namespace and path. |
| Entity Metadata |  | NBT Tag | Represents metadata for entities. |
| Slot |  | Item Stack | Represents an item stack in a slot. |
| NBT Tag |  | Compound Tag | Represents a compound tag with key-value pairs. |
| [Position](#position) | 8 | Block Position | Encoded as three 32-bit integers for X, Y, and Z coordinates. |
| Angle | 1 | 1/256th of a full turn | Encoded as a byte representing a rotation angle. |
| UUID | 16 | Universally Unique Identifier | Encoded as 128 bits for a unique identifier. |
| Optional |  | Optional Value | Encoded as a Boolean flag followed by the value if present. |
| Array |  | List of Values | Encoded as a VarInt length followed by the array elements. |
| Enum |  | Enumerated Value | Encoded as a VarInt index for the enum value. |
| Byte Array |  | Array of Bytes | Encoded as a VarInt length followed by the byte array. |

## VarInt

A VarInt (Variable Integer) is a method of serializing integers using a variable number of bytes. This technique is often used in protocols and file formats to efficiently encode integer values of varying lengths, optimizing the amount of storage or bandwidth required.

### VarInt Encoding

VarInt encodes an integer into one or more bytes. The number of bytes used depends on the size of the integer. Each byte has a continuation bit (most significant bit, MSB), which indicates whether the next byte is part of the integer. If the MSB is 1, the next byte is part of the integer. If the MSB is 0, the current byte is the last byte of the integer.

### VarInt Structure

- The integer is divided into 7-bit groups.
- Each group is stored in a byte, with the MSB (8th bit) used as the continuation flag.

### Encoding Steps

1. Start with the integer value.
2. Extract the least significant 7 bits and store them in a byte.
3. Set the continuation bit (MSB) of the byte to 1 if there are more bits to encode; otherwise, set it to 0.
4. Shift the integer right by 7 bits.
5. Repeat the process until the entire integer is encoded.

### Decoding Steps

1. Read the first byte.
2. Extract the lower 7 bits and append them to the result.
3. If the continuation bit (MSB) is set to 1, read the next byte and repeat the process.
4. Continue until a byte with the continuation bit set to 0 is read.

### VarInt Example

Let's consider encoding and decoding the integer value 300:

**Binary Representation:**

300 in binary is `100101100`.
  
**Split into 7-bit Groups:**

The binary representation is split into two 7-bit groups: `0010110` and `0000100`.

**Encoding:**

- First byte: `0010110` (binary) -> `0010110` (7 bits) + `1` (MSB) -> `1010110` (binary) -> `0xAC` (hex).
- Second byte: `0000100` (binary) -> `0000100` (7 bits) + `0` (MSB) -> `0000100` (binary) -> `0x04` (hex).
- The VarInt encoding of 300 is `0xAC 0x04`.
  
**Decoding:**

- Read the first byte `0xAC` (binary `1010110`), extract `0010110` (value `22`).
- Read the second byte `0x04` (binary `0000100`), extract `0000100` (value `4`).
- Combine the values: `4 << 7` (shift left by 7 bits) + `22` = `300`.

### VarInt Samples

Here are some examples of VarInt encoding and decoding:

| Value | Hex Bytes | Decimal Bytes |
|-------|------------|---------------|
| 0     | 0x00       | 0             |
| 1     | 0x01       | 1             |
| 127   | 0x7F       | 127           |
| 128   | 0x80 0x01  | 128           |
| 255   | 0xFF 0x01  | 255           |
| 300   | 0xAC 0x04  | 300           |
| 2097151 | 0xFF 0xFF 0x7F | 2097151   |
| 2147483647 | 0xFF 0xFF 0xFF 0xFF 0x07 | 2147483647 |

### VarInt as code

Here is an example of a function to read/write a VarInt from a buffer:

```rust
fn read_varint(buf: &mut BytesMut) -> Result<i32, io::Error> {
    let mut value = 0;
    let mut position = 0;
    while position < 32 {
        let byte = buf.get_u8();
        value |= ((byte & 0x7F) as i32) << position;

        if (byte & 0x80) == 0 {
            return Ok(value);
        }

        position += 7;
    }
    Err(io::Error::new(io::ErrorKind::InvalidData, "VarInt is too big"))
}

fn write_varint(buf: &mut BytesMut, mut value: i32) {
    while (value & !0x7F) != 0 {
        buf.put_u8((value & 0x7F | 0x80) as u8);
        value >>= 7;
    }
    buf.put_u8(value as u8);
}
```

## VarLong

A VarLong (Variable Length Long) is essentially a 64-bit version of a VarInt, which you already understand. Like VarInt, VarLong encodes integers using a variable number of bytes to optimize space.

### Key Points

1. **Similarities to VarInt:**
    - Both VarInt and VarLong use the continuation bit (MSB) to indicate if more bytes follow.
    - The encoding and decoding process is similar, with the main difference being the number of bits they handle (VarInt for 32-bit, VarLong for 64-bit).
2. **Encoding and Decoding:**
    - **Encoding:**
      - Divide the 64-bit integer into 7-bit groups.
      - Store each group in a byte, setting the MSB to 1 if more bytes follow, or 0 if it is the last byte.
    - **Decoding:**
      - Read bytes one by one, combining their lower 7 bits until a byte with the MSB of 0 is encountered.

### VarLong Example

Let’s encode and decode the integer value 9223372036854775807 (max 64-bit signed integer):

1. **Binary Representation:**
    - 9223372036854775807 in binary is `0111111111111111111111111111111111111111111111111111111111111111`
2. **Split into 7-bit Groups:**
    - The binary representation splits into nine 7-bit groups: `0111111 1111111 1111111 1111111 1111111 1111111 1111111 1111111 1`.
3. **Encoding:**
    - First eight bytes: Each `0111111` -> `1111111` (7 bits + MSB 1) -> `0xFF`.
    - Ninth byte: `1` -> `0000001`s (7 bits + MSB 0) -> `0x01`.
    - Result: `0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0x01`.
4. **Decoding:**
    - Read bytes `0xFF` (seven times) -> `0111111` each time, combined by shifting left by 7 bits.
    - Read byte `0x01` -> `1`.
    - Combine values by shifting each 7-bit segment to its appropriate position, yielding `9223372036854775807`.

### VarLong Samples

Here are some examples of VarLong encoding and decoding:

| Value | Hex Bytes | Decimal Bytes |
|-------|------------|---------------|
| 0     | 0x00       | 0             |
| 1     | 0x01       | 1             |
| 127   | 0x7F       | 127           |
| 128   | 0x80 0x01  | 128           |
| 255   | 0xFF 0x01  | 255           |
| 300   | 0xAC 0x02  | 300           |
| 2097151 | 0xFF 0xFF 0x7F | 2097151   |
| 2147483647 | 0xFF 0xFF 0xFF 0xFF 0x07 | 2147483647 |
| 9223372036854775807 | 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0x7F | 9223372036854775807 |

### VarLong as code

Here is an example of a function to read/write a VarLong from a buffer:

```rust
fn read_varlong(buf: &mut BytesMut) -> Result<i64, io::Error> {
    let mut value = 0;
    let mut position = 0;
    while position < 64 {
        let byte = buf.get_u8();
        value |= ((byte & 0x7F) as i64) << position;

        if (byte & 0x80) == 0 {
            return Ok(value);
        }

        position += 7;
    }
    Err(io::Error::new(io::ErrorKind::InvalidData, "VarLong is too big"))
}

fn write_varlong(buf: &mut BytesMut, mut value: i64) {
    while (value & !0x7F) != 0 {
        buf.put_u8((value & 0x7F | 0x80) as u8);
        value >>= 7;
    }
    buf.put_u8(value as u8);
}
```

## BitSet

Bit sets in the context of Minecraft protocol represent packed lists of bits used for efficiently storing and transmitting boolean data. There are two types of bit sets: BitSet and Fixed BitSet. Each serves different purposes and has unique encoding schemes.

A BitSet is a dynamically sized array of bits, typically used for more flexible bit storage.

### BitSet Structure

- **Length:** A [VarInt](#varint) indicating the number of longs in the following array. It can be 0 if no bits are set.
- **Data:** An array of longs, representing the packed bit set.

### BitSet Encoding

1. Write the length of the long array as a VarInt.
2. Write each long in the array. Each bit in the bit set corresponds to a specific bit position within these longs.

### BitSet Decoding

To check if a bit is set:

```math
\[
\text{Data}[i / 64] \& (1 \ll (i \% 64)) \neq 0
\]
```

> where 𝑖 is the bit position starting from 0.

### BitSet Example

Here is an example of a function to read/write a BitSet from/to a buffer:

**1. Create our BitSet structure:**

```rust
struct BitSet {
    length: i32,
    data: Vec<i64>,
}
```

**2. Read/Write functions:**

```rust
fn read_varint(buf: &mut BytesMut) -> Result<i32, io::Error> {
    // Assume this function is implemented to read a VarInt from buf
}

fn read_bitset(buf: &mut BytesMut) -> Result<BitSet, io::Error> {
    let length = read_varint(buf)?;
    let mut data = Vec::new();
    for _ in 0..length {
        let long = read_long(buf)?;  // Assume read_long is implemented to read i64 from buf
        data.push(long);
    }
    Ok(BitSet { length, data })
}
```

### Fixed BitSet Example

A Fixed BitSet is a bit set with a fixed number of bits, typically used for storing a specific number of flags or options.

**1. Create our Fixed BitSet structure:**

```rust
struct FixedBitSet {
    data: Vec<u8>, // Array of bytes
}

fn read_fixed_bitset(buf: &mut BytesMut, n: usize) -> Result<FixedBitSet, io::Error> {
    let byte_length = (n + 7) / 8;  // ceil(n / 8)
    if buf.len() < byte_length {
        return Err(io::Error::new(io::ErrorKind::UnexpectedEof, "Buffer too short to read fixed bit set"));
    }
    let mut data = vec![0; byte_length];
    buf.copy_to_slice(&mut data);
    Ok(FixedBitSet { data })
}
```

## Strings

To read strings using a variable length encoding system like VarInt, the process generally involves reading the length of the string first (encoded as a VarInt) and then reading that many bytes to get the string data.

### Strings Decoding

1. Read a VarInt from the buffer to determine the length of the string.
2. After determining the length of the string, the next step is to read that many bytes from the buffer.
3. Convert the bytes to a UTF-8 string to get the final string value.

### Strings Encoding

1. Convert the string to a UTF-8 byte array.
2. Encode the length of the byte array as a VarInt.
3. Write the byte array to the buffer.

### Strings Example

Here is an example of a function to read/write a string from/to a buffer:

```rust
fn read_string(buf: &mut BytesMut) -> Result<String, io::Error> {
    // Step 1: Read the length of the string as a VarInt
    let length = read_varint(buf)? as usize;
    
    // Step 2: Read the string data of 'length' bytes
    let string = buf.split_to(length);
    
    // Step 3: Convert the bytes to a UTF-8 string and return it
    Ok(String::from_utf8(string.to_vec()).unwrap())
}

fn write_string(buf: &mut BytesMut, string: &str) {
    // Step 1: Convert the string to a UTF-8 byte array
    let bytes = string.as_bytes();
    
    // Step 2: Encode the length of the byte array as a VarInt
    write_varint(buf, bytes.len() as i32);
    
    // Step 3: Write the byte array to the buffer
    buf.put(bytes);
}
```

## Identifier

An Identifier is a unique string that represents a resource in the Minecraft game. It consists of two parts: a namespace and a path. Identifiers are used to reference items, blocks, entities, and other game resources.

```shell
namespace:path
```

- **Namespace:** The namespace defines the scope or category of the resource. It typically represents the mod or plugin that defines the resource. Common namespaces include `minecraft` for vanilla resources and custom namespaces for mods.
- **Path:** The path is the unique name or identifier of the resource within the namespace. It specifies the specific item, block, or entity being referenced.

## Position

To read positions encoded in a 64-bit value, split into three signed integer parts (X, Y, Z), you need to understand how these components are packed and unpacked. The position encoding is defined as follows:

- **X:** 26 most significant bits (MSBs)
- **Z:** 26 middle bits
- **Y:** 12 least significant bits (LSBs)

### Position Encoding

To encode the coordinates into a 64-bit value:

```math
\[
\text{val} = ((x \& 0x3FFFFFF) \ll 38) \mid ((z \& 0x3FFFFFF) \ll 12) \mid (y \& 0xFFF)
\]
```

### Position Decoding

To decode the 64-bit value back into X, Y, and Z:

```plaintext
val = read_long();
x = val >> 38;
y = (val << 52) >> 52;
z = (val << 26) >> 38;
```

These shifts assume arithmetic (signed) shifts to preserve the sign of the coordinates. If your language does not support arithmetic shifts, you need to handle potential negative values explicitly.

### Position Example

Let's consider encoding and decoding the position (100, 64, 300):

**1. Define a Position Structure:**

```rust
struct Position {
    x: i32,
    y: i32,
    z: i32,
}
```

**2. function to Read a Long (64-bit value):**

```rust
fn read_long(buf: &mut BytesMut) -> Result<i64, io::Error> {
    if buf.len() < 8 {
        return Err(io::Error::new(io::ErrorKind::UnexpectedEof, "Buffer too short to read a long"));
    }
    let mut array = [0u8; 8];
    buf.copy_to_slice(&mut array);
    Ok(i64::from_be_bytes(array))
}
```

**3. function to Decode a Position:**

```rust
fn read_position(buf: &mut BytesMut) -> Result<Position, io::Error> {
    let val = read_long(buf)?;

    let x = (val >> 38) as i32;
    let y = (val << 52 >> 52) as i32;
    let z = (val << 26 >> 38) as i32;

    // Correcting for the sign extension if needed
    let x = if x >= 1 << 25 { x - (1 << 26) } else { x };
    let y = if y >= 1 << 11 { y - (1 << 12) } else { y };
    let z = if z >= 1 << 25 { z - (1 << 26) } else { z };

    Ok(Position { x, y, z })
}
```

### Detailed Explanation

1. Reading the Long Value:
   - The function `read_long` reads 8 bytes from the buffer and converts them into a 64-bit integer (`i64`).
2. Decoding the Position:
    - **X Coordinate:** Extracted from the top 26 bits.
    - **Y Coordinate:** Extracted from the bottom 12 bits, handled by shifting left 52 bits and then right 52 bits to get the signed value.
    - **Z Coordinate:** Extracted from the middle 26 bits, handled by shifting left 26 bits and then right 38 bits to get the signed value.
3. Sign Correction:
    - After decoding the coordinates, we correct them if they were encoded as large positive numbers due to the bitwise operations, ensuring they retain their signed nature.

## Packets

Packets are the fundamental units of data exchanged between the client and server in the Minecraft Protocol. Each packet has a specific purpose and structure defined by its packet ID and data fields. Understanding how to read and write packets is essential for implementing custom functionality in the game.

### Uncompressed Packet Structure

| Field | Size | Description |
|-------|------|-------------|
| Length | VarInt | Length of the packet data (excluding the length field itself). |
| ID | VarInt | Packet ID that identifies the type of packet being sent. |
| Data | Byte Array | Packet data fields specific to the packet type. |

### Compressed Packet Structure

#### if size >= threshold

| Field | Size | Description | Compressed? |
|-------|------|-------------| -------------- |
| Packet Length | VarInt | Length of the packet data (excluding the length field itself). | No |
| Data Length | VarInt | Length of the uncompressed packet data. | No |
| ID | VarInt | Packet ID that identifies the type of packet being sent. | Yes |
| Data | Byte Array | Packet data fields specific to the packet type. | Yes |

#### if size < threshold

| Field | Size | Description | Compressed? |
|-------|------|-------------| -------------- |
| Packet Length | VarInt | Length of the packet data (excluding the length field itself). | No |
| Data Length | VarInt | It's 0 for uncompressed packets. | No |
| ID | VarInt | Packet ID that identifies the type of packet being sent. | No |
| Data | Byte Array | Packet data fields specific to the packet type. | No |

### Packet Decoding

#### If compression is disabled

1. Read the packet length as a VarInt.
2. Read the packet ID as a VarInt.
3. Create a buffer for the packet data with the remaining bytes.
4. Decode the packet data based on the packet ID.

#### If compression is enabled

1. Read the packet length as a VarInt.
2. Read the data length as a VarInt.
3. If the data length is 0, the packet is uncompressed, otherwise, it is compressed.
4. If compressed, decompress Packet ID and Data using zlib.

### Some packet notes

1. **Size limitation:**
   - **Maximum size:** Packets cannot exceed 221 − 1 or 2097151 bytes, which is the maximum size representable by a 3-byte VarInt.
   - **Length Field:** The length field itself must not exceed 3 bytes, even if the encoded value falls within this limit. Encodings longer than necessary, up to 3 bytes, are permitted.
2. **Serverbound packets:**
   - The uncompressed length of (Packet ID + Data) must not exceed 223 or 8388608 bytes. A length of 223 is permissible, which differs from the compressed length limit. Notchian clients do not impose a limit on the uncompressed length of incoming compressed packets.
3. **Threshold Handling:**
   - If the buffer size containing packet data and ID (as VarInt) is smaller than the specified threshold in Set Compression packet, it is sent uncompressed by setting data length as 0. This mimics a non-compressed format with an extra 0 between length and packet data.
4. **Compression management:**
   - The Notchian server rejects compressed packets smaller than the threshold but accepts uncompressed packets that exceed the threshold. Compression can be disabled by sending Set Compression with a negative Threshold or omitting the packet altogether.
