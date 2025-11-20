from fastapi import APIRouter

from app.backend.api.pacientes import router as pacientes_router
from app.backend.api.medicos import router as medicos_router
from app.backend.api.especialidades import router as especialidades_router
from app.backend.api.consultorios import router as consultorios_router
from app.backend.api.turnos import router as turnos_router
from app.backend.api.sucursales import router as sucursales_router
from app.backend.api.agendas import router as agendas_router
from app.backend.api.auth import router as auth_router
from app.backend.api.reportes import router as reportes_router
from app.backend.api.recetas import router as recetas_router
from app.backend.api.drogas import router as drogas_router
<<<<<<< HEAD
from app.backend.api.medicamentos import router as medicamentos_router

router = APIRouter()

router.include_router(pacientes_router, prefix="/pacientes", tags=["Pacientes"])
router.include_router(medicos_router, prefix="/medicos", tags=["Medicos"])
router.include_router(
    especialidades_router, prefix="/especialidades", tags=["Especialidades"]
)
router.include_router(
    consultorios_router, prefix="/consultorios", tags=["Consultorios"]
)
router.include_router(turnos_router, prefix="/turnos", tags=["Turnos"])
router.include_router(sucursales_router, prefix="/sucursales", tags=["Sucursales"])
router.include_router(agendas_router, prefix="/agendas", tags=["Agendas"])
router.include_router(auth_router, prefix="/auth", tags=["Autenticacion"])
router.include_router(reportes_router, prefix="/reportes", tags=["Reportes"])
router.include_router(recetas_router, prefix="/recetas", tags=["Recetas"])
router.include_router(drogas_router, prefix="/drogas", tags=["Drogas"])
router.include_router(
    medicamentos_router, prefix="/medicamentos", tags=["Medicamentos"]
)
=======

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
>>>>>>> cambios-en-backend
