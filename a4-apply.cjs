const fs=require('fs');const F=JSON.parse(Buffer.from(process.argv[2],'base64').toString());
fs.mkdirSync('src/domain',{recursive:true});
for(const [p,c] of Object.entries(F.write)) fs.writeFileSync(p,c);
let a=fs.readFileSync('src/App.tsx','utf8');
a=a.replace("import { minutesToHHMM } from '@/utils';","import { DAY_MINUTES, minutesToHHMM } from '@/domain/time';");
a=a.replace("max={1440}","max={DAY_MINUTES}").replace("All values are minutes since midnight (0–1440).","All values are minutes since midnight (0–{DAY_MINUTES}).").replace('placeholder="0–1440"','placeholder={`0–${DAY_MINUTES}`}');
fs.writeFileSync('src/App.tsx',a);
for(const p of F.remove) fs.rmSync(p);
console.log('APPLIED', a.includes('@/domain/time'), a.includes('1440'));
