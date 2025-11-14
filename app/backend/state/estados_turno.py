from .turno_state import EstadoTurno

class PendienteState(EstadoTurno):
    def confirmar(self): self.set_estado("Confirmado")
    def cancelar(self): self.set_estado("Cancelado")
    def reprogramar(self): self.set_estado("Pendiente")
    def anunciar(self): self.set_estado("Anunciado")

class ConfirmadoState(EstadoTurno):
    def cancelar(self): self.set_estado("Cancelado")
    def atender(self): self.set_estado("Atendido")
    def anunciar(self): self.set_estado("Anunciado")

class AnunciadoState(EstadoTurno):
    def atender(self): self.set_estado("Atendido")

class AtendidoState(EstadoTurno):
    def finalizar(self): self.set_estado("Finalizado")
    def marcarAusente(self): self.set_estado("Ausente")

class FinalizadoState(EstadoTurno): pass
class CanceladoState(EstadoTurno): pass
class AusenteState(EstadoTurno): pass
# Los estados Finalizado, Cancelado y Ausente no permiten transiciones adicionales.