from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field


class EngineStatus(BaseModel):
    available: bool
    path: str
    version: str | None = None
    detail: str


class HealthResponse(BaseModel):
    status: Literal["ok"]
    engine: EngineStatus


class ApplicationStat(BaseModel):
    name: str
    packets: int
    percentage: float


class DomainEntry(BaseModel):
    domain: str
    application: str


class ThreadStat(BaseModel):
    name: str
    processed: int


class AnalysisReport(BaseModel):
    total_packets: int
    total_bytes: int
    tcp_packets: int
    udp_packets: int
    forwarded_packets: int
    dropped_packets: int
    thread_statistics: list[ThreadStat] = Field(default_factory=list)
    applications: list[ApplicationStat] = Field(default_factory=list)
    domains: list[DomainEntry] = Field(default_factory=list)


class PacketRecord(BaseModel):
    index: int
    timestamp: float
    length: int
    source_ip: str | None = None
    destination_ip: str | None = None
    protocol: str
    source_port: int | None = None
    destination_port: int | None = None


class AnalysisResponse(BaseModel):
    id: str
    input_file: str
    output_file: str
    created_at: datetime
    report: AnalysisReport
    packets: list[PacketRecord]


RuleType = Literal["ip", "app", "domain"]


class RuleCreate(BaseModel):
    type: RuleType
    value: str = Field(min_length=1, max_length=253)
    enabled: bool = True


class Rule(RuleCreate):
    id: str
    created_at: datetime
