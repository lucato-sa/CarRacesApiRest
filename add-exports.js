#!/usr/bin/env node
/**
 * Add proper model type exports to all generated repository files
 */
const fs = require('fs');
const path = require('path');

const repos = [
  { dir: 'users', model: 'User' },
  { dir: 'races', model: 'Race' },
  { dir: 'competitions', model: 'Competition' },
  { dir: 'championships', model: 'Championship' },
  { dir: 'events', model: 'Event' },
  { dir: 'registrations', model: 'Registration' },
  { dir: 'disciplines', model: 'Discipline' },
  { dir: 'formats', model: 'Format' },
  { dir: 'surfaces', model: 'Surface' },
  { dir: 'divisions', model: 'Division' },
  { dir: 'roles', model: 'Role' },
  { dir: 'rolentities', model: 'RoleEntity' },
  { dir: 'userentities', model: 'UserEntity' },
  { dir: 'raceresults', model: 'RaceResult' },
  { dir: 'entitylinks', model: 'EntityLink' },
  { dir: 'specialities', model: 'Speciality' },
  { dir: 'drivingenviroments', model: 'DrivingEnvironment' },
];

for (const { dir, model } of repos) {
  const repoPath = `src/${dir}/repository/${dir.replace(/s$/, '')}.repository.ts`;
  const modelPath = `src/${dir}/models/${dir.replace(/s$/, '')}.model.ts`;
  
  if (!fs.existsSync(repoPath)) {
    console.log(`⚠️  Skip: ${repoPath} not found`);
    continue;
  }
  
  let content = fs.readFileSync(repoPath, 'utf-8');
  
  // Check if export is already there
  if (content.includes(`export { ${model}`) || content.includes(`export { ${model}Repository`) ) {
    console.log(`✅ Already has exports: ${repoPath}`);
    continue;
  }
  
  // Add export statement at the end
  content += `\n\n// Export types for use in domain/use-cases\nexport type { ${model} };\nexport { ${model}Repository };\n`;
  
  fs.writeFileSync(repoPath, content, 'utf-8');
  console.log(`✅ Added exports: ${repoPath}`);
}

console.log(`\n✅ Done!`);
