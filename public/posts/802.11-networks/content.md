# Breaking Down Wi-Fi: How 802.11 Networks Work

## Introduction

Wi-Fi is an essential part of modern life, quietly working in the background to connect us to the digital world. But how does it actually work? From the physical waves traveling through the air to the protocols ensuring reliable communication, there’s a lot going on under the hood.

We’ll break down the inner workings of Wi-Fi, exploring both the hardware and software aspects. By the end, you’ll have a clear understanding of how data moves from your device to the internet and back again.

---

## 1. The Foundation: Electromagnetic Waves

Wi-Fi operates in the radio frequency spectrum, primarily using two bands: **2.4 GHz** and **5 GHz** (with **6 GHz** in Wi-Fi 6E). These frequencies fall within the microwave range, which is part of the broader electromagnetic spectrum.

### How Data Rides the Waves

Wi-Fi transmits data using **modulation techniques** like:

- **Amplitude Shift Keying (ASK):** Varies the wave’s amplitude.
- **Frequency Shift Keying (FSK):** Alters the wave’s frequency.
- **Phase Shift Keying (PSK):** Changes the phase of the wave.

Modern Wi-Fi standards, such as 802.11ax (Wi-Fi 6), employ **Orthogonal Frequency-Division Multiplexing (OFDM)**. This method divides a single channel into multiple subcarriers, each transmitting data independently. Think of it as a highway with many lanes, reducing interference and boosting efficiency.

### Signal Strength and Interference

Wi-Fi signals weaken as they travel through the air and encounter obstacles like walls, furniture, or other devices operating on the same frequencies. This attenuation is why range and positioning are critical. Techniques like **beamforming** (discussed later) aim to counteract these issues by focusing signals directly toward devices.

---

## 1.5. Bridging the Gap: From Waves to Data

Before diving into hardware, let’s clarify how these modulated waves become meaningful data:

1. **Transmission:** The transmitter (like your router) converts digital data into analog signals modulated onto a carrier frequency.
2. **Propagation:** These signals travel as electromagnetic waves.
3. **Reception:** The receiver (e.g., your phone) detects the waves and demodulates them back into digital data using its antenna and WNIC.
4. **Error Correction:** Techniques like **cyclic redundancy checks (CRC)** ensure the data integrity during this process.

With this context, let’s look at the hardware that makes these conversions and transmissions possible.

---

## 2. Hardware: The Building Blocks of Wi-Fi

At the hardware level, Wi-Fi involves several key components:

### 2.1 Access Point (AP)

The AP is the hub that broadcasts and manages Wi-Fi connections. It converts wired Ethernet data into wireless signals and vice versa. Key features include:

- **Radio Transceivers:** Send and receive RF signals.
- **Antennas:** Direct and amplify signals (MIMO antennas are common in modern APs).
- **MAC Layer Controller:** Handles framing, addressing, and error checking.

### 2.2 Wireless Network Interface Controller (WNIC)

Every device connecting to Wi-Fi needs a WNIC. It’s responsible for:

- Scanning for networks.
- Initiating the connection process.
- Sending and receiving data frames.

### 2.3 Firmware and Drivers

Both the AP and WNIC rely on firmware and drivers to manage hardware interactions. These include:

- Managing RF channels.
- Implementing the 802.11 protocol stack.
- Handling encryption and decryption.

---

## 3. The 802.11 Protocol: Software in Action

The 802.11 family of standards defines how Wi-Fi operates. Let’s break it down:

### 3.1 Frame Types

Wi-Fi communication uses **frames**, which are categorized into:

- **Management Frames:** Establish and maintain connections (e.g., beacons, probe requests).
- **Control Frames:** Manage access to the medium (e.g., RTS/CTS).
- **Data Frames:** Carry the actual payload (user data).

#### Wi-Fi Frame Structure

```bash
+---------------------------------------+
| Frame Control | Duration | Address 1  |
+---------------+----------+------------+
| Address 2     | Address 3 | Sequence  |
+---------------+----------+------------+
| Data Payload                     ...  |
+---------------------------------------+
| Frame Check Sequence (FCS)            |
+---------------------------------------+
```

- **Frame Control:** Contains flags and protocol information.
- **Duration:** Indicates how long the transmission occupies the channel.
- **Address Fields:** Store source, destination, and sometimes intermediate addresses.
- **Sequence:** Helps reassemble fragmented data.
- **Data Payload:** The actual content being transmitted.
- **FCS:** Ensures data integrity by detecting errors.

