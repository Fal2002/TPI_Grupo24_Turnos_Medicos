from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.units import cm
from reportlab.lib import colors


class RecetaPDFService:

    @staticmethod
    def crear_pdf(receta, paciente, medico, detalles):
        buffer = BytesIO()

        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=2*cm,
            rightMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm,
        )

        styles = getSampleStyleSheet()
        normal = styles["Normal"]
        titulo = styles["Heading1"]
        titulo.alignment = TA_LEFT

        story = []

        # -------- ENCABEZADO --------
        story.append(Paragraph(f"<b>Receta Médica</b>", titulo))
        story.append(Spacer(1, 12))

        # -------- DATOS DEL MÉDICO --------
        medico_text = f"""
        <b>Médico:</b> {medico.Nombre} {medico.Apellido}<br/>
        <b>Matrícula:</b> {medico.Matricula}
        """
        story.append(Paragraph(medico_text, normal))
        story.append(Spacer(1, 12))

        # -------- DATOS DEL PACIENTE --------
        paciente_text = f"""
        <b>Paciente:</b> {paciente.Nombre} {paciente.Apellido}<br/>
        <b>Nro Paciente:</b> {paciente.nroPaciente}
        """
        story.append(Paragraph(paciente_text, normal))
        story.append(Spacer(1, 12))

        # -------- DATOS DEL TURNO / RECETA --------
        receta_text = f"""
        <b>Fecha del Turno:</b> {receta.Turno_Fecha}<br/>
        <b>Hora:</b> {receta.Turno_Hora}<br/>
        """
        story.append(Paragraph(receta_text, normal))
        story.append(Spacer(1, 24))

        # -------- TABLA DE DETALLES --------
        data = [["Medicamento", "Droga", "Dosis", "Frecuencia"]]

        for det in detalles:
            med = det.medicamento
            droga = med.droga.Descripcion if med.droga else "-"
            data.append([
                med.Nombre,
                droga,
                det.Dosis or "-",
                det.Frecuencia or "-"
            ])

        table = Table(data, colWidths=[5*cm, 4*cm, 3*cm, 3*cm])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ]))

        story.append(table)
        story.append(Spacer(1, 24))

        # -------- FIRMA --------
        story.append(Paragraph("<b>Firma del Médico:</b>", normal))
        story.append(Spacer(1, 36))

        # Generar el PDF
        doc.build(story)
        buffer.seek(0)
        return buffer