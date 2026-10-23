/* ---------- Sync (end-to-end encrypted, server only sees ciphertext) ---------- */
const WORDS='able acid aged also area army away baby back bake ball band bank barn base bath bean bear beat bell belt best bike bird blue boat body bold bone book boot born boss bowl brave bread brick bring brown buddy build bulb burn busy cabin cake calm camp card care cargo carry cart case cash cave chair chalk charm cheek chef chess chief chip city clay clean clock cloud coast coat code coin cold cook coral corn couch crab crane crisp crown cube curve dance dark dawn deck deer desk dial diet dish dock dog door dove draft dream dress drift drum duck dune dust eagle early earth echo edge eight elbow elder ember empty energy enjoy entry equal event exit extra fable face fair farm fast feast fence fern field film final fire fish five flag flame flute foam focus fog foil folk forest fork fox frame fresh frog fruit fuel game garden gate gear gentle giant gift ginger glad glass globe glow goat gold grape grass gravel green grid group grow guide gulf habit hammer harbor harvest hawk heart heavy hedge hero hill honey hope horse hotel house humble ice idea image inch index ink iron island ivory jacket jaguar jazz jelly jewel join joke judge juice jump jungle kayak kettle key kind king kite kiwi knee knot label lake lamp large laser lava lawn layer leaf lemon level light lily lime linen lion list lobby local lodge logic lotus lucky lunar magic mango maple marble market meadow melon metal mint mirror model moon moss motor mount music'.split(' ').slice(0,256);
const syncOn=()=>!!(S&&S.sync&&S.sync.url&&S.sync.id);
function newPhrase(){const r=rnd(8);return Array.from(r,b=>WORDS[b%WORDS.length]).join(' ');}
async function hexOf(s){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))),b=>b.toString(16).padStart(2,'0')).join('');}
async function syncCreds(phrase){phrase=phrase.trim().toLowerCase().replace(/\s+/g,' ');const id=(await hexOf('life-id:'+phrase)).slice(0,32),tok=await hexOf('life-tok:'+phrase),ik=(await hexOf('life-in:'+phrase)).slice(0,24);
const base=await crypto.subtle.importKey('raw',enc.encode(phrase),'PBKDF2',false,['deriveKey']);const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:enc.encode('life-sync-v1'),iterations:ITER,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);return{phrase,id,tok,ik,key};}
const cleanUrl=u=>(u||'').trim().replace(/\/+$/,'').replace(/^(?!https?:\/\/)/,'https://');
async function api(method,path,body,c){c=c||U.sc;const url=(c.url||S.sync.url)+path;const r=await fetch(url,{method,headers:{'Content-Type':'application/json','X-Token':c.tok,'X-Id':c.id},body:body?JSON.stringify(body):undefined});let j=null;try{j=await r.json();}catch(e){}return{status:r.status,ok:r.ok,body:j};}
async function sEnc(obj,key){const iv=rnd(12);const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key||U.sc.key,enc.encode(JSON.stringify(obj)));return b64(iv)+'.'+b64(ct);}
async function sDec(blob,key){const [iv,ct]=blob.split('.');return JSON.parse(dec.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(iv)},key||U.sc.key,unb64(ct))));}
const payload=()=>{const o=Object.assign({},S);delete o.sync;return o;};
async function ensureSC(){if(U.sc||!syncOn())return U.sc;const c=await syncCreds(S.sync.phrase);c.url=S.sync.url;U.sc=c;return c;}
function byId(a,b,k,pick){const m=new Map();(b||[]).forEach(x=>m.set(x[k],x));(a||[]).forEach(x=>{const y=m.get(x[k]);m.set(x[k],y?pick(x,y):x);});return[...m.values()];}
const nSets=s=>s.items.reduce((n,i)=>n+i.logged.length,0);
function mergeDay(a,b){if(!a)return b;if(!b)return a;const w=[a.wake,b.wake].filter(Boolean).sort((x,y)=>x.at-y.at)[0];const nd=[a.nightDone,b.nightDone].filter(Boolean);
return Object.assign({},b,a,{m:Object.assign({},b.m,a.m),n:Object.assign({},b.n,a.n),why:Object.assign({},b.why,a.why),supp:Object.assign({},b.supp,a.supp),water:Math.max(a.water||0,b.water||0),wgoal:Math.max(a.wgoal||0,b.wgoal||0),pages:Math.max(a.pages||0,b.pages||0),wake:w,light:a.light||b.light,nightDone:nd.length?Math.min(...nd):undefined});}
function mergeState(L,R){const newer=(R.updated||0)>(L.updated||0);const out=Object.assign({},newer?R:L);out.sync=L.sync;
out.sessions=byId(L.sessions,R.sessions,'id',(a,b)=>(a.end&&!b.end)?a:(b.end&&!a.end)?b:nSets(a)>=nSets(b)?a:b).sort((a,b)=>a.start-b.start);
const act=[L.active,R.active].filter(x=>x&&!out.sessions.some(s=>s.id===x.id));out.active=act.length?act.sort((a,b)=>nSets(b)-nSets(a))[0]:null;
out.weighIns=byId(L.weighIns,R.weighIns,'date',a=>a).sort((a,b)=>a.date<b.date?-1:1);
out.steps=Object.assign({},R.steps);Object.entries(L.steps||{}).forEach(([k,v])=>{out.steps[k]=Math.max(v,out.steps[k]||0);});
out.days={};new Set([...Object.keys(L.days||{}),...Object.keys(R.days||{})]).forEach(k=>{out.days[k]=mergeDay((L.days||{})[k],(R.days||{})[k]);});
out.rt=Object.assign({},out.rt);out.rt.books=byId(L.rt&&L.rt.books,R.rt&&R.rt.books,'id',(a,b)=>a.page>=b.page?a:b);
if(L.school||R.school){out.school=Object.assign({},out.school);out.school.items=byId(L.school&&L.school.items,R.school&&R.school.items,'id',(a,b)=>{const m=Object.assign({},newer?b:a);m.done=a.done||b.done;m.studied=byId(a.studied,b.studied,'d',(x,y)=>x.min>=y.min?x:y);if(a.steps&&b.steps&&a.steps.length===b.steps.length)m.steps=a.steps.map((s,i)=>Object.assign({},s,{done:s.done||b.steps[i].done}));return m;});}
out.updated=Math.max(L.updated||0,R.updated||0);return out;}
let pushT=null;
function schedPush(){if(!syncOn())return;clearTimeout(pushT);pushT=setTimeout(()=>syncPush(),12000);}
async function syncPush(){if(!syncOn()||U.syncing||!navigator.onLine)return;U.syncing=true;clearTimeout(pushT);
try{const c=await ensureSC();let r=await api('PUT','/s/'+c.id,{base:S.sync.ver||0,blob:await sEnc(payload()),ik:await hexB64(c.ik)});
if(r.status===409){await applyRemote(r.body);r=await api('PUT','/s/'+c.id,{base:S.sync.ver,blob:await sEnc(payload()),ik:await hexB64(c.ik)});}
if(r.ok){S.sync.ver=r.body.ver;S.sync.pushed=S.updated;S.sync.last=Date.now();S.sync.err=null;await saveNow();}else{S.sync.err=r.status===403?'This phrase belongs to a different account':'Server said '+r.status;}}
catch(e){S.sync.err='Offline or server unreachable';}finally{U.syncing=false;}}
async function hexB64(s){return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
async function applyRemote(body){if(!body||!body.blob)return false;const R=await sDec(body.blob);const sync=S.sync;S=migrate(mergeState(S,R));S.sync=sync;S.sync.ver=body.ver;await saveNow();return true;}
async function syncPull(quiet){if(!syncOn()||!navigator.onLine)return;try{const c=await ensureSC();const r=await api('GET','/s/'+c.id);
if(r.ok&&r.body.ver>(S.sync.ver||0)){await applyRemote(r.body);if(!quiet){U.keepScroll=true;if(!U.sheet)render();}}
const ib=await api('GET','/in/'+c.id);if(ib.ok&&ib.body.items.length){let n=0;ib.body.items.forEach(x=>{if(x.t==='steps'){const d=/^\d{4}-\d{2}-\d{2}$/.test(x.d)?x.d:iso(new Date(x.at));S.steps[d]=Math.max(S.steps[d]||0,Math.round(x.v));n++;}});if(n){save();toast('Steps updated from Apple Health');if(!U.sheet){U.keepScroll=true;render();}}}
S.sync.last=Date.now();S.sync.err=null;if((S.updated||0)>(S.sync.pushed||0))syncPush();await pushSchedule();}
catch(e){S.sync.err='Offline or server unreachable';}}
async function syncConnect(url,phrase,join){const c=await syncCreds(phrase);c.url=cleanUrl(url);const r=await api('GET','/s/'+c.id,null,c);
if(r.status===403)throw new Error('That phrase is taken on this server.');
if(join){if(r.status===404||!r.body||!r.body.blob)throw new Error('No data found for that phrase on this server.');const R=await sDec(r.body.blob,c.key);return{c,R,ver:r.body.ver};}
if(r.ok&&r.body.blob)throw new Error('That phrase already has data. Use Join instead.');return{c};}
