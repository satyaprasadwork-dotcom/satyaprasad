import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pages=['index.html','about.html','projects.html','insights.html','insights/from-requests-to-releases.html','insights/evaluating-ai-features.html','privacy.html','terms.html'];
let count=0;
function exists(p){return fs.existsSync(path.join(root,p));}
for (const file of pages) {
  assert(exists(file),'Missing expected page: '+file);
  const html=fs.readFileSync(path.join(root,file),'utf8');
  const head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  assert(head,'Missing head in '+file);
  assert(/<title>[\s\S]+?<\/title>/.test(head[1]),'Missing title inside head: '+file);
  assert(/<meta name="description" content="[^"]+"/i.test(head[1]),'Missing meta description: '+file);
  assert(/<link rel="canonical" href="https:\/\/satyaprasad\.com\//.test(head[1]),'Missing canonical: '+file);
  assert(/<html lang="en"/.test(html),'Missing language: '+file);
  const links=[...html.matchAll(/\b(?:href|src)="([^"]+)"/gi)];
  for (const match of links) {
    const raw=match[1];
    if(raw.startsWith('#')){if(raw.length>1)assert(html.includes('id="'+raw.slice(1)+'"'),'Broken anchor '+raw+' in '+file);continue;}
    if(/^(https?:|mailto:|tel:|data:|javascript:)/i.test(raw))continue;
    const url=raw.split('#')[0].split('?')[0];
    if(!url)continue;
    const resolved=url.startsWith('/')?url.slice(1):path.posix.join(path.posix.dirname(file),url);
    assert(!resolved.includes('..'),'Unsafe relative link: '+raw);
    const candidate=resolved.endsWith('/')?resolved+'index.html':resolved;
    assert(exists(candidate),'Broken internal '+raw+' in '+file+' (looked for '+candidate+')');
    count++;
  }
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const file of pages){
 const rel=file==='index.html'?'':file;
 assert(sitemap.includes('<loc>https://satyaprasad.com/'+rel+'</loc>'),'Page not in sitemap: '+file);
}
const ads=fs.readFileSync(path.join(root,'ads.txt'),'utf8');
assert(ads.includes('google.com, pub-7937216909291905, DIRECT, f08c47fec0942fa0'),'Missing AdSense seller declaration');
console.log('Verified '+pages.length+' pages, '+count+' internal paths, sitemap and ads.txt.');
