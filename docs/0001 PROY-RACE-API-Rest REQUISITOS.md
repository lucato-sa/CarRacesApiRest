---
Proyecto CARRACE API-Rest  - REQUISITOS

Gestión campeonatos de carreras de coches
---


# Descripción

La API-Rest proporcionará los servicios necesarios para que organizadores de campeonatos o de carreras eventuales puedan definir eventos deportivos relacionados con el entorno del automovilismo.
Estos servicios también incluye que cualquier usuario que registro pueda inscribirse para participar y conocer el reglamento aplicado.

La normalización de las distintas disciplinas permitirá que pueda llegar a ser un punto de unión para todos los clubes y un usuario (piloto) pueda conocer todas las carreras que se 
celebran y evidentemente pueda ver sus resultados en una única plataforma.


# Requisitos Generales.

El alcance de la solución incluye la gestión de campeonatos, categorías, temporadas, carreras, pilotos, administradores de eventos y clubes de automovilismo con sus circuitos donde se realizan las carreras.

La API-Rest debe ofrecer unos servicios estructurados, seguros y standard para que se pueden desarrollar las futuras web o aplicaciones móviles.


# Requisitos Funcionles

## DrivingEnviroment
	Servicios CRUD. La columna default es de uso interno no se muestra.
	Datos:		Alias - requerido
				Descripción  - requerido
	Validar:	Los registros que tienen la columna default=1, no se pueden editar ni borrar.
				El Alias no se puede repetir sin distinguir mayúsculas ni minúsculas
				Los registros nuevos graban default=0

## Speciality
	Servicios CRUD. La columna default es de uso interno no se muestra.
	Datos:		Alias - requerido
				Descripción  - requerido
	Validar:	Los registros que tienen la columna default=1, no se pueden editar ni borrar.
				El Alias no se puede repetir sin distinguir mayúsculas ni minúsculas
				Los registros nuevos graban default=0


## Format
	Servicios CRUD. La columna default es de uso interno no se muestra.
	Datos:		Descripción  - requerido
	Validar:	Los registros que tienen la columna default=1, no se pueden editar ni borrar.
				Los registros nuevos graban default=0
				La Descripción no se puede repetir sin distinguir mayúsculas ni minúsculas				


## Surface
	Servicios CRUD. La columna default es de uso interno no se muestra.
	Datos:		Descripción  - requerido
	Validar:	Los registros que tienen la columna default=1, no se pueden editar ni borrar.
				Los registros nuevos graban default=0
				La Descripción no se puede repetir sin distinguir mayúsculas ni minúsculas				

## Discipline
	Servicios CRUD. La columna default es de uso interno no se muestra.
	Datos:		Alias - requerido
				Descripción  - requerido
				Especialidad : combo-elegir Alias de Speciality - requerido
				Formato		 : combo-elegir Descripción de Format - requerido
				Superficie   : compo-elegir Descripcion de Surface - requerido
	Validar:	Los registros que tienen la columna default=1, no se pueden editar ni borrar.
				Los registros nuevos graban default=0
				El Alias no se puede repetir sin distinguir mayúsculas ni minúsculas				
   

## Division
	Servicios CRUD. La columna default es de uso interno no se muestra.
	Datos:		Descripción  - requerido
				Disciplina	 : combo-elegir Alias de Discipline - requerido
				Club		 : combo-elegir Alias de Club  - opcional
	Validar:	Los registros que tienen la columna default=1, no se pueden editar ni borrar.
				Los registros nuevos graban default=0
				La Descripción no se puede repetir sin distinguir mayúsculas ni minúsculas,
				excepto cuando "La Descripcion que se repite pertenece a otro club". 
				

## Group
	Servicios CRUD. La columna default es de uso interno no se muestra.
	Datos:		Descripción  - requerido
				División	 : combo-elegir Descripcion de Division - requerido
				Club		 : combo-elegir Alias de Club  - opcional
	Validar:	Los registros que tienen la columna default=1, no se pueden editar ni borrar.
				Los registros nuevos graban default=0
				La Descripción no se puede repetir sin distinguir mayúsculas ni minúsculas,
				excepto cuando "La Descripcion que se repite pertenece a otro club". 

## Level:
	Servicios CRUD. Solo implementar Leer (listado)

## Scoring:
	Servicios CRUD. 
	Este servicio se compone de dos tablas pero se gestiona con único servicio.
	La Tabla ScoringDet se envía por el servicio de Scoring como un array.

	Datos:		Descripción  - requerido
				Club		 : combo-elegir Alias de Club  - opcional
	Validar:	La Descripción no se puede repetir sin distinguir mayúsculas ni minúsculas,
    				excepto cuando "La Descripcion que se repite pertenece a otro club". 
 	
				Las posiciones del array contiene el campo "Posicion" y "Puntos"
					El valor de la "Posicion" debe ir de 1 hasta el campo "UltPosPuntos" sin saltos.


