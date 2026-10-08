from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, core, intelligence

app = FastAPI(
    title="CLIMA-SHIELD Climate Impact & Community Resilience API",
    description="Climate Consequence Graph, Invisible Population, and Adaptive Optimization Service",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if hasattr(settings, 'CORS_ORIGINS') else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api/v1
app.include_router(health.router, prefix="/api/v1")
app.include_router(core.router, prefix="/api/v1")
app.include_router(intelligence.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "project": "CLIMA-SHIELD",
        "tagline": "From Climate Signals to Community Action",
        "status": "operational",
        "version": "2.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
