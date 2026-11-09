import {readdir,readFile,writeFile,access} from 'node:fs/promises';
const assets=[];
for(const file of (await readdir('asset-meta')).filter(x=>x.endsWith('.json'))){
 const item=JSON.parse(await readFile('asset-meta/'+file,'utf8'));
 const id=String(item.id).padStart(2,'0');
 let src='assets/4k/venue-'+id+'.webp';
 try{await access('dist/'+src)}catch{src='assets/venue-'+id+'.jpg'}
 try{await access('dist/'+src)}catch{src='assets/venue-'+id+'.png'}
 try{await access('dist/'+src);assets.push({id,title:item.title,category:item.category,src,recreation:true})}catch{}
}
assets.sort((a,b)=>a.id.localeCompare(b.id));
await writeFile('dist/gallery.json',JSON.stringify(assets,null,2));
console.log(assets.length+' verified gallery images');