## Championship:

	Servicios CRUD. 
	Datos:		Descripción  - requerido
				Entorno de conducción : combo-elegir Alias de DrivingEnviroment - requerido
				Especialidad : combo-elegir Alias de Speciality - requerido
				Disciplina	 : combo-elegir Alias de Discipline (filtrando por Speciality elegida) - requerido
				División	 : combo-elegir Descripcion de Division - (filtrando por Discipline elegida) - requerido
				Grupo		 : combo-elegir Descripcion de Grupo - (filtrando por Division elegido) - no requerido
				Nivel		 : combo-elegir Descripcion de Level - requerido
				Club		 : combo-elegir si el Level elegido es "Club"
				Puntuación   : combo-elegir Descripcion de Scoring filtrando:
								Si Level != "Club"  Scoring.ClubId=0)
								sino  Scoring.ClubId in ( 0, Championship.ClubId)
				
	Validar:	La Descripción no se puede repetir sin distinguir mayúsculas ni minúsculas
				Todas las condiciones que han definido en los filtros.
				Validar las relaciones normalizadas definidas.


## Rulebook:

	Servicios CRUD. 
	Datos:		Descripción:  - requerido
				FechaInicioValido: - requerido
				FechaFinValido: - no requerido
				División	 : combo-elegir Descripcion de Division - (filtrando por Discipline elegida) - requerido
				Grupo		 : combo-elegir Descripcion de Grupo - (filtrando por Division elegido) - no requerido
				Club		 : combo-elegir Alias de Club  - opcional	
				
	Validar:	La Descripción no se puede repetir sin distinguir mayúsculas ni minúsculas
				excepto cuando "La Descripcion que se repite pertenece a otro club". 	
				La FechaFinValido: Si se introduce no puede ser anterior a FechaInicioValido


## Rule:

	Servicios CRUD. 
	Datos:		RuleCode:		- requerido
				Descripción:    - requerido
				RulebookId : 	- requerido 
				
	Validar:	La RuleCode no se puede repetir sin distinguir mayúsculas ni minúsculas.
				
				

## Season:

	Servicios CRUD. 
	Datos:		Descripción: - requerido
				FechaDesde: - requerido
				FechaHasta: - requerido
				PilotosMin : - requerido 
				PilotosMax : - requerido 
				SoloSocios : - requerido 
				Campeonato : combo-elegir Descripcion de Championship - requerido	
				Reglamento : combo-elegir Descripcion de Rulebook - requerido					
				
	Validar:	La Descripción no se puede repetir sin distinguir mayúsculas ni minúsculas
				cuando pertenecen al mismo Championship.
				La FechaHasta > FechaDesde
				Las fechas no se puede solapar con otra Season del mismo Championship
				El valor de PilotosMin y PilotosMax tiene que ser >= 0 y PilotosMax >= PilotosMin
				El valor de SoloSocios puede ser true si Championship.Level al que pertenece es "Club" 


## Club:

	Servicios CRUD. 
	Datos:		Alias: - requerido
				TaxNombre: - requerido
				TaxNumero: - requerido
				Descripción : - requerido 
				FechaFundacion : - requerido 
	Validar:	El Alias no se puede repetir sin distinguir mayúsculas ni minúsculas				
				El TaxNumero no se puede repetir sin distinguir mayúsculas ni minúsculas
				FechaFundacion debe ser anterior a la actual.

## Venue:

	Servicios CRUD. 
	Datos:		Alias: - requerido
	            SedeSocial   - requerido true-false
	            SedeCarreras - requerido true-false
	            Direccion   - no requerido
	            Localidad   - no requerido
	            Provincia   - no requerido
	            Pais        - no requerido 
				MapLatitud  - no requerido
                MapLongitud - no requerido
				ClubId		- requerido
				
				
	Validar:	El Alias no se puede repetir sin distinguir mayúsculas ni minúsculas				
				en las Venue del mismo Club.
				Solo puede haber un registro por cada Club con el valor SedeSocial=true
				Validar que MapLatitud y MapLongitud son coordenadas geográficas, si no son cero.
				Una sede no puede modificar SedeCarreras=false si tiene definidos registros en Circuit.
	

## Circuit:

	Servicios CRUD. 
	Datos:		VenueId		- requerido 
				Entorno de conducción : combo-elegir Alias de DrivingEnviroment - requerido
				Superficie   : compo-elegir Descripcion de Surface - requerido
				Alias: - requerido
				Descripcion - no requerido
				Longitud    - no requerido 	         
				Permanente  - requerido  true o false 	         
				TotSegments - requerido   	         
				SlotAnalogic - requerido  true o false	         
				SlotDigital  - requerido  true o false	         
				SlotTotLanes - no requerido	         
				
				
	Validar:	El Alias no se puede repetir sin distinguir mayúsculas ni minúsculas				
				en los Circuit de todas las Venue del mismo Club.
				Si se ha elegido si ha elegido el "Slot" de DrivingEnviroment entones:
					Al menos SlotAnalogic o SlotDigital o ambas tiene que ser true.
					SlotTotLanes > 0
				TotSegments > 0	
					
	Hacer:		Se crean tantos registros como Circuit.TotSegments x Circuit.TotLanes y para registrar las vueltas y tiempos de los coches.	
	
				Al crear o modifica tenemos que actualizar los Segments.

