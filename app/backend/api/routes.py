from flask import Blueprint
from .clientes import clientes_bp

api = Blueprint("api", __name__)

api.register_blueprint(clientes_bp, url_prefix="/clientes")
