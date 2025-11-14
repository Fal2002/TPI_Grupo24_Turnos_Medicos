from fastapi import APIRouter
from app.backend.api.pacientes import router as pacientes_router
from app.backend.api.medicos import router as medicos_router
from app.backend.api.especialidades import router as especialidades_router
from app.backend.api.consultorios import router as consultorios_router

router = APIRouter()

router.include_router(pacientes_router, prefix="/pacientes", tags=["Pacientes"])
router.include_router(medicos_router, prefix="/medicos", tags=["Medicos"])
router.include_router(especialidades_router, prefix="/especialidades", tags=["Especialidades"])
router.include_router(consultorios_router, prefix="/consultorios", tags=["Consultorios"])