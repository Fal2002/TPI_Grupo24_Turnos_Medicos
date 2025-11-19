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
from app.backend.api.recetas_pdf import router as recetas_pdf_router

router = APIRouter()

router.include_router(pacientes_router, prefix="/pacientes", tags=["Pacientes"])
router.include_router(medicos_router, prefix="/medicos", tags=["Medicos"])
router.include_router(especialidades_router, prefix="/especialidades", tags=["Especialidades"])
router.include_router(consultorios_router, prefix="/consultorios", tags=["Consultorios"])
router.include_router(turnos_router, prefix="/turnos", tags=["Turnos"])
router.include_router(sucursales_router, prefix="/sucursales", tags=["Sucursales"])
router.include_router(recetas_router, prefix="/recetas", tags=["Recetas"])
router.include_router(detalles_receta_router, prefix="/detalles-receta", tags=["Detalles Receta"])
router.include_router(medicamentos_router, prefix="/medicamentos", tags=["Medicamentos"])
router.include_router(drogas_router, prefix="/drogas", tags=["Drogas"])
router.include_router(recetas_pdf_router, prefix="/recetas-pdf", tags=["Recetas PDF"])