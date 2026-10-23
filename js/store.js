/* ---------- Encrypted store ---------- */
let S=null,KEY=null;
const enc=new TextEncoder(),dec=new TextDecoder();
const b64=buf=>btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const ITER=210000;
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){toast('Could not save on this device');return false;}}
async function deriveKey(pass,salt,iter){const base=await crypto.subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
/* Vault v2: random data key, wrapped by the passcode key and optionally by a Face ID (passkey PRF) key */
const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
async function kekFromPass(pass,salt,iter){const base=await crypto.subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function kekFromPrf(first){const k=await crypto.subtle.importKey('raw',first,'HKDF',false,['deriveKey']);return crypto.subtle.deriveKey({name:'HKDF',hash:'SHA-256',salt:enc.encode('life-face-v1'),info:enc.encode('kek')},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function wrapDEK(kek,dek){const raw=await crypto.subtle.exportKey('raw',dek);const iv=rnd(12);return{iv:b64(iv),ct:b64(await crypto.subtle.encrypt({name:'AES-GCM',iv},kek,raw))};}
async function unwrapDEK(kek,w){const raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(w.iv)},kek,unb64(w.ct));return crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},true,['encrypt','decrypt']);}
const newDEK=()=>crypto.subtle.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);
async function writeVault(){const iv=rnd(12);S.updated=S.updated||Date.now();const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},KEY,enc.encode(JSON.stringify(S)));lsSet(VK,JSON.stringify({v:2,salt:U.vm.salt,iter:U.vm.iter,wp:U.vm.wp,wf:U.vm.wf||null,iv:b64(iv),ct:b64(ct)}));}
async function createVault(pass,keepFace){const salt=rnd(16);const kek=await kekFromPass(pass,salt,ITER);if(!KEY)KEY=await newDEK();U.vm={salt:b64(salt),iter:ITER,wp:await wrapDEK(kek,KEY),wf:keepFace&&U.vm?U.vm.wf:null};await writeVault();}
async function loadState(v){const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(v.iv)},KEY,unb64(v.ct));S=migrate(JSON.parse(dec.decode(pt)));}
async function openVault(pass){const v=JSON.parse(lsGet(VK));const salt=unb64(v.salt);const kek=await kekFromPass(pass,salt,v.iter);
if(!v.v||v.v===1){const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(v.iv)},kek,unb64(v.ct));S=migrate(JSON.parse(dec.decode(pt)));KEY=await newDEK();U.vm={salt:v.salt,iter:v.iter,wp:await wrapDEK(kek,KEY),wf:null};await writeVault();return;}
KEY=await unwrapDEK(kek,v.wp);U.vm={salt:v.salt,iter:v.iter,wp:v.wp,wf:v.wf||null};await loadState(v);}
const vaultHasFace=()=>{try{const v=JSON.parse(lsGet(VK));return!!(v&&v.wf);}catch(e){return false;}};
async function prfGet(cid,ps){const a=await navigator.credentials.get({publicKey:{challenge:rnd(32),rpId:location.hostname,allowCredentials:[{type:'public-key',id:cid}],userVerification:'required',timeout:60000,extensions:{prf:{eval:{first:ps}}}}});const r=a.getClientExtensionResults();return r&&r.prf&&r.prf.results&&r.prf.results.first||null;}
async function openVaultFace(){const v=JSON.parse(lsGet(VK));if(!v.wf)throw new Error('no face');const first=await prfGet(unb64(v.wf.cid),unb64(v.wf.ps));if(!first)throw new Error('prf');KEY=await unwrapDEK(await kekFromPrf(first),v.wf);U.vm={salt:v.salt,iter:v.iter,wp:v.wp,wf:v.wf};await loadState(v);}
async function faceEnable(){if(!window.PublicKeyCredential)throw new Error('This device does not support passkeys in web apps.');const ps=rnd(32);
const cred=await navigator.credentials.create({publicKey:{rp:{name:'Life',id:location.hostname},user:{id:rnd(16),name:'Life',displayName:'Life'},challenge:rnd(32),pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{authenticatorAttachment:'platform',residentKey:'preferred',userVerification:'required'},timeout:60000,extensions:{prf:{eval:{first:ps}}}}});
const ext=cred.getClientExtensionResults().prf;let first=ext&&ext.results&&ext.results.first;
if(!first){if(ext&&ext.enabled===false)throw new Error('This iPhone cannot use Face ID to unlock web apps yet. Update iOS, then try again.');first=await prfGet(cred.rawId,ps);}
if(!first)throw new Error('Face ID could not create an unlock key on this device.');
U.vm.wf=Object.assign({cid:b64(cred.rawId),ps:b64(ps)},await wrapDEK(await kekFromPrf(first),KEY));await saveNow();}
async function faceDisable(){U.vm.wf=null;await saveNow();}
let saveT=null;
async function saveNow(){clearTimeout(saveT);saveT=null;if(!KEY||!S||!U.vm)return;try{await writeVault();}catch(e){}}
function save(){if(S)S.updated=Date.now();clearTimeout(saveT);saveT=setTimeout(saveNow,350);if(typeof schedPush==='function')schedPush();}
function freshState(o){return notifFix(schoolFix(gymFix(rtFix({v:1,profile:{height:o.h,start:iso(),stepBase:o.steps},weighIns:[{date:iso(),kg:o.kg,waist:o.waist||null}],sessions:[],active:null,steps:{},carry:{},bonus:{},good:{},days:{},rt:{}}))));}
function migrate(s){s.carry=s.carry||{};s.bonus=s.bonus||{};s.good=s.good||{};s.steps=s.steps||{};s.weighIns=s.weighIns||[];s.sessions=s.sessions||[];return notifFix(schoolFix(gymFix(rtFix(s))));}
function rtFix(s){const r=s.rt=s.rt||{};const w=r.wake=r.wake||{};if(w.from==null)w.from=540;if(w.target==null)w.target=340;if(w.start===undefined)w.start=null;w.pauses=w.pauses||[];r.bottleMl=r.bottleMl||750;r.books=r.books||[];r.supps=r.supps||[{id:'mag',name:'Magnesium',dose:'',when:'night',stock:null}];r.ord=r.ord||{};r.dismissed=r.dismissed||{};r.nightEarly=r.nightEarly||0;if(r.socialStart==null)r.socialStart=0;if(r.socialEnd==null)r.socialEnd=480;if(r.barcode===undefined)r.barcode=null;s.days=s.days||{};return s;}
