from fastapi import APIRouter
from app.schemas.envelope import ApiResponse, ResponseMetadata

router = APIRouter()

@router.get("/health", response_model=ApiResponse[dict])
async def health_check():
    """
    Health check endpoint for platform orchestration and load balancing.
    Verifies FastAPI server readiness and operational status.
    """
    return ApiResponse(
        success=True,
        data={
            "status": "healthy",
            "service": "CLIMA-SHIELD Climate Intelligence API",
            "database": "postgresql-postgis",
            "environment": "active"
        },
        metadata=ResponseMetadata(
            source="fastapi-core",
            confidence="high",
            model_version="live-v1.0",
            is_demo=False
        )
    )
