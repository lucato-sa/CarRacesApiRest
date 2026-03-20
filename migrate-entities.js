#!/usr/bin/env node
/**
 * Migration script: Parse agent output and create all model/repository files
 */
const fs = require('fs');
const path = require('path');

// Read the generated code file
const generatedCodePath = process.argv[2] || 'c:\\Users\\Carlos\\AppData\\Roaming\\Code\\User\\workspaceStorage\\01314017cb9579bb88c94fa807724d3b\\GitHub.copilot-chat\\chat-session-resources\\e9c4c737-c415-4248-83ee-8d3acba474db\\toolu_bdrk_01LFdFFzvq5ZWN4ZW5YnLrUT__vscode-1773922425658\\content.txt';

if (!fs.existsSync(generatedCodePath)) {
  console.error(`File not found: ${generatedCodePath}`);
  process.exit(1);
}

const content = fs.readFileSync(generatedCodePath, 'utf-8');

// Parse sections - look for "### Model File:" or "### Repository File:"
const sections = content.split(/^###\s+/m).slice(1); // Skip preamble

let createdCount = 0;
let errorCount = 0;

for (const section of sections) {
  const lines = section.split('\n');
  if (lines.length < 2) continue;

  const header = lines[0]; // e.g., "Model File: `src/users/models/user.model.ts`"
  
  // Extract file path
  const filePathMatch = header.match(/`([^`]+)`/);
  if (!filePathMatch) continue;
  
  const filePath = filePathMatch[1];
  
  // Find code block (starts with "```typescript" or "```")
  let codeStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('```typescript') || lines[i].startsWith('```')) {
      codeStart = i + 1;
      break;
    }
  }
  
  if (codeStart === -1) continue;
  
  // Find code end
  let codeEnd = -1;
  for (let i = codeStart; i < lines.length; i++) {
    if (lines[i].trim() === '```') {
      codeEnd = i;
      break;
    }
  }
  
  if (codeEnd === -1) codeEnd = lines.length;
  
  // Extract code
  const code = lines.slice(codeStart, codeEnd).join('\n').trim();
  if (!code) continue;
  
  // Create directory if needed
  const fullPath = path.resolve(filePath);
  const dir = path.dirname(fullPath);
  
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(fullPath, code, 'utf-8');
    console.log(`✅ Created: ${filePath}`);
    createdCount++;
  } catch (err) {
    console.error(`❌ Error creating ${filePath}:`, err.message);
    errorCount++;
  }
}

console.log(`\n📊 Summary: ${createdCount} files created, ${errorCount} errors`);
