const fs=require('fs'),path=require('path');
const F=JSON.parse(Buffer.from(process.argv[2],'base64').toString());
for(const [p,c] of Object.entries(F.write||{})){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c);}
for(const [p,a,b] of (F.replace||[])){const s=fs.readFileSync(p,'utf8');if(!s.includes(a))throw new Error('missing in '+p+': '+a);fs.writeFileSync(p,s.replace(a,b));}
for(const p of (F.remove||[]))fs.rmSync(p);
console.log('WRITE-OK',Object.keys(F.write||{}).length,(F.replace||[]).length,(F.remove||[]).length);
