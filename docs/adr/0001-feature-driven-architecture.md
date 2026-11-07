# 1. Adopción de Feature-Driven Architecture

* **Estado:** Aprobado
* **Fecha:** 2026-09-18

## Contexto
La estructura anterior dentro de `pages/` agrupaba lógica de negocio, schemas y acciones en un solo nivel, dificultando el escalamiento y acoplando vistas con lógica HTTP.

## Decisión
Se decide separar la capa de presentación (`pages/`) de la capa de negocio (`features/`). Cada funcionalidad dentro de `features/` contendrá sus propias interfaces, esquemas, componentes y lógica de API.

## Consecuencias
- Crecimiento modularizado y desacoplado.
- Reutilización limpia de componentes.
- Mayor claridad al trabajar en equipo o refactorizar.