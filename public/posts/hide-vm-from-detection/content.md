# How to Hide a Virtual Machine from Detection

When running software inside a virtual machine (VM), some programs can detect the VM environment and behave differently or refuse to run. This guide provides a detailed walkthrough on configuring your VMware virtual machine to minimize detection by software running inside it.

## VMware Tweaks

### 1 Modifying the .vmx file

The `.vmx` file contains the configuration for your VMware virtual machine. By tweaking some of its parameters, you can disguise the VM to make it less detectable. Below are the sections with modifications and explanations for each.

### 1.1 CPU Configuration Tweaks

These changes alter the virtual CPU's behavior to mask certain VMware-specific features that may be detectable by software.

```plaintext
# Disable extended registers to hide APIC information
cpuid.disable_apicExtRegs = "TRUE"

# Provide full CPUID information
monitor_control.enable_fullcpuid="TRUE"

# Mask the CPU identification (modify these values as needed)
cpuid.1.eax = "0---:----:----:----:----:----:----:----"
cpuid.1.ecx = "0---:----:----:----:----:----:----:----"
cpuid.1.edx = "0---:----:----:----:----:----:----:----"
```

### 1.2 Backdoor and Hypervisor Restrictions

These options prevent the VM from being identified by common backdoor and hypervisor detection techniques.

```plaintext
# Restrict VMware backdoor
monitor_control.restrict_backdoor = "TRUE"

# Disable direct execution to limit detection
monitor_control.disable_directexec = "TRUE"

# Disable several VMware-specific instructions
monitor_control.disable_chksimd = "TRUE"
monitor_control.disable_ntreloc = "TRUE"
monitor_control.disable_selfmod = "TRUE"
monitor_control.disable_reloc = "TRUE"
monitor_control.disable_btinout = "TRUE"
monitor_control.disable_btmemspace = "TRUE"
monitor_control.disable_btpriv = "TRUE"
monitor_control.disable_btseg = "TRUE"
```

### 1.3 Paravirtualization and RDTSC Behavior

These settings further modify how the virtual machine reports timing and CPU-related information.

```plaintext
# Enable extended core features and paravirtualization
monitor_control.enable_extended_core = "TRUE"
monitor_control.enable_paravirt = "TRUE"

# Control time-stamp counter (TSC) behavior
monitor_control.virtual_rdtsc = "FALSE"
```

### 1.4 Isolation Tools

These lines prevent VMware-specific tools from exposing VM information to guest software.

```plaintext
# Disable various isolation tools that can leak VM information
isolation.tools.getPtrLocation.disable = "TRUE"
isolation.tools.setPtrLocation.disable = "TRUE"
isolation.tools.getVersion.disable = "TRUE"
isolation.tools.setVersion.disable = "TRUE"

# Disable shared folders (HGFS)
isolation.tools.hgfs.disable = "TRUE"
```

### 1.5 SMBIOS Modifications

The SMBIOS (System Management BIOS) can reveal that a system is virtualized. These settings help reflect host machine information instead.

```plaintext
# Reflect the host's system information instead of VMware defaults
SMBIOS.reflecthost = "TRUE"
SMBIOS.assettag = "IBM Corporation"  # Modify as needed
SMBIOS.useShortSerialNumber = "TRUE"

# Suppress OEM strings
SMBIOS.noOEMStrings = "TRUE"
```

### 1.6 Hardware Model and Serial Number

To disguise your VM's hardware, these options reflect the host's hardware settings.

```plaintext
# Reflect the host machine's hardware details
board-id.reflectHost = "TRUE"
hw.model.reflectHost = "TRUE"
serialNumber.reflectHost = "TRUE"
```

### 1.7 Disk Identification

Change the product and vendor ID of the virtual disk to further hide its virtual nature.

```plaintext
# Customize the virtual disk's product and vendor IDs
scsi0:0.productID = "ProductID"
scsi0:0.vendorID = "ProductVendor"
```

**Recommended values for SCSI device:**

- **Western Digital (WD)**
  - `scsi0:0.productID = "WDC WD10EZEX-08WN4A0"`
  - `scsi0:0.vendorID = "Western Digital"`
- **Seagate:**
  - `scsi0:0.productID = "ST1000DM010"`
  - `scsi0:0.vendorID = "Seagate"`
- **Samsung:**
  - `scsi0:0.productID = "Samsung SSD 850"`
  - `scsi0:0.vendorID = "Samsung"`
- **Hitachi:**
  - `scsi0:0.productID = "HDS721010DLE630"`
  - `scsi0:0.vendorID = "Hitachi"`
- **Intel SSD:**
  - `scsi0:0.productID = "INTEL SSDSC2BB240G4"`
  - `scsi0:0.vendorID = "Intel"`
- **Toshiba:**
  - `scsi0:0.productID = "DT01ACA100"`
  - `scsi0:0.vendorID = "Toshiba"`

### 1.8 Additional CPU and Hypervisor Tweaks

Disable the hypervisor CPUID flag to further hide the VM.

```plaintext
# Disable the hypervisor CPUID feature
hypervisor.cpuid.v0 = "FALSE"
```

### 2. Changing the MAC Address

Many software programs check for known virtual MAC address ranges. You can change your VM’s MAC address to a custom value that doesn’t match VMware’s range.

1. Open the `.vmx` file.
2. Look for `ethernet0.generatedAddress`.
3. Replace the MAC address with a custom one (do not use VMware’s default range: 00:50:56, 00:0C:29, 00:05:69, etc.).

Example:

```plaintext
ethernet0.generatedAddress = "00:1A:2B:3C:4D:5E"
```

### 3. Extra Tips

- **Disable VirtualBox/VMware Tools:** Uninstall VMware Tools or VirtualBox Guest Additions, as these are often checked for by software trying to detect VMs.
- **Hide Host-Only Network:** Disable or hide host-only network adapters from the guest OS, as these are often used for VM detection.
- **Custom BIOS:** Consider modifying or spoofing the BIOS information to match a real machine.
- **Antivirus Exclusions:** If possible, exclude VM files from antivirus scans to avoid unnecessary detection.

## VirtualBox Tweaks

### 1.1 Disguise CPU Information

VirtualBox allows you to mask some CPU features that can reveal virtualization.

1. Open the `.vbox` file associated with your VM.
2. Add or modify the following lines under `<CPU>` to hide the hypervisor presence.

```xml
<CPU>
  <PAE enabled="true"/>
  <HardwareVirtEx enabled="true" exclusive="true"/>
  <HardwareVirtExNestedPaging enabled="true"/>
  <HardwareVirtExVPID enabled="true"/>
  <CpuIdTree>
    <CpuIdLeaf id="80000001" eax="0" ebx="0" ecx="0" edx="0"/>
    <CpuIdLeaf id="00000001" eax="0" ebx="0" ecx="0" edx="0"/>
  </CpuIdTree>
</CPU>
```

This hides CPUID leafs often checked by software to detect a virtual environment.

### 1.2 Disable Guest Additions Detection

VirtualBox’s Guest Additions can expose the VM's presence. To minimize this:

- **Disable shared folders:**

  ```bash
  VBoxManage setextradata "<VM Name>" "VBoxInternal2/SharedFoldersEnableSymlinksCreate/<<FolderName>>" 0
  ```

- **Remove Guest Additions or Install Manually:** You can also remove Guest Additions entirely, or install manually without the default drivers.

### 1.3 SMBIOS and System Identification

Modify VirtualBox’s system settings to emulate a real machine’s BIOS and other system identifiers.

**1. Change the DMI BIOS information:**

```bash
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/pcbios/0/Config/DmiBIOSVendor" "American Megatrends Inc."
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/pcbios/0/Config/DmiBIOSVersion" "X1234"
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/pcbios/0/Config/DmiSystemProduct" "ThinkPad T480"
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/pcbios/0/Config/DmiSystemVersion" "6J"
```

**2. Set System Manufacturer and Serial Numbers:**

```bash
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/pcbios/0/Config/DmiSystemVendor" "LENOVO"
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/pcbios/0/Config/DmiBoardProduct" "ThinkPad T480"
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/pcbios/0/Config/DmiSystemSerial" "123456789"
```

**3. Set Other Hardware IDs: This disguises your VM’s hardware.**

```bash
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/acpi/0/Config/AcpiOemId" "HP"
VBoxManage setextradata "<VM Name>" "VBoxInternal/Devices/acpi/0/Config/AcpiCreatorId" "LENOVO"
```

### 1.4 Masking the Network Adapter

VirtualBox VMs use a MAC address prefix detectable as virtual. Changing the MAC to something typical for physical machines is essential.

```bash
VBoxManage modifyvm "<VM Name>" --macaddress1 "001A2B3C4D5E"
```

Avoid MAC prefixes such as `08:00:27`, which are reserved for VirtualBox VMs.

### 1.5 Enable RDTSC Virtualization Control

RDTSC (Read Time-Stamp Counter) can be used to detect VMs due to timing differences. Enable control over this feature to simulate real hardware.

```bash
VBoxManage setextradata "<VM Name>" "VBoxInternal/TM/TSCTiedToExecution" 1
```

### 1.6 Disable Virtualization Extensions

Disabling certain virtualization features can prevent software from detecting it as a VM.

```bash
VBoxManage modifyvm "<VM Name>" --nested-hw-virt off
```

### 2. Additional Tips

1. **Install Custom Device Drivers:** You may choose to install hardware drivers manually, which can override some virtual identifiers.
2. **Configure Host-Only Network Isolation:** Avoid exposing VirtualBox network adapters, as these are commonly checked by software.
3. **Randomize Disk and Device Information:** Alter your VM's disk serial numbers to match typical physical disk formats, and remove any unused hardware from the VM setup.

## Obfuscate drivers

Hiding drivers, registry entries, executables, and processes that might be linked to a VM virtualization agent is crucial to ensure that a malicious actor cannot detect that they are in a monitored environment.

There are many tools on GitHub available, I have personally made one which you can find in the [following repository](https://github.com/sammwyy/NoVM).

> Note: Windows administrator mode is not sufficient for obfuscating system drivers. For this we need to elevate to "nt authority system", we can achieve this with tools like [PsExec](https://learn.microsoft.com/es-es/sysinternals/downloads/psexec).

## Conclusion

Feel free to tweak the configurations according to your specific environment and needs!