#### Example of a Beacon Frame

```bash
+-----------------------------------------------------------+
| Frame Control: Management Frame (Beacon)                  |
+-----------------------------------------------------------+
| SSID: "MyWiFiNetwork"                                     |
| Supported Rates: 6 Mbps, 12 Mbps, 24 Mbps                 |
| Channel: 11                                               |
| Timestamp: 1680349879                                     |
| Capabilities: WPA3, OFDMA                                 |
+-----------------------------------------------------------+
```

### 3.2 The Connection Process

The typical connection workflow looks like this:

1. **Scanning:** The client scans for available networks.
2. **Authentication:** The client sends an authentication request to the AP.
3. **Association:** The AP assigns resources and associates with the client.
4. **Key Exchange:** If encryption (e.g., WPA3) is used, a secure key is exchanged.

### 3.3 Medium Access Control (MAC)

Wi-Fi uses **Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA)** to manage access to the shared medium. Key steps include:

- Checking if the channel is clear.
- Sending a request to transmit (RTS) and waiting for a clear-to-send (CTS).
- Transmitting data and awaiting acknowledgment (ACK).

### 3.4 Packet Flow: Data Transmission

1. **Client to AP (Data Upload):**

    ```bash
    Client Device --> [Wi-Fi Frame] --> Access Point
        Source: 192.168.1.101
        Destination: 192.168.1.1
        Data Payload: "Hello, server!"
    ```

2. **AP to Router:**

    ```bash
    Access Point --> [Ethernet Frame] --> Router
        Source: MAC_AP_01:23:45:67
        Destination: MAC_Router_AA:BB:CC
        Data: "Forwarding to ISP..."
    ```

3. **Router to ISP:**

    ```bash
    Router --> [IP Packet] --> ISP Gateway
        IP Header: Src=192.168.1.101, Dest=172.217.0.46
        Payload: "GET /index.html HTTP/1.1"
    ```

#### RTS/CTS Process: Avoiding Collisions

Request to Send (RTS) and Clear to Send (CTS) are control frames that coordinate access to the shared medium.

1. **RTS from Client:**

    ```bash
    +-------------------------------------+
    | Frame Type: RTS                     |
    | Source: Client Device               |
    | Destination: Access Point           |
    | Duration: 3 ms                      |
    +-------------------------------------+
    ```

2. **CTS from AP:**

    ```bash
    +-------------------------------------+
    | Frame Type: CTS                     |
    | Source: Access Point                |
    | Destination: Client Device          |
    | Duration: 3 ms                      |
    +-------------------------------------+
    ```

3. **Data Transmission:**

    ```bash
    +-------------------------------------+
    | Frame Type: Data                    |
    | Source: Client Device               |
    | Destination: Access Point           |
    | Data Payload: "Hello, server!"      |
    +-------------------------------------+
    ```

### 3.5 Visualization of a Multi Device Channel

Here’s how multiple devices share a channel using OFDMA in Wi-Fi 6:

```bash
+-------------------------------------------------------+
| Channel 1                                             |
|  [Device A]   [Device B]         [Device C]           |
|   (2 RUs)      (4 RUs)            (6 RUs)             |
+-------------------------------------------------------+
```

Each RU (Resource Unit) represents a portion of the channel allocated to a specific device, optimizing efficiency.

---

## 4. Security Layers

Wi-Fi networks can be vulnerable without proper security. Standards like **WPA3** add robust encryption and authentication mechanisms:

- **AES Encryption:** Advanced Encryption Standard (AES) is a symmetric encryption algorithm that ensures data is securely encoded, making it almost impossible to intercept and read the transmitted information without the correct key.

    ```bash
    +---------------------------------------------+
    |           AES Encryption Flow               |
    +---------------------------------------------+
    | 1. Plaintext                                |
    |                                             |
    | 2. Key Expansion                            |
    |    - Round Keys are derived from the key    |
    |                                             |
    | 3. Initial AddRoundKey                      |
    |                                             |
    | 4. Iterative Encryption (Rounds)            |
    |    - SubBytes                               |
    |    - ShiftRows                              |
    |    - MixColumns                             |
    |    - AddRoundKey                            |
    |                                             |
    | 5. Final Round (No MixColumns)              |
    |                                             |
    | 6. Ciphertext                               |
    +---------------------------------------------+
    ```

