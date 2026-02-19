# Proyecto RACECAR API-Rest

## Datos iniciales de las Entidades

#### DrivingEnviroment

| DrivingEnviromentId | Alias        | Descripcion                                  | default |
| ------------------- | ------------ | -------------------------------------------- | ------- |
| 1                   | Real         | coches con vehículos reales                  | 1       |
| 2                   | Virtual      | SimRancing. coches en software de simulación | 1       |
| 3                   | RC/Modelismo | Coches de radio control                      | 1       |
| 4                   | Slot         | Coches en pista eléctrica                    | 1       |
| 5                   | Formación    | Seguridad vial y enseñanza                   | 1       |

#### Specialty

| SpecialtyId | Alias           | Descripcion                                           | default |
| ----------- | --------------- | ----------------------------------------------------- | ------- |
| 1           | Circuito        | Circuito cerrado                                      | 1       |
| 2           | Carreteras      | Carreteras y caminos de tramos abierto / semi-abierto | 1       |
| 3           | Habilidad       | Slalom, Drifting, Trial                               | 1       |
| 4           | Larga Distancia | Larga Distancia                                       | 1       |
| 5           | Records         | Records                                               | 1       |

#### Format

| FormatId | Descripción      | default |
| -------- | ---------------- | ------- |
| 1        | Velocidad        | 1       |
| 2        | Velocidad/Cruce  | 1       |
| 3        | Precisión/Tiempo | 1       |
| 4        | Enlace/Velocidad | 1       |
| 5        | Velocidad pura   | 1       |
| 6        | Navegación       | 1       |
| 7        | Agilidad/Conos   | 1       |
| 8        | Estilo/Control   | 1       |
| 9        | Superación       | 1       |

#### Surface

| SurfaceId | Descripción                | default |
| --------- | -------------------------- | ------- |
| 1         | Pista cerrada              | 1       |
| 2         | Pista cerrada (Tierra)     | 1       |
| 3         | Pista cerrada (Kartódromo) | 1       |
| 4         | Mixto (Asfalto/Tierra)     | 1       |
| 5         | Asfalto (Tramos)           | 1       |
| 6         | Asfalto (Ascensión)        | 1       |
| 7         | Tierra (Tramos)            | 1       |
| 8         | Raid/Campo abierto         | 1       |
| 9         | Mixto                      | 1       |
| 10        | Asfalto                    | 1       |
| 11        | Obstáculos                 | 1       |

#### Discipline

Las disciplina es una subclasificación de la especialidad

| DisciplineId | Alias         | Descripcion       | SpecialtyId | FormatId | SurfaceId | default |
| ------------ | ------------- | ----------------- | ----------- | -------- | --------- | ------- |
| 1            | Asfalto       | 1.1 Asfalto       | 1           | 1        | 1         | 1       |
| 2            | Autocross     | 1.2 Autocross     | 1           | 1        | 2         | 1       |
| 3            | Karting       | 1.3 Karting       | 1           | 1        | 3         | 1       |
| 4            | Rallye Cross  | 1.4 Rallye Cross  | 1           | 2        | 4         | 1       |
| 5            | Regularidad   | 1.5 Regularidad   | 1           | 3        | 1         | 1       |
| 6            | Rallye        | 2.1 Rallye        | 2           | 4        | 5         | 1       |
| 7            | Montaña       | 2.2 Montaña       | 2           | 5        | 6         | 1       |
| 8            | Rallye Tierra | 2.4 Rallye Tierra | 2           | 4        | 7         | 1       |
| 9            | Todo Terreno  | 2.5 Todo Terreno  | 2           | 6        | 8         | 1       |
| 10           | Slalom        | 3.1 Slalom        | 3           | 7        | 9         | 1       |
| 11           | Drifting      | 3.2 Drifting      | 3           | 8        | 10        | 1       |
| 12           | Trial         | 3.3 Trial         | 3           | 9        | 11        | 1       |

#### Division

| DivisionId | DisciplineId | Descripcion | ClubId | default |
| ---------- | ------------ | ----------- | ------ | ------- |
| 1          | 1            | Formula 1   | 0      | 1       |
| 2          | 1            | Formula 2   | 0      | 1       |
| 3          | 1            | Formula E   | 0      | 1       |
| 4          | 1            | GT          | 0      | 1       |
| 5          | 1            | GT2         | 0      | 1       |
| 6          | 1            | GT3         | 0      | 1       |
| 7          | 1            | Gr.5        | 0      | 1       |
| 8          | 1            | Gr.C        | 0      | 1       |
| 9          | 1            | DTM         | 0      | 1       |
| 9          | 1            | Hipercar    | 0      | 1       |

#### Group

| GroupId | DivisionId | Descripcion         | ClubId | default |
| ------- | ---------- | ------------------- | ------ | ------- |
| 1       | 9          | DTM Classic 90-2000 | 0      | 1       |
| 2       | 9          | DTM 2010->          | 0      | 1       |

#### Level:

| LevelId | Descripción |
| ------- | ----------- |
| 1       | Mundial     |
| 2       | Continental |
| 3       | Nacional    |
| 4       | Regional    |
| 5       | Provincial  |
| 6       | Club        |


#### Rol:

| RolId   | Descripción        |
| ------- | ------------------ |
| 1       | Administrador Club |
| 2       | Tesorero           |
| 3       | Socio              |
| 4       | Contacto           |
| 5       | Invitado           |



#### EntityLink:

| EntityLinkId | EntityName |
| ------------ | -----------|
| 1            | Club       |
