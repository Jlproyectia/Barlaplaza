import {readFile} from 'node:fs/promises';
process.stdin.setRawMode?.(true);process.stdin.resume();
process.stdout.write('Ready for upload manifest on hidden stdin.\n');
const input=await new Promise((resolve,reject)=>{let value='';process.stdin.on('data',chunk=>{const s=chunk.toString();if(s.includes('\u0003'))process.exit(130);value+=s;if(/[\r\n]/.test(value)){process.stdin.setRawMode?.(false);process.stdin.pause();try{resolve(JSON.parse(value.trim()));}catch(e){reject(e);}}});});
const results=[];let next=0;
await Promise.all(Array.from({length:Math.min(4,input.length)},async()=>{while(next<input.length){const item=input[next++];try{const bytes=await readFile(item.file);const response=await fetch(item.upload_url,{method:'PUT',headers:{'Content-Type':'image/jpeg'},body:bytes,signal:AbortSignal.timeout(90000)});results.push({media_id:item.media_id,index:item.index,status:response.status,ok:response.status===200});}catch(e){results.push({media_id:item.media_id,index:item.index,ok:false,error:e.message});}}}));
console.log(JSON.stringify(results.sort((a,b)=>a.index-b.index)));
process.exit(results.every(r=>r.ok)?0:1);
