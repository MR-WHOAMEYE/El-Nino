from typing import Generic, TypeVar, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field

T = TypeVar("T")

class ResponseMetadata(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    source: str = "fastapi-postgis-telemetry"
    confidence: str = "high"
    model_version: str = "climashield-v1.0"
    is_demo: bool = False

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    error: Optional[ErrorDetail] = None
    metadata: ResponseMetadata = Field(default_factory=ResponseMetadata)
