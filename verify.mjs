import fs from 'node:fs';
const g=JSON.parse(fs.readFileSync('dist/gallery.json','utf8'));
if(g.length!==80)throw Error('Expected 80 images');
for(const x of g)if(!fs.existsSync('dist/'+x.src))throw Error(x.src);
const html=fs.readFileSync('dist/index.html','utf8');
for(const x of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g))if(!fs.existsSync('dist/'+x[1]))throw Error(x[1]);
console.log(g.reduce((a,x)=>(a[x.category]=(a[x.category]||0)+1,a),{}));
console.log('80 assets and HTML references valid');
fs.writeFileSync('image-plan.json',JSON.stringify(g,null,2));
