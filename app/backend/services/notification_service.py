from app.backend.services.turno_repository import TurnoRepository
from app.backend.models.models import Turno, Medico, Paciente 
from datetime import date, timedelta, datetime, time 
from typing import List

import smtplib
from email.message import EmailMessage

# ----------------------------------------------------
# 1. CONFIGURACIÓN SMTP 
# ----------------------------------------------------

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587 
SENDER_EMAIL = "yaneodar@gmail.com"  
SENDER_PASSWORD = "zcoq evqh ghvo zcib" 

class NotificationService:

    def __init__(self, turno_repo: TurnoRepository):
        self.turno_repo = turno_repo

    def _send_email_real(self, recipient_email: str, subject: str, body: str) -> bool:
        
        # Validación de configuración
        #if SENDER_EMAIL == "tu_correo_de_prueba@gmail.com":
        #     print(f"❌ ERROR: Configuración SMTP no válida. Correo simulado a {recipient_email}")
        #     return False

        try:
            msg = EmailMessage()
            msg['Subject'] = subject
            msg['From'] = SENDER_EMAIL
            msg['To'] = recipient_email
            msg.set_content(body)

            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SENDER_EMAIL, SENDER_PASSWORD)
                server.send_message(msg)
                
            print(f"✔ EMAIL REAL ENVIADO a {recipient_email}")
            return True
            
        except Exception as e:
            print(f"❌ ERROR AL ENVIAR EMAIL a {recipient_email}: {e}")
            return False

    def check_and_notify(self):
        """
        Verifica los turnos para 'mañana' (24h) y 'hoy' (2h antes) y envía recordatorios.
        """
        today = date.today()
        tomorrow = today + timedelta(days=1)
        
        # ----------------------------------------------------
        # 1. NOTIFICAR TURNOS PARA MAÑANA (Recordatorio anticipado - 24h)
        # ----------------------------------------------------
        tomorrow_turnos = self.turno_repo.get_turnos_by_date(tomorrow)
        print(f"\n⏳ Encontrados {len(tomorrow_turnos)} turnos para MAÑANA ({tomorrow}).")
        
        for turno in tomorrow_turnos:
            if turno.Paciente and turno.Paciente.Email:
                subject = f"Recordatorio: Tu turno médico es MAÑANA a las {turno.Hora}."
                body = f"Hola {turno.Paciente.Nombre} {turno.Paciente.Apellido}, nos comunicamos desde la clínica para recordarte que no olvides tu turno del día {tomorrow.strftime('%Y-%m-%d')} a la hora {turno.Hora} con una duración de {turno.Duracion} minutos.\nSerá atendido por el/la Dr/a. {turno.Medico.Nombre} {turno.Medico.Apellido}. \nTe esperamos.\n\nSaludos cordiales."
                self._send_email_real(turno.Paciente.Email, subject, body)


        # ----------------------------------------------------
        # 2. NOTIFICAR TURNOS PARA HOY (Aviso 2 horas antes)
        # ----------------------------------------------------
        
        now = datetime.now()
        target_time_start = now + timedelta(seconds=1) # Empieza ahora mismo
        target_time_end = now + timedelta(hours=2) # Termina en 2 horas
        
        # 💡 La consulta se hace por rango de hora para filtrar solo los próximos turnos.
        today_turnos_cerca = self.turno_repo.get_turnos_by_time_range(
            target_date=today, 
            start_time=target_time_start.time(), 
            end_time=target_time_end.time()
        )
        print(f"\n🔔 Encontrados {len(today_turnos_cerca)} turnos entre {target_time_start.strftime('%H:%M')} y {target_time_end.strftime('%H:%M')}.")

        for turno in today_turnos_cerca:
            if turno.Paciente and turno.Paciente.Email:
                subject = f"Aviso: Tu turno médico es hoy a las {turno.Hora} "
                body = f"Hola {turno.Paciente.Nombre} {turno.Paciente.Apellido}, nos comunicamos desde la clínica para recordarte que tu turno con el/la Dr/a. {turno.Medico.Nombre} {turno.Medico.Apellido} es HOY a las {turno.Hora}. Por favor, no llegues tarde. \n\nSaludos cordiales."
                self._send_email_real(turno.Paciente.Email, subject, body)

        print("\n--- Proceso de notificaciones finalizado ---")