## Segment:

	Servicios CRUD. 
	Datos:		CircuitId		- requerido 
				Alias: - requerido
                TotSections
                Longitud   

	Validar: 	TotSections
				Longitud

	NOTA:   	Datos informativos que no se editan, solo se consultan:
                NumSegment 
                NumLane    


## Event:

Servicios CRUD. 
	Datos:		Descripción  - requerido
				FechaInicio - requerido
				FechaFin - requerido
				Club		 : combo-elegir Alias de Club  - requerido
				
				
	Validar:	Descripcion, no se puede repetir sin distinguir mayúsculas ni minúsculas
				FechaInicio < FechaFin 
				FechaInicio >= fecha actual
				Si la diferencia entre la FechaInicio y FechaFin > 4 dias. Devolver un aviso. 
				Si la fechas del evento coninciden con otro evento del Club. Devolver aviso.

## Competition:

Servicios CRUD.  
	Datos:	
			EventId:	combo-elegir Descripcion de Season - requerido
			Temporada : combo-elegir Descripcion de Season - requerido					
			Sede	  : combo-elegir Alias de Venue  -(filtrando por el Club organizador Event.IdClub)  requerido
			Alias     : requerido
			TotalRaces:   - requerido          	
			FechaInicioInscripPri	: no requerido	
			FechaFinInscripPri   	: no requerido	
			FechaInicioInscrip   	: no requerido
			FechaFinInscrip      	: no requerido
			PilotosMinInscrip    	: no requerido
			PilotosMaxInscrip    	: no requerido
			Responsable          	: combo - elegir Nick de User - requerido  
			SoloUsuariosReg   		: requerido true o false
			Notas					: no requerido

				
	Validar:	
			Temporada la fecha actual esta dentro del rango de Season.FechaDesde y Season.FechaHasta
			El Alias no se puede repetir sin distinguir mayúsculas ni minúsculas				
				en las Competition de la Season.
			TotRaces > 0 
			Responsable: 
				FechaInicio < FechaFin 
				FechaInicio >= fecha actual
				Si la diferencia entre la FechaInicio y FechaFin > 4 dias. Devolver un aviso. 
				Si la fechas del evento coninciden con otro evento del Club. Devolver aviso.

	Proceso:
			Actualizar los datos en la tabla Competition
			El responsable de evento se graba en UserEntity con los siguientes valores:
				UserId con User.UserId
				EntityLinkId con EntityLink.EntityLinkId de EntityName="Competition"
				RolId con Rol.RolId de Pseudonimo =  "CompetitionResp" 
				EntityId de Competition.CompetitionId
				FechaRegistro con fecha actual
				Activo = true
			Generar Registros en la tabla Race según el número TotalRaces 
				numeros desde 1 hasta TotalRaces y guarda la numeracion en Race.NumRace


## Registration

Servicios CRUD. 
	Datos:		
			Prueba: combo-elegir Alias de Competition - requerido
			Piloto: combo-elegir Nick de User - requerido
			FechaPreRegistro:
			FechaRegistro:
			Dorsal:
			
				
	Validar:	El Dorsal no se puede repetir sin distinguir mayúsculas ni minúsculas. 
				El Dorsal se puede ser nullo si no tiene FechaPreRegistro.
							
			

## Race:

Servicios CRUD.  Solo se implementa el método PUT
	Datos:		Fecha  - requerido
				Hora - requerido
				Estado: - requerido

	Validar: 	Fecha dentro del rango del Event al que pertenece.		
				Cuando el estado sea "2" (Finalizada) se generan los registros 
				de la tabla RaceResult con todos los pilotos inscritos.

## RaceResult:

Servicios CRUD.  Solo se implementa el método PUT
	Datos		Posicion	: requerido  
				Laps		: 
				NumSegment	: 
				Pole		: boolean
				FastLap		: boolean

	Validar: 	Solo un piloto (User) puede tener a true los campos Pole y/o FastLap.
				Position		
				Laps        >= 0
				NumSegment  >= 0
				
	Me método de Get devolverá incluirá el Nick de cada Usuario para que solo sea
	necesario buscar el nombre de los usuarios (pilotos)

## Rol:

Servicios CRUD. 
	Es una tabla de configuración - Solo servicios GET
		

## EntityLink

	Servicios CRUD. 
	Es una tabla de configuración - Solo servicios GET


## User:

Servicios CRUD. 
	Datos:		Nick  - requerido
				Nombre - requerido
				Apellidos - requerido
				el resto de campos no son requeridos
				
	Validar:	Nick, no se puede repetir sin distinguir mayúsculas ni minúsculas

	Al crear un usuario se graba la fecha de registro con la fecha actual

## UserEntity:

Servicios CRUD. 
	Datos:		Nick  - requerido
				Entidad: 
					Nombre requerido
					IdEntidad - requerido
				Rol - requerido
				el resto de campos no son requeridos
				
	Validar:	
				Validar que se puede crear la relación del Usuario con Rol/Entidad 
				con la Entidad  RolEntity


