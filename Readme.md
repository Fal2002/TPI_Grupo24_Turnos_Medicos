# Trabajo Práctico Integrador – DAO: Sistema de Turnos Médicos

Este proyecto es un sistema de escritorio para la gestión completa de turnos médicos, desarrollado como parte del Trabajo Práctico Integrador de la materia DAO. La aplicación abarca desde la gestión de pacientes y médicos hasta la generación de reportes estadísticos.

## Descripción del Proyecto

El objetivo principal es desarrollar una aplicación de gestión que combine una interfaz de usuario, una base de datos relacional y diversas funcionalidades de negocio. El sistema está diseñado para resolver la administración de un consultorio médico, permitiendo registrar pacientes, médicos, especialidades y turnos, además de ofrecer un módulo de historial clínico y la emisión de recetas electrónicas.

## Funcionalidades Principales

*   **Gestión de Entidades (ABM):** Altas, bajas y modificaciones de pacientes, médicos y especialidades.
*   **Registro de Turnos:** Asignación de turnos vinculando paciente, médico, fecha y estado.
*   **Validación de Disponibilidad:** El sistema valida los horarios disponibles para evitar la superposición de turnos.
*   **Historial Clínico:** Módulo para la gestión del historial clínico de los pacientes.
*   **Recetas Electrónicas:** Emisión de recetas en formato digital.

## Reportes y Estadísticas

El sistema es capaz de generar los siguientes reportes:

*   Listado de turnos por médico en un período determinado.
*   Cantidad de turnos por especialidad.
*   Listado de pacientes atendidos en un rango de fechas.
*   Gráfico estadístico que compara la asistencia vs. inasistencia de pacientes.

## Opciones Adicionales (Mayor Complejidad)

*   **Recordatorios Automáticos:** Envío de recordatorios de turnos por correo electrónico o notificaciones.

## Tecnologías Utilizadas

*   **Interfaz de Usuario:** A elección del grupo (Tkinter, Flet, PyQt, etc.).
*   **Base de Datos:** SQLite o MySQL.
*   **Lenguaje de Programación:** Python.

## Documentación y Diseño

La planificación y el diseño conceptual del sistema son una parte fundamental del proyecto. La documentación incluye:

*   **Diagrama Entidad-Relación (DER):** El modelo conceptual de la base de datos se encuentra en un archivo `.mdj`.
*   **Diagramas de Clases y Casos de Uso:** Para ilustrar la estructura y el comportamiento del sistema.

### Visualización del Diagrama Entidad-Relación

Para visualizar el archivo del diagrama (`.mdj`), es necesario utilizar la herramienta de modelado **StarUML**. Puede descargarla desde su sitio web oficial:

*   **Descargar StarUML:** [https://staruml.io/download](https://staruml.io/download)

StarUML es un software de modelado que soporta UML (Lenguaje Unificado de Modelado) y permite crear distintos tipos de diagramas para el diseño de sistemas.

## Criterios de Evaluación

El proyecto será evaluado según los siguientes criterios:

*   **Planificación y diseño conceptual:** 10%
*   **Diseño físico de base de datos:** 10%
*   **ABM y validaciones:** 20%
*   **Transacciones principales:** 20%
*   **Reportes detallados:** 10%
*   **Reportes estadísticos:** 10%
*   **Extensiones de mayor complejidad:** 10%
*   **Documentación y presentación final:** 10%

## Autores

*	Guillermina Paola Contigiani
*	Francisco Jalile
*	Fabrizzio Alejandro Leonetti
*	Yanella Esmeralda Odar Alejos
*	Laureano Suppo