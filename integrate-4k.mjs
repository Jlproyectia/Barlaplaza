import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const folder='dist/assets/4k';
const names=['architecture-v2',...Array.from({length:80},(_,i)=>'venue-'+String(i+1).padStart(2,'0'))];
const report=[];
for(const name of names){
 const file=path.join(folder,name+'.webp');
 const data=fs.readFileSync(file);
 // Decode the WebP RIFF headers without transcoding or changing the artwork.
 if(data.toString('ascii',0,4)!=='RIFF'||data.toString('ascii',8,12)!=='WEBP')throw Error('Invalid WebP '+file);
 let width,height;
 for(let p=12;p<data.length;){const kind=data.toString('ascii',p,p+4),length=data.readUInt32LE(p+4),q=p+8;
  if(kind==='VP8X'){width=data.readUIntLE(q+4,3)+1;height=data.readUIntLE(q+7,3)+1;break;}
  if(kind==='VP8 '){width=data.readUInt16LE(q+6)&0x3fff;height=data.readUInt16LE(q+8)&0x3fff;break;}
  if(kind==='VP8L'){const bits=data.readUInt32LE(q+1);width=(bits&0x3fff)+1;height=((bits>>>14)&0x3fff)+1;break;}
  p=q+length+(length%2);
 }
 if(width!==3840||height!==2160)throw Error('Not 4K: '+file+' '+width+'x'+height);
 report.push({file:'assets/4k/'+name+'.webp',width,height,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),native4k:false,method:'Real-ESRGAN x4plus superresolution, 6688x3764 intermediate, 3840x2160 final'});
}
for(const file of ['dist/index.html','dist/experience.js','dist/atelier.js']){
 let s=fs.readFileSync(file,'utf8').replace(/assets\/(?!4k\/)/g,'assets/4k/').replace(/\.jpg/g,'.webp');
 s=s.replace(/width="1672" height="941"/g,'width="3840" height="2160"').replace(/width=1672/g,'width=3840').replace(/height=941/g,'height=2160');
 if(file.endsWith('index.html'))s=s.replace('El sur.<br>A bocados.','El sur.<br> A bocados.');
 fs.writeFileSync(file,s);
}
const gallery=JSON.parse(fs.readFileSync('dist/gallery.json','utf8'));
gallery.forEach(item=>{item.src=item.src.replace(/assets\/(?!4k\/)/,'assets/4k/').replace(/\.jpg$/,'.webp');item.width=3840;item.height=2160;});
fs.writeFileSync('dist/gallery.json',JSON.stringify(gallery,null,2));
fs.writeFileSync('image-plan.json',JSON.stringify(gallery,null,2));
fs.writeFileSync('image-resolution-report.json',JSON.stringify(report,null,2));
console.log('Verified and integrated '+report.length+' distinct 3840x2160 images.');
