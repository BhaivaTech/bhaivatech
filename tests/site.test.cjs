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

test('footer call icon and visible phone link use the approved telephone destination', () => {
  const footer = read('includes/footer.html').replace(/<!--[\s\S]*?-->/g, '');
  const anchors = [...footer.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]);
  const callIcons = anchors.filter((anchor) => /\baria-label=["']Call BhaivaTech["']/i.test(anchor));
  assert.equal(callIcons.length, 1, 'footer should contain exactly one call icon');
  assert.equal(callIcons[0].match(/\bhref=["']([^"']+)["']/i)?.[1], 'tel:+918277807904');
  const phoneTargets = anchors.map((anchor) => anchor.match(/\bhref=["'](tel:[^"']+)["']/i)?.[1]).filter(Boolean);
  assert.equal(phoneTargets.length, 2, 'footer should retain the call icon and visible phone link');
  assert.ok(phoneTargets.every((target) => target === 'tel:+918277807904'));
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

const servicePage = 'website-development.shtml';
const serviceUrl = 'https://bhaivatech.com/services/website-development/';
const serviceTitle = 'Website Development Company in Bangalore | Bhaivatech';
const serviceDescription = 'Bhaivatech builds clear, mobile-friendly websites for small businesses and startups in Bangalore. Discuss your website scope, redesign or e-commerce idea.';
const serviceWhatsApp = 'https://wa.me/918277807904?text=Hi%20BhaivaTech%2C%20I%27d%20like%20to%20discuss%20a%20website%20project.';

test('website-development page preserves approved metadata and one H1', () => {
  const html = read(servicePage);
  assert.equal(html.match(/<title>([^<]+)<\/title>/)?.[1], serviceTitle);
  assert.ok(html.includes(`<meta name="description" content="${serviceDescription}">`));
  assert.ok(html.includes(`<link rel="canonical" href="${serviceUrl}">`));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<h1>Website development for Bangalore businesses<\/h1>/);
  assert.doesNotMatch(html, /noindex|application\/ld\+json|<form\b/i);
});

test('website-development page preserves approved human-tone paragraphs and contact payloads', () => {
  const html = read(servicePage);
  for (const copy of [
    'A good business website should explain what you offer and make the next step clear.',
    'Bhaivatech lists Next.js, React and plain HTML/CSS among its options. The right fit depends on the website’s requirements.',
    'Bhaivatech lists AWS deployment, cPanel hosting, domain setup, SSL certificates and server management among its services. Ask the proposal to specify which apply, who owns the accounts and what renewals cost.',
  ]) assert.ok(html.includes(copy), `Missing approved wording: ${copy}`);
  const calls = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(m => m[1]);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(target => target === 'tel:+918277807904'));
  const chats = [...html.matchAll(/href="(https:\/\/wa\.me\/[^\"]+)"/g)].map(m => m[1]);
  assert.equal(chats.length, 2);
  assert.ok(chats.every(target => target === serviceWhatsApp));
  for (const route of ['contact', 'projects']) assert.ok(html.includes(`href="https://bhaivatech.com/${route}"`));
  assert.ok(html.includes('href="/services"'));
});

test('website-development page excludes editorial notes and preserves honest portfolio labels', () => {
  const html = read(servicePage);
  assert.doesNotMatch(html, /owner-confirmed|approval checklist|proposed workflow for approval|Do not submit|These labels must remain|Do not add client logos|This page should not imply|Internal-link and implementation/i);
  assert.match(html, /Yogasparsh Yoga &amp; Fitness and both Fit or Fight concepts as <strong>live demos<\/strong>/);
  assert.match(html, /Square Feet Group as a <strong>live site<\/strong>/);
  assert.match(html, /A practical proposed process/);
});

test('website-development page reuses root-resolved assets and is included by existing artifact allowlist', () => {
  const html = read(servicePage);
  assert.match(html, /<base href="\/">/);
  for (const file of ['includes/header.html', 'includes/footer.html']) assert.ok(html.includes(`virtual="/${file}"`));
  for (const file of ['css/website-development.css', 'js/website-development.js']) {
    assert.ok(exists(file));
    assert.ok(html.includes(`/${file}`));
  }
  const workflow = read('.github/workflows/deploy.yml');
  assert.match(workflow, /^\s*\*\.shtml\s*$/m);
  assert.match(workflow, /^\s*css\/\s*$/m);
  assert.match(workflow, /^\s*js\/\s*$/m);
  assert.match(read('services.shtml'), /<h3><a href="\/services\/website-development\/">Website Development<\/a><\/h3>/);
});

test('website-development routing preserves the approved trailing slash and canonicalizes aliases before generic rewrites', () => {
  const htaccess = read('.htaccess');
  const mapping = 'RewriteRule ^services/website-development/$ website-development.shtml [END]';
  assert.ok(htaccess.includes(mapping));
  assert.ok(htaccess.indexOf(mapping) < htaccess.indexOf('# Remove trailing slash'));
  assert.ok(htaccess.includes('RewriteRule ^services/website-development$ /services/website-development/ [R=301,L,NE]'));
  assert.ok(htaccess.includes('RewriteCond %{THE_REQUEST} \\s/+website-development\\.shtml(?:[?\\s]) [NC]'));
  assert.ok(htaccess.includes('RewriteRule ^website-development\\.shtml$ /services/website-development/ [R=301,L,NE]'));
  assert.ok(htaccess.includes('RewriteRule ^website-development$ /services/website-development/ [R=301,L,NE]'));
  assert.ok(!exists('services'), 'No physical services folder may shadow the existing /services hub');
});

const stripMarkup = (html) => html.replace(/<svg\b[\s\S]*?<\/svg>/gi, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const activeMarkup = (file) => read(file).replace(/<!--[\s\S]*?-->/g, '');
test('website enquiry actions use the shared label without changing functional submits or WhatsApp labels', () => {
  for (const [file, count] of [['index.shtml', 3], ['about.shtml', 1], ['services.shtml', 1], ['projects.shtml', 1], [servicePage, 2]]) {
    const actions = [...activeMarkup(file).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
      .filter(([, attributes]) => /\bclass="[^"]*\bbtn-(?:blue|primary|start|contact-now)\b/.test(attributes) && !/wa\.me\//.test(attributes));
    assert.equal(actions.length, count, `${file}: all primary enquiry actions covered`);
    for (const [, , content] of actions) assert.equal(stripMarkup(content), 'Discuss your website', file);
  }
  assert.match(read('index.shtml'), /<button type="submit" class="btn-blue">Request Quote<\/button>/);
  assert.match(read('contact.shtml'), /<button type="submit" class="btn-blue w-full">Send It Over →<\/button>/);
  assert.match(read('includes/header.html'), />WhatsApp Quote<\/a>/);
  assert.match(read('index.shtml'), />Get a Website Quote on WhatsApp<\/a>/);
  assert.match(read('projects.shtml'), />Discuss Your Project<\/a>/);
});
test('portfolio count distinguishes three existing demos from one live site', () => {
  const html = read('projects.shtml');
  const cards = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(m => m[0]);
  assert.equal(cards.length, 4);
  assert.equal(cards.filter(card => /class="portfolio-note">Live demo •/.test(card)).length, 3);
  assert.equal(cards.filter(card => /class="portfolio-note">Live site •/.test(card)).length, 1);
  assert.match(html, /<h2>Three live demos and one live site<\/h2>/);
  assert.match(html, /<strong>4<\/strong>\s*<span>Three live demos and one live site with niche-specific UI direction and clear enquiry flows\.<\/span>/);
  assert.doesNotMatch(html, /Live portfolio demos with/);
});
test('both enquiry forms identify only matching personal-data autocomplete purposes', () => {
  for (const [file, fields] of [
    ['index.shtml', { quoteName: 'name', quoteEmail: 'email', quotePhone: 'tel' }],
    ['contact.shtml', { name: 'name', email: 'email', phone: 'tel' }],
  ]) {
    const html = read(file);
    for (const [id, token] of Object.entries(fields)) {
      const control = [...html.matchAll(/<input\b[^>]*>/g)].map(m => m[0]).find(tag => tag.includes(`id="${id}"`));
      assert.ok(control, `${file}: ${id}`);
      assert.ok(control.includes(`autocomplete="${token}"`), `${id}: ${token}`);
    }
    for (const [, attributes] of html.matchAll(/<textarea\b([^>]*)>/g)) assert.doesNotMatch(attributes, /\bautocomplete=/);
    assert.equal([...html.matchAll(/\bautocomplete=/g)].length, 3, `${file}: no guessed field purposes`);
  }
  const location = read('contact.shtml').match(/<input\b[^>]*id="address"[^>]*>/)?.[0];
  assert.ok(location);
  assert.doesNotMatch(location, /\bautocomplete=/, 'free-form location is not a name, email, phone or URL');
});
test('mobile quote controls use a scoped 16px rule and no smaller override', () => {
  const css = read('css/responsive.css');
  assert.match(css, /@media \(max-width: 776px\) \{\s*\.quote-form input, \.quote-form textarea \{font-size: 16px; \}/);
  const sizes = [...css.matchAll(/\.quote-form input, \.quote-form textarea\s*\{[^}]*font-size:\s*(\d+)px/g)].map(m => Number(m[1]));
  assert.ok(sizes.length > 0);
  assert.ok(sizes.every(size => size >= 16));
});
test('XML sitemap retains exactly one loc-only canonical website-development entry', () => {
  const entries = [...read('sitemap.xml').matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/g)].map(m => m[1]);
  const matches = entries.filter(entry => entry.includes(`<loc>${serviceUrl}</loc>`));
  assert.equal(matches.length, 1);
  assert.equal(matches[0].trim(), `<loc>${serviceUrl}</loc>`);
  const locations = entries.map(entry => entry.match(/<loc>([^<]+)<\/loc>/)?.[1]);
  assert.equal(new Set(locations).size, locations.length, 'no duplicate sitemap URLs');
});
