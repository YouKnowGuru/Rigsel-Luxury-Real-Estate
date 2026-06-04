const http = require('http');
const fs = require('fs');

const targets = [
  '/api/settings',
  '/api/properties?featured=true&limit=3',
  '/api/property-types',
  '/api/team',
  '/api/reviews',
  '/api/blogs?published=true',
  '/api/gallery',
  '/api/documents',
  '/',
  '/properties',
  '/about',
  '/contact',
  '/blog',
  '/gallery',
  '/downloads',
  '/land-calculator',
  '/terms',
  '/admin',
  '/admin/dashboard',
  '/admin/properties',
  '/admin/blogs',
  '/admin/team',
  '/admin/gallery',
  '/admin/reviews',
  '/admin/settings',
  '/admin/inquiries',
  '/admin/documents',
  '/admin/chats',
  '/admin/land-calculator',
];

function req(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    const r = http.get('http://127.0.0.1:3000' + path, { timeout: 60000 }, (res) => {
      let bytes = 0;
      res.on('data', (c) => (bytes += c.length));
      res.on('end', () =>
        resolve({ path, status: res.statusCode, ms: Date.now() - start, bytes })
      );
    });
    r.on('timeout', () => {
      r.destroy();
      resolve({ path, status: 'TIMEOUT', ms: Date.now() - start });
    });
    r.on('error', (e) =>
      resolve({ path, status: 'ERR', err: e.code || e.message, ms: Date.now() - start })
    );
  });
}

(async () => {
  const results = [];
  for (const p of targets) {
    const r = await req(p);
    results.push(r);
    console.log(
      String(r.status).padEnd(8) + (r.ms + 'ms').padStart(8) + '  ' + p +
      (r.err ? '  ' + r.err : '')
    );
  }
  fs.writeFileSync('smoke_result.json', JSON.stringify(results, null, 2));
})();
