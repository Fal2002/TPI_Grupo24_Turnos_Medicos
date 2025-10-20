import sqlite3

DATABASE_NAME = "turnos_medicos.db"
SQL_SCRIPT_FILE = "schema.sql"

def setup_database():
    conn = None

    try:
        # Conexión a la BD (crea el archivo si no existe)
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()

        # Lectura del archivo SQL
        with open(SQL_SCRIPT_FILE, 'r', encoding='utf-8') as file:
            sql_script = file.read()
        
        # Ejecución del script DDL (Creación de tablas)
        cursor.executescript(sql_script)
        conn.commit()
        print(f"Base de datos '{DATABASE_NAME}' creada y tablas inicializadas correctamente.")

    except sqlite3.Error as e:
        print(f"Error al crear la base de datos: {e}")
    
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    setup_database()