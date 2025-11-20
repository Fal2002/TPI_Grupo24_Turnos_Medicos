from fastapi import APIRouter

from app.backend.api.pacientes import router as pacientes_router
from app.backend.api.medicos import router as medicos_router
from app.backend.api.especialidades import router as especialidades_router
from app.backend.api.consultorios import router as consultorios_router
from app.backend.api.turnos import router as turnos_router
from app.backend.api.sucursales import router as sucursales_router
from app.backend.api.recetas import router as recetas_router
from app.backend.api.detalles_receta import router as detalles_receta_router
from app.backend.api.medicamentos import router as medicamentos_router
from app.backend.api.drogas import router as drogas_router

router = APIRouter()

router.include_router(pacientes_router)
router.include_router(medicos_router)
router.include_router(especialidades_router)
router.include_router(consultorios_router)
router.include_router(turnos_router)
router.include_router(sucursales_router)
router.include_router(recetas_router)
router.include_router(detalles_receta_router)
router.include_router(medicamentos_router)
router.include_router(drogas_router)