- **Simultaneous Authentication of Equals (SAE):** This protocol, introduced with WPA3, replaces the outdated Pre-Shared Key (PSK) method. SAE uses a zero-knowledge proof technique, allowing devices to authenticate without revealing their passwords. This significantly mitigates the risk of brute-force attacks.
- **Forward Secrecy:** This mechanism ensures that even if a session’s encryption key is compromised, past communication remains secure. It achieves this by generating unique keys for each session, preventing retroactive decryption of previously intercepted data.
- **Protected Management Frames (PMF):** PMF adds encryption to Wi-Fi management frames, which were previously unprotected. This enhancement prevents deauthentication and disassociation attacks, improving the overall stability and security of the connection.
- **Enterprise Security (802.1X):** For larger networks, WPA3-Enterprise uses 802.1X authentication with RADIUS servers to provide individualized encryption keys for each device, ensuring robust security at scale.
- **Open Network Enhancements:** WPA3 introduces Opportunistic Wireless Encryption (OWE) for open networks, encrypting traffic even when no password is required, protecting users on public Wi-Fi hotspots.

---

## 5. Advanced Features in Modern Wi-Fi

Wi-Fi continues to evolve with new standards and features:

### 5.1 Beamforming

Beamforming directs signals to specific devices rather than broadcasting everywhere, improving speed and reliability. By focusing energy toward the intended recipient, it reduces interference and enhances range, making communication more efficient.

### 5.2 MU-MIMO

Multi-User Multiple Input, Multiple Output (MU-MIMO) enables an access point to communicate with multiple devices simultaneously. Instead of handling devices sequentially, MU-MIMO creates multiple spatial streams to serve several devices at once, dramatically improving network capacity and reducing latency in busy environments.

### 5.3 OFDMA

Orthogonal Frequency-Division Multiple Access (OFDMA) breaks channels into smaller sub-channels, called Resource Units (RUs). This allows multiple devices to share the same channel without collisions. It’s especially useful in environments with many IoT devices, ensuring efficient resource allocation and minimal congestion.

### 5.4 Target Wake Time (TWT)

Introduced with Wi-Fi 6, TWT schedules communication between the AP and devices to reduce power consumption. Devices "wake up" only when needed, significantly extending battery life for smartphones, laptops, and IoT devices.

### 5.5 1024-QAM

Wi-Fi 6 also uses 1024-Quadrature Amplitude Modulation (QAM) to encode more data per signal, boosting throughput. Compared to older standards like 256-QAM, this improvement increases efficiency in data transmission.

---

## 6. Challenges and Limitations

While Wi-Fi is amazing, it’s not perfect. Some common issues include:

- **Interference:** Wi-Fi signals often operate in crowded frequency bands (like 2.4 GHz), which are also used by devices like cordless phones, Bluetooth devices, and even microwaves. This overlap can lead to signal degradation and connectivity issues.
- **Range:** Wi-Fi signals have limited reach, especially in the 5 GHz band, which offers faster speeds but shorter range compared to 2.4 GHz. Physical barriers like walls and floors further weaken the signal, requiring solutions like extenders or mesh networks.
- **Congestion:** In environments with many devices (e.g., apartments, offices), too many devices competing for the same channels can cause network slowdowns. Technologies like OFDMA and MU-MIMO in newer standards aim to alleviate this issue by optimizing resource allocation.
- **Latency:** Wi-Fi can introduce latency, especially in older standards, which may not be ideal for real-time applications like gaming or video conferencing. Emerging standards like Wi-Fi 6 and Wi-Fi 7 address this with features designed to reduce delays.
- **Power Consumption:** While modern Wi-Fi standards include features to improve energy efficiency, older devices may drain battery life quickly, especially in "always-on" scenarios like IoT sensors.
- **Security Vulnerabilities:** Without proper configuration, Wi-Fi networks remain vulnerable to attacks like eavesdropping, spoofing, and denial-of-service (DoS). Regular updates and robust encryption protocols are essential to mitigate these risks.

---

## Conclusion

Wi-Fi is a marvel of modern technology, blending physics, hardware, and software into a seamless experience. The next time you use your devices, take a moment to appreciate the complexity making it all possible.
