'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));

const routes = {
  '/': { file: 'index.shtml', title: 'Affordable Web Development Company in Bangalore | BhaivaTech' },
  '/about': { file: 'about.shtml', title: 'About BhaivaTech | Web Development Company in Bangalore' },
  '/services': { file: 'services.shtml', title: 'Our Services | Web Development | BhaivaTech Bangalore' },
  '/projects': { file: 'projects.shtml', title: 'Our Web Development Portfolio | BhaivaTech' },
  '/contact': { file: 'contact.shtml', title: 'Contact BhaivaTech | Get a Free Quote for Your Web Project' },
};

const relevantWhatsAppFiles = [
  'index.shtml',
  'projects.shtml',
  'contact.shtml',
  'includes/header.html',
  'includes/footer.html',
  'llms.txt',
];

const expectedWhatsAppNumber = '918277807904';
const oldWhatsAppNumber = '12028808873';

test('route files exist, retain their expected content, and use canonical URLs', () => {
  for (const [url, route] of Object.entries(routes)) {
    assert.ok(exists(route.file), `${route.file} should exist`);
    const html = read(route.file);
    assert.equal(html.match(/<title>\s*([^<]+?)\s*<\/title>/i)?.[1], route.title);
    assert.match(html, new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']https://bhaivatech\\.com${url === '/' ? '/' : url}["']`, 'i'));
  }

  assert.match(read('about.shtml'), /We're BhaivaTech/);
  assert.match(read('services.shtml'), /Here's How We Can Help Your Business Grow Online/);
  assert.match(read('projects.shtml'), /Live Website Demos Built Around Brand Fit/);
  assert.match(read('contact.shtml'), /Got a Project in Mind\?/);
});

test('route pages reference existing SSI header and footer files', () => {
  for (const route of Object.values(routes)) {
    const html = read(route.file);
    assert.match(html, /<!--#include\s+virtual=["']includes\/header\.html["']\s*-->/);
    assert.match(html, /<!--#include\s+virtual=["']includes\/footer\.html["']\s*-->/);
  }
  assert.ok(exists('includes/header.html'));
  assert.ok(exists('includes/footer.html'));
});

test('all relevant WhatsApp targets use the approved number and omit the old target', () => {
  for (const file of relevantWhatsAppFiles) {
    const content = read(file);
    const targets = [...content.matchAll(/https?:?\/\/wa\.me\/(\d+)/g)].map((match) => match[1]);
    assert.ok(targets.length > 0, `${file} should contain a WhatsApp target`);
    assert.ok(targets.every((number) => number === expectedWhatsAppNumber), `${file} has an unapproved WhatsApp target`);
    assert.doesNotMatch(content, new RegExp(`wa\\.me\\/${oldWhatsAppNumber}`));
  }
});

test('.htaccess enables SSI, DirectoryIndex, and extensionless route rewrites', () => {
  const htaccess = read('.htaccess');
  assert.match(htaccess, /^\s*Options\s+\+Includes\s+-Indexes\s*$/m);
  assert.match(htaccess, /^\s*DirectoryIndex\s+index\.shtml\s*$/m);
  assert.match(htaccess, /^\s*AddType\s+text\/html\s+\.shtml\s*$/m);
  assert.match(htaccess, /^\s*AddHandler\s+server-parsed\s+\.shtml\s*$/m);
  assert.match(htaccess, /^\s*AddOutputFilter\s+INCLUDES\s+\.shtml\s*$/m);
  assert.match(htaccess, /RewriteEngine\s+On/);
  assert.match(htaccess, /RewriteRule\s+\^\(\[\^\.\]\+\)\$\s+\$1\.shtml\s+\[L\]/);
});

test('workflow explicitly packages .htaccess, guards it before FTP, and deploys only on push to main', () => {
  const workflow = read('.github/workflows/deploy.yml');
  const artifactStart = workflow.indexOf('uses: actions/upload-artifact@');
  const deployStart = workflow.indexOf('\n  deploy:');
  assert.ok(artifactStart >= 0, 'upload-artifact step should exist');
  assert.ok(deployStart > artifactStart, 'deploy job should follow the artifact job');

  const artifactBlock = workflow.slice(artifactStart, deployStart);
  assert.match(artifactBlock, /include-hidden-files:\s*true/);
  assert.match(artifactBlock, /^\s*\.htaccess\s*$/m);
  assert.doesNotMatch(artifactBlock, /^\s*\.\s*$/m, 'artifact paths should be an explicit allowlist');

  const deployBlock = workflow.slice(deployStart);
  const ftpStart = deployBlock.indexOf('SamKirkland/FTP-Deploy-Action@');
  assert.ok(ftpStart >= 0, 'FTP deploy action should exist');
  const beforeFtp = deployBlock.slice(0, ftpStart);
  assert.match(beforeFtp, /(?:test\s+-[fs]\s+\.htaccess|\[\s*!?\s*-f\s+\.htaccess\s*\])/);
  assert.match(deployBlock, /if:\s*github\.ref\s*==\s*['"]refs\/heads\/main['"]\s*&&\s*github\.event_name\s*==\s*['"]push['"]/);
});

test('header and footer navigation link to all four extensionless routes', () => {
  for (const file of ['includes/header.html', 'includes/footer.html']) {
    const markup = read(file);
    for (const route of ['about', 'services', 'projects', 'contact']) {
      assert.match(markup, new RegExp(`href=["']${route}["']`), `${file} should link to /${route}`);
    }
  }
});
