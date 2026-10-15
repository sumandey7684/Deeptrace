from pathlib import Path


class PathValidationError(ValueError):
    pass


def approved_file(path_value: str | Path, root: Path, *, must_exist: bool = True) -> Path:
    candidate = Path(path_value)
    if not candidate.is_absolute():
        candidate = root / candidate
    try:
        resolved = candidate.resolve(strict=False)
        resolved.relative_to(root.resolve())
    except ValueError as exc:
        raise PathValidationError("Path is outside the approved project directory") from exc
    if resolved == root.resolve():
        raise PathValidationError("A file path is required")
    if must_exist and (not resolved.exists() or not resolved.is_file()):
        raise PathValidationError("Capture file does not exist")
    return resolved


def validate_pcap(path: Path) -> None:
    if path.suffix.lower() != ".pcap":
        raise PathValidationError("Only .pcap files are supported")
    with path.open("rb") as handle:
        magic = handle.read(4)
    if magic not in {b"\xd4\xc3\xb2\xa1", b"\xa1\xb2\xc3\xd4", b"\x4d\x3c\xb2\xa1", b"\xa1\xb2\x3c\x4d"}:
        raise PathValidationError("File is not a supported PCAP capture")
