const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '__tests__', 'cases', 'setupApp.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Mapping de cambios: [antiguo, nuevo]
const replacements = [
  // raceresults → race_results
  [`raceresultsRouter.post('/raceresults'`, `raceresultsRouter.post('/race_results'`],
  [`backend.create('raceresults'`, `backend.create('race_results'`],
  [`raceresultsRouter.get('/raceresults'`, `raceresultsRouter.get('/race_results'`],
  [`backend.readAll('raceresults'`, `backend.readAll('race_results'`],
  [`raceresultsRouter.get('/raceresults/:id'`, `raceresultsRouter.get('/race_results/:id'`],
  [`backend.read('raceresults'`, `backend.read('race_results'`],
  [`raceresultsRouter.put('/raceresults/:id'`, `raceresultsRouter.put('/race_results/:id'`],
  [`backend.update('raceresults'`, `backend.update('race_results'`],
  [`raceresultsRouter.delete('/raceresults/:id'`, `raceresultsRouter.delete('/race_results/:id'`],
  [`backend.delete('raceresults'`, `backend.delete('race_results'`],
  
  // drivingenviroments → driving_environments
  [`drivingenvironmentsRouter.post('/drivingenviroments'`, `drivingenvironmentsRouter.post('/driving_environments'`],
  [`backend.create('drivingenviroments'`, `backend.create('driving_environments'`],
  [`drivingenvironmentsRouter.get('/drivingenviroments'`, `drivingenvironmentsRouter.get('/driving_environments'`],
  [`backend.readAll('drivingenviroments'`, `backend.readAll('driving_environments'`],
  [`drivingenvironmentsRouter.get('/drivingenviroments/:id'`, `drivingenvironmentsRouter.get('/driving_environments/:id'`],
  [`backend.read('drivingenviroments'`, `backend.read('driving_environments'`],
  [`drivingenvironmentsRouter.put('/drivingenviroments/:id'`, `drivingenvironmentsRouter.put('/driving_environments/:id'`],
  [`backend.update('drivingenviroments'`, `backend.update('driving_environments'`],
  [`drivingenvironmentsRouter.delete('/drivingenviroments/:id'`, `drivingenvironmentsRouter.delete('/driving_environments/:id'`],
  [`backend.delete('drivingenviroments'`, `backend.delete('driving_environments'`],
  
  // entitylinks → entity_links
  [`entitylinksRouter.post('/entitylinks'`, `entitylinksRouter.post('/entity_links'`],
  [`backend.create('entitylinks'`, `backend.create('entity_links'`],
  [`entitylinksRouter.get('/entitylinks'`, `entitylinksRouter.get('/entity_links'`],
  [`backend.readAll('entitylinks'`, `backend.readAll('entity_links'`],
  [`entitylinksRouter.get('/entitylinks/:id'`, `entitylinksRouter.get('/entity_links/:id'`],
  [`backend.read('entitylinks'`, `backend.read('entity_links'`],
  [`entitylinksRouter.put('/entitylinks/:id'`, `entitylinksRouter.put('/entity_links/:id'`],
  [`backend.update('entitylinks'`, `backend.update('entity_links'`],
  [`entitylinksRouter.delete('/entitylinks/:id'`, `entitylinksRouter.delete('/entity_links/:id'`],
  [`backend.delete('entitylinks'`, `backend.delete('entity_links'`],
  
  // userentities → user_entities
  [`userentitiesRouter.post('/userentities'`, `userentitiesRouter.post('/user_entities'`],
  [`backend.create('userentities'`, `backend.create('user_entities'`],
  [`userentitiesRouter.get('/userentities'`, `userentitiesRouter.get('/user_entities'`],
  [`backend.readAll('userentities'`, `backend.readAll('user_entities'`],
  [`userentitiesRouter.get('/userentities/:id'`, `userentitiesRouter.get('/user_entities/:id'`],
  [`backend.read('userentities'`, `backend.read('user_entities'`],
  [`userentitiesRouter.put('/userentities/:id'`, `userentitiesRouter.put('/user_entities/:id'`],
  [`backend.update('userentities'`, `backend.update('user_entities'`],
  [`userentitiesRouter.delete('/userentities/:id'`, `userentitiesRouter.delete('/user_entities/:id'`],
  [`backend.delete('userentities'`, `backend.delete('user_entities'`],
  
  // rolentities → rol_entities
  [`rolentitiesRouter.post('/rolentities'`, `rolentitiesRouter.post('/rol_entities'`],
  [`backend.create('rolentities'`, `backend.create('rol_entities'`],
  [`rolentitiesRouter.get('/rolentities'`, `rolentitiesRouter.get('/rol_entities'`],
  [`backend.readAll('rolentities'`, `backend.readAll('rol_entities'`],
  [`rolentitiesRouter.get('/rolentities/:id'`, `rolentitiesRouter.get('/rol_entities/:id'`],
  [`backend.read('rolentities'`, `backend.read('rol_entities'`],
  [`rolentitiesRouter.put('/rolentities/:id'`, `rolentitiesRouter.put('/rol_entities/:id'`],
  [`backend.update('rolentities'`, `backend.update('rol_entities'`],
  [`rolentitiesRouter.delete('/rolentities/:id'`, `rolentitiesRouter.delete('/rol_entities/:id'`],
  [`backend.delete('rolentities'`, `backend.delete('rol_entities'`],
  
  // scoringdet → scoring_det
  [`scoringdetRouter.post('/scoringdet'`, `scoringdetRouter.post('/scoring_det'`],
  [`backend.create('scoringdet'`, `backend.create('scoring_det'`],
  [`scoringdetRouter.get('/scoringdet'`, `scoringdetRouter.get('/scoring_det'`],
  [`backend.readAll('scoringdet'`, `backend.readAll('scoring_det'`],
  [`scoringdetRouter.get('/scoringdet/:id'`, `scoringdetRouter.get('/scoring_det/:id'`],
  [`backend.read('scoringdet'`, `backend.read('scoring_det'`],
  [`scoringdetRouter.put('/scoringdet/:id'`, `scoringdetRouter.put('/scoring_det/:id'`],
  [`backend.update('scoringdet'`, `backend.update('scoring_det'`],
  [`scoringdetRouter.delete('/scoringdet/:id'`, `scoringdetRouter.delete('/scoring_det/:id'`],
  [`backend.delete('scoringdet'`, `backend.delete('scoring_det'`],
];

// Aplicar todos los cambios
replacements.forEach(([old, nuevo]) => {
  content = content.replaceAll(old, nuevo);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ setupApp.ts actualizado con nombres en snake_case');
