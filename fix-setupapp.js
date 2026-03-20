#!/usr/bin/env node
/**
 * Fix pagination parameters in setupApp.ts
 * Extract page/pageSize from query and DON'T pass them to backend.readAll()
 */

const fs = require('fs');
const path = require('path');

const filePath = '__tests__/cases/setupApp.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Pattern to find and replace - all .get() routes with listado behavior
const listRoutePattern = /(\w+Router)\.get\('\/(\w+)',\s*async\s*\(req,\s*res\)\s*=>\s*\{\s*try\s*\{\s*const\s+filters\s*=\s*req\.query\s+as\s+any\s*\n\s*const\s+results\s*=\s*await\s+backend\.readAll\('(\w+)',\s*filters\)/g;

// Count matches
const matches = content.match(listRoutePattern);
console.log(`Found ${matches?.length || 0} routes to fix`);

// Replace each occurrence
content = content.replace(listRoutePattern, (match, routerVar, entityPath, entityName) => {
  return `${routerVar}.get('/${entityPath}', async (req, res) => {
    try {
      const { page, pageSize, filters } = extractPaginationAndFilters(req.query);
      const results = await backend.readAll('${entityName}', Object.keys(filters).length > 0 ? filters : undefined)`;
});

// Also replace the response pattern
const responsePattern = /res\.status\(200\)\.json\(\s*\{\s*success:\s*true,?\s*total:\s*results\.length,\s*items:\s*results,\s*page:\s*filters\.page\s*\|\|\s*1,\s*pageSize:\s*filters\.pageSize\s*\|\|\s*20\s*\}\s*\)/g;

content = content.replace(responsePattern, `const paginated = applyPagination(results, page, pageSize);
      res.status(200).json({ 
        success: true, 
        total: paginated.total, 
        items: paginated.items,
        page: paginated.page,
        pageSize: paginated.pageSize
      })`);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✅ Updated setupApp.ts');
