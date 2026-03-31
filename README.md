# CarRaces    API-Rest


Api Rest - Gestión de campeonatos y eventos de carreras de coches


El origen de este proyecto nació con la necesidad de hacer un trabajo para un Master de programación con IA y aprovechando mis conocimientos de uno de mis hobbys decidí cubrir una necesidad en las carreras de coches de Slot (Scalextric) en los clubs.

A medida que fuí avanzando en el proyecto y consultar la información de la federación de automovilismo y las páginas web de todas las categorías de la escala 1:1 decidí invertir un gran esfuerzo en el análisis de requisitos.

La documentación de dicho análisis esta en la carpeta "docs". Estos ficheros son importantes !!!!!.

La API proporciona los servicios necesarios para dos tipos de usuarios, los organizadores que definen los datos del club, categorías, reglas y campeonatos; y por otro lado tendremos a los pilotos que se inscriben a dichas pruebas.

La idea inicial de esta API es que se pueda aprovechar para cualquier tipo de club cuya actividad sean las carreras de coches ya sean reales, modelismo-rc, slot y virtuales.



## Endpoints Principales

openapi.yaml



## Requisitos Previos

- Node.js 18+
- npm 9+
- PostgreSQL 14+ O Supabase     (PostgreSQL en desarrollo)


## Testing
npm run dev:memory
npm run dev:files
npm run dev:supabase



## Despliegue
- Local                         (en desarrollo)
- Docker
- Producción (AWS)

Actualmente la BBDD que utiliza la API Rest es única y esta alojada en Supabase-Postgre.

Se ha creado un contenedor Docker que contiene la API y se conecta directamente a Supabase. (Alojada en un servidor de AWS)


Url de Test: http://16.145.17.196:3000/api/driving_environments

Despliegue local:

Pendiente de implementar una solución Docker (API + Postgres)



## Estado del Proyecto

Este proyecto esta en la fase inicial y he sido muy ambicioso a la hora de definir los objetivos, y es la principal causa de algunos servicios no tengan implementados todos los casos de uso.

En algunas partes de código se hace referencia a typeORM para la gestión del BACKEND con Postgres pero la descarté porque no era muy flexible y puedo programar bien con SQL. Poco a poco lo iré limpiando.



## Licencia
GPLv3 - Carlos Torre


Slide:

https://www.canva.com/design/DAHCNB17MEg/HE4VTudmrAnc2o7O6bVjTw/edit?utm_content=DAHCNB17MEg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

    (PENDIENTE DE ACTUALIZAR, hace referencia a typeORM del diseño anterior)



