import struct
from pathlib import Path
from app.models import PacketRecord


MAGICS = {
    b"\xd4\xc3\xb2\xa1": ("<", False),
    b"\xa1\xb2\xc3\xd4": (">", False),
    b"\x4d\x3c\xb2\xa1": ("<", True),
    b"\xa1\xb2\x3c\x4d": (">", True),
}


def _ipv4(value: bytes) -> str:
    return ".".join(str(part) for part in value)


def read_packets(path: Path) -> list[PacketRecord]:
    with path.open("rb") as handle:
        magic = handle.read(4)
        if magic not in MAGICS:
            raise ValueError("File is not a supported PCAP capture")
        endian, nano = MAGICS[magic]
        handle.read(20)
        records: list[PacketRecord] = []
        index = 0
        while True:
            header = handle.read(16)
            if not header:
                break
            if len(header) != 16:
                raise ValueError("Truncated PCAP packet header")
            ts_sec, ts_fraction, included_length, original_length = struct.unpack(
                f"{endian}IIII", header
            )
            data = handle.read(included_length)
            if len(data) != included_length:
                raise ValueError("Truncated PCAP packet payload")
            records.append(_parse_packet(index, ts_sec, ts_fraction, data, nano))
            index += 1
    return records


def _parse_packet(index: int, seconds: int, fraction: int, data: bytes, nano: bool) -> PacketRecord:
    source_ip = destination_ip = None
    protocol = "OTHER"
    source_port = destination_port = None
    if len(data) >= 34 and data[12:14] == b"\x08\x00":
        ip_offset = 14
        ihl = (data[ip_offset] & 0x0F) * 4
        if len(data) >= ip_offset + ihl and ihl >= 20:
            source_ip = _ipv4(data[ip_offset + 12:ip_offset + 16])
            destination_ip = _ipv4(data[ip_offset + 16:ip_offset + 20])
            protocol_number = data[ip_offset + 9]
            protocol = {6: "TCP", 17: "UDP", 1: "ICMP"}.get(protocol_number, str(protocol_number))
            transport = ip_offset + ihl
            if protocol_number in (6, 17) and len(data) >= transport + 4:
                source_port, destination_port = struct.unpack("!HH", data[transport:transport + 4])
    divisor = 1_000_000_000 if nano else 1_000_000
    return PacketRecord(
        index=index,
        timestamp=seconds + fraction / divisor,
        length=len(data),
        source_ip=source_ip,
        destination_ip=destination_ip,
        protocol=protocol,
        source_port=source_port,
        destination_port=destination_port,
    )
