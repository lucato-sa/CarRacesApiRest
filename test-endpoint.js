const http = require('http');

function testEndpoint(path) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(`✅ ${path}`);
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Response: ${data.substring(0, 100)}`);
    });
  });

  req.on('error', (e) => {
    console.log(`❌ ${path} - Error: ${e.message}`);
  });

  req.end();
}

console.log('🧪 Testing API endpoints...\n');
testEndpoint('/api/health');
testEndpoint('/api/driving_environments'); // con guión bajo
testEndpoint('/api/drivingenviroments'); // sin guión
testEndpoint('/api/drivingenvironments'); // variante
testEndpoint('/api/clubs');

setTimeout(() => {
  process.exit(0);
}, 3000);
