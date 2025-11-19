from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.backend.db.db import get_db
from app.backend.models.models import Receta, Paciente, Medico, Turno
from app.backend.services.receta_pdf_service import RecetaPDFService

router = APIRouter(prefix="/recetas-pdf", tags=["Recetas PDF"])


@router.get("/{receta_id}/pdf")
def generar_pdf_receta(receta_id: int, db: Session = Depends(get_db)):
    receta = db.query(Receta).filter(Receta.Id == receta_id).first()
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")

    # Datos del turno
    turno = db.query(Turno).filter(
        Turno.Fecha == receta.Turno_Fecha,
        Turno.Hora == receta.Turno_Hora,
        Turno.Paciente_nroPaciente == receta.Turno_Paciente_nroPaciente
    ).first()

    if not turno:
        raise HTTPException(status_code=404, detail="Turno asociado no encontrado")

    paciente = db.query(Paciente).filter(
        Paciente.nroPaciente == turno.Paciente_nroPaciente
    ).first()

    medico = db.query(Medico).filter(
        Medico.Matricula == turno.Medico_Matricula
    ).first()

    detalles = receta.detalles

    pdf_buffer = RecetaPDFService.crear_pdf(
        receta=receta,
        paciente=paciente,
        medico=medico,
        detalles=detalles
    )

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=receta_{receta_id}.pdf"
        }
    )