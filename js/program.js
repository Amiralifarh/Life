/* ---------- Program (v2: editable plan) ---------- */
EQ.z={min:20,max:300,step:5,label:'EZ bar, total'};
Object.assign(EX,{
pec_deck:E('Pec deck fly','m',0,['chest_mid'],['chest_up','delt_front'],['cable_cross'],70),
cable_cross:E('Cable crossover','c',0,['chest_mid'],['chest_up','delt_front'],['pec_deck'],20),
pushup:E('Push-ups','w',0,['chest_mid'],['tri_lat','tri_long','delt_front'],['dips'],0),
bb_row:E('Barbell row','b',1,['lats','trap_mid','teres'],['bi_long','bi_short','brachialis','delt_rear','erector','forearm'],['tbar_row','db_row'],95),
tbar_row:E('T-bar row','m',1,['trap_mid','lats','teres'],['delt_rear','bi_long','bi_short','brachialis','erector'],['bb_row','machine_row'],70),
pullup:E('Pull-ups','w',1,['lats','teres'],['bi_long','bi_short','brachialis','trap_low'],['pullup_assist','pulldown_wide'],0),
straight_pd:E('Straight-arm pulldown','c',0,['lats'],['teres','tri_long'],['pulldown_close'],40),
shrug:E('DB shrug','d',0,['trap_up'],['forearm'],['upright_row'],50),
face_pull:E('Face pull','c',0,['delt_rear'],['trap_mid','teres'],['rear_fly','reverse_pec_deck'],30),
deadlift:E('Deadlift','b',1,['erector','glute_max','ham_bf','ham_semi'],['trap_up','trap_mid','lats','forearm','quad_rf','adductor'],['rdl'],185,1),
front_raise:E('Front raise','d',0,['delt_front'],['delt_side','chest_up'],['lat_raise'],15),
upright_row:E('Upright row, cable','c',0,['delt_side'],['trap_up','delt_front'],['lat_raise'],40),
rear_db_fly:E('Rear delt DB fly','d',0,['delt_rear'],['trap_mid','teres'],['rear_fly','face_pull'],15),
close_grip:E('Close-grip bench press','b',1,['tri_lat','tri_long'],['chest_mid','delt_front'],['dips','skull'],95),
skull:E('Skull crusher, EZ bar','z',0,['tri_long','tri_lat'],[],['oh_rope','close_grip'],40),
hammer:E('Hammer curl','d',0,['brachialis','bi_long'],['forearm'],['db_curl'],25),
preacher:E('Preacher curl, EZ bar','z',0,['bi_short'],['brachialis'],['db_curl','cable_curl'],40),
hang_leg:E('Hanging leg raise','w',0,['abs'],['obliques'],['leg_raise','bench_leg_raise'],0),
hip_thrust:E('Barbell hip thrust','b',1,['glute_max'],['ham_bf','ham_semi','glute_med'],['rdl'],95,1)
});
EX.lunges.pl=1;EX.split_squat.pl=1;
Object.assign(EX,{decline_bb:E('Decline barbell press','b',1,['chest_low'],['chest_mid','tri_lat','tri_med','delt_front'],['decline_db','dips'],115),decline_db:E('Decline DB press','d',1,['chest_low'],['chest_mid','tri_lat','tri_med'],['decline_bb','dips'],40),low_fly:E('Low-to-high cable fly','c',0,['chest_up'],['delt_front','chest_mid'],['incline_fly'],15),incline_fly:E('Incline DB fly','d',0,['chest_up'],['chest_mid','delt_front'],['low_fly'],20),crunch:E('Crunch','w',0,['abs'],['obliques'],['cable_crunch'],0),reverse_crunch:E('Reverse crunch','w',0,['abs_low'],['abs','obliques'],['leg_raise'],0)});
['bb_bench','db_flat','machine_chest','pushup','pec_deck'].forEach(k=>{if(!EX[k].s.includes('chest_low'))EX[k].s.push('chest_low');});
EX.dips.p=['chest_low','tri_lat','tri_long','tri_med'];EX.dips.s=['delt_front','chest_mid'];EX.dip_machine.p=['chest_low','tri_lat','tri_long','tri_med'];EX.dip_machine.s=['delt_front','chest_mid'];
Object.assign(EX.cable_cross,{name:'Cable crossover, high to low',p:['chest_low'],s:['chest_mid','delt_front']});
['rope_pushdown','bar_pushdown'].forEach(k=>{EX[k].p=['tri_lat','tri_med'];EX[k].s=['tri_long'];});EX.close_grip.p=['tri_lat','tri_med','tri_long'];EX.skull.p=['tri_long','tri_med'];EX.skull.s=['tri_lat'];
['oh_rope','db_oh_ext'].forEach(k=>{EX[k].s=['tri_lat','tri_med'];});['bb_bench','db_flat','incline_bb','incline_db','ohp','seated_db_press','machine_chest','pushup','decline_bb'].forEach(k=>{if(EX[k]&&!EX[k].s.includes('tri_med'))EX[k].s.push('tri_med');});
['leg_raise','hang_leg','bench_leg_raise'].forEach(k=>{EX[k].p=['abs_low'];EX[k].s=['abs','obliques'];});['weighted_situp','cable_crunch'].forEach(k=>{EX[k].s=['abs_low','obliques'];});
EX.bb_bench.alts.push('decline_bb');EX.incline_db.alts.push('low_fly');EX.cable_cross.alts.push('decline_db');
['bb_bench','db_flat'].forEach(k=>EX[k].alts.push('pec_deck'));EX.bb_curl.alts.push('preacher','hammer');EX.rope_pushdown.alts.push('skull');EX.rear_fly.alts.push('face_pull','rear_db_fly');EX.cable_row.alts.push('tbar_row','bb_row');EX.leg_raise.alts.push('hang_leg');
const VG=[{n:'Chest',m:['chest_up','chest_mid','chest_low'],lo:10,hi:20,add:'cable_cross'},{n:'Back',m:['lats','trap_mid','teres','trap_low'],lo:10,hi:20,add:'cable_row'},{n:'Side delts',m:['delt_side'],lo:8,hi:20,add:'lat_raise'},{n:'Rear delts',m:['delt_rear'],lo:6,hi:16,add:'face_pull'},{n:'Front delts',m:['delt_front'],lo:4,hi:16,ind:1},{n:'Biceps',m:['bi_long','bi_short','brachialis'],lo:8,hi:16,add:'hammer'},{n:'Triceps',m:['tri_long','tri_lat','tri_med'],lo:8,hi:16,add:'rope_pushdown'},{n:'Quads',m:['quad_rf','quad_lat','quad_med'],lo:10,hi:20,add:'leg_ext'},{n:'Hamstrings',m:['ham_bf','ham_semi'],lo:8,hi:16,add:'seated_curl'},{n:'Glutes',m:['glute_max','glute_med'],lo:6,hi:16,add:'hip_thrust'},{n:'Calves',m:['calf_lat','calf_med','soleus'],lo:8,hi:16,add:'seated_calf'},{n:'Abs',m:['abs','abs_low','obliques'],lo:6,hi:16,add:'cable_crunch'},{n:'Lower back',m:['erector'],lo:4,hi:12,add:'back_ext'}];
const P=(ex,sets,lo,hi,o={})=>({ex,type:o.pyr?'pyr':'straight',sets,lo,hi,r0:o.pyr?o.pyr[0]:lo,r1:o.pyr?o.pyr[1]:hi,link:!!o.link,fin:!!o.fin,rest:o.rest||null});
function defaultPlan(){return{v:2,days:[
{id:'CH',name:'Chest',focus:'Chest and abs',items:[P('back_ext',2,12,15),P('bb_bench',4,6,12,{pyr:[12,6]}),P('incline_db',3,8,12),P('pec_deck',3,12,15,{link:1}),P('pushup',3,10,20),P('hang_leg',3,12,15,{link:1}),P('cable_crunch',3,12,15),P('machine_chest',3,15,20,{fin:1}),P('cable_cross',3,12,15,{fin:1})]},
{id:'BK',name:'Back and biceps',focus:'Back, biceps and abs',items:[P('back_ext',2,12,15),P('pulldown_wide',4,6,12,{pyr:[12,6]}),P('bb_row',3,8,10),P('cable_row',3,10,12),P('straight_pd',3,12,15,{link:1}),P('shrug',3,12,15),P('bb_curl',3,8,12,{link:1}),P('hammer',3,10,12),P('leg_raise',3,12,15,{link:1}),P('seated_calf',3,12,15),P('deadlift',3,5,6,{fin:1}),P('preacher',3,10,12,{fin:1})]},
{id:'SH',name:'Shoulders and triceps',focus:'Shoulders, triceps and abs',items:[P('back_ext',2,12,15),P('ohp',4,6,12,{pyr:[12,6]}),P('seated_db_press',3,8,12),P('lat_raise',4,12,15,{link:1}),P('rear_fly',4,12,15),P('close_grip',3,8,10,{link:1}),P('rope_pushdown',3,12,15),P('weighted_situp',3,10,15),P('ohp',10,10,10,{fin:1,rest:60})]},
{id:'LG',name:'Legs',focus:'Legs and abs',items:[P('back_ext',2,12,15),P('squat',4,6,12,{pyr:[12,6]}),P('leg_press',3,10,12),P('leg_ext',3,12,15,{link:1}),P('lying_curl',3,10,12),P('rdl',3,8,10),P('standing_calf',4,12,15),P('hang_leg',3,12,15),P('lunges',2,10,10,{fin:1}),P('seated_calf',3,15,20,{fin:1})]}]};}
function planDay(id){return(S&&S.plan&&S.plan.days.find(d=>d.id===id))||LEGACY[id]||{name:'Workout',focus:'',items:[]};}
const PLAN=new Proxy({},{get:(_,k)=>planDay(k)});
function gymFix(s){if(!s.plan||!s.plan.days||!s.plan.days.length){s.plan=defaultPlan();s.carry={};}s.gym=Object.assign({restC:120,restI:60,comeback:true,longWeekend:true,start:iso()},s.gym||{});s.customEx=s.customEx||{};Object.entries(s.customEx).forEach(([id,c])=>{EX[id]=E(c.name,c.eq,c.cmp,c.p,c.s||[],[],c.start||0);});return s;}
function progWeek(){const s=mondayOf(parseISO(S.profile.start));return Math.max(1,Math.round((mondayOf(new Date())-s)/(7*DAY))+1);}
function gymWeek(){return Math.max(1,Math.round((mondayOf(new Date())-mondayOf(parseISO(S.gym.start)))/(7*DAY))+1);}
function phase(){if(S.gym.comeback&&Date.now()-parseISO(S.gym.start)<7*DAY)return{k:'re',name:'Comeback week',tip:'Full sets this week, but stop 2 to 3 reps before failure. Tendons adapt slower than muscle. Next week you push.'};return{k:'train',name:'Training',tip:'Take most sets to 1 or 2 reps before failure. The last set of an exercise can go all the way.'};}
const plannedSets=it=>it.sets;
const isLong=(d=new Date())=>S.gym.longWeekend&&(d.getDay()===0||d.getDay()===6);
function nextType(){const ids=S.plan.days.map(d=>d.id);const l=S.sessions[S.sessions.length-1];if(!l)return ids[0];const i=ids.indexOf(l.type);return i<0?ids[0]:ids[(i+1)%ids.length];}
function pyrReps(it){const n=it.sets;if(n<=1)return[it.r0];return Array.from({length:n},(_,k)=>Math.round(it.r0+(it.r1-it.r0)*k/(n-1)));}
function itemKeys(day){const seen={};return day.items.map(it=>{const k=it.ex+(it.fin?'#f':'');const c=seen[k]=(seen[k]||0)+1;return c>1?k+'#'+c:k;});}
function ssMap(day){const g={};let cur=null;day.items.forEach((it,i)=>{if(cur!==null)g[i]=cur;if(it.link&&i+1<day.items.length){if(cur===null){cur='g'+i;g[i]=cur;}}else cur=null;});return g;}
const itemRestP=it=>it.rest||(EX[it.ex]&&EX[it.ex].cmp?S.gym.restC:S.gym.restI);
function estMin(type,long){const day=planDay(type);if(!day.items.length||!day.items[0].type)return 60;const g=ssMap(day);let s=300;
day.items.forEach((it,i)=>{if(it.fin&&!long)return;const gi=g[i];const nxt=day.items[i+1];const last=!gi||g[i+1]!==gi||(nxt&&nxt.fin&&!long);
let rest=15;if(last){rest=gi?Math.max(...day.items.filter((x,j)=>g[j]===gi&&(long||!x.fin)).map(itemRestP)):itemRestP(it);}s+=it.sets*(40+rest);});return Math.round(s/60);}
function fmtScheme(it){return it.type==='pyr'?`Pyramid ${pyrReps(it).join('-')}`:`${it.sets} × ${it.lo===it.hi?it.lo:it.lo+'-'+it.hi}${EX[it.ex]&&EX[it.ex].pl?' per leg':''}`;}
function lastItem(key,before=S.sessions.length){for(let i=before-1;i>=0;i--){const it=S.sessions[i].items.find(x=>(x.key||x.ex)===key&&x.logged.length);if(it)return it;}return null;}
function topW(it){return Math.max(...it.logged.map(s=>s.w));}
function allHitTop(it){if(it.reps)return it.logged.length>=it.planned&&it.logged.every((s,k)=>s.r>=it.reps[Math.min(k,it.reps.length-1)]&&(s.e==='good'||s.e==='easy'));const t=topW(it);const ws=it.logged.filter(s=>s.w===t);return it.logged.length>=it.planned&&ws.length>=Math.min(2,it.planned)&&ws.every(s=>s.r>=it.hi&&(s.e==='good'||s.e==='easy'));}
const allEasy=it=>it.logged.length>=it.planned&&it.logged.every(s=>s.e==='easy'&&s.r>=(it.reps?0:it.lo));
function roundW(ex,v){const vals=wRange(ex);return vals.reduce((a,b)=>Math.abs(b-v)<Math.abs(a-v)?b:a);}
function startW(it){if((it.key||'').includes('#f')){const l=lastItem(it.ex);if(l)return roundW(it.ex,topW(l)*0.6);}return EX[it.ex].start;}
function suggestSet(it,k){const l=lastItem(it.key);
if(it.reps){const n=it.reps.length,f=j=>0.8+0.2*(n>1?j/(n-1):1);if(!l)return roundW(it.ex,startW(it)*f(k));const s=l.logged[Math.min(k,l.logged.length-1)];const t=it.reps[Math.min(k,n-1)];return(s.r>=t&&(s.e==='good'||s.e==='easy'))?s.w+incOf(it.ex):s.w;}
if(!l)return startW(it);const t=topW(l);return(allHitTop(l)||allEasy(l))?t+incOf(it.ex):t;}
const suggestW=key=>{const l=lastItem(key);const ex=key.split('#')[0];if(!l)return EX[ex]?EX[ex].start:0;const t=topW(l);return(allHitTop(l)||allEasy(l))?t+incOf(ex):t;};
function suggestR(key,lo,hi,idx,w){const l=lastItem(key);if(!l)return lo;if(w>topW(l))return lo;const s=l.logged[idx]||l.logged[l.logged.length-1];return clamp(s.r+((s.e==='good'||s.e==='easy')&&s.r<hi?1:0),lo,hi);}
function lastLine(it){const l=lastItem(it.key);if(!l)return(it.key||'').includes('#f')?'Finisher: lighter weight, keep the rests short':'First time: pick a starting weight';if(it.reps||l.reps)return'Last time: '+l.logged.map(s=>`${s.w}×${s.r}`).join(', ');const t=topW(l);return`Last time: ${t} lbs, ${l.logged.filter(s=>s.w===t).map(s=>s.r).join(', ')} reps`;}
function buildSession(type,long){const day=planDay(type);const keys=itemKeys(day),grp=ssMap(day);const carry=S.carry[type]||[];
const list=day.items.map((it,i)=>({it,key:keys[i],g:grp[i]||('i'+i)})).filter(x=>long||!x.it.fin);
const cnt={};list.forEach(x=>{cnt[x.g]=(cnt[x.g]||0)+1;});const order=[];list.forEach(x=>{if(!order.includes(x.g))order.push(x.g);});
const cg=g=>list.some(x=>x.g===g&&carry.includes(x.key));order.sort((a,b)=>(cg(b)?1:0)-(cg(a)?1:0));S.carry[type]=[];
const items=order.flatMap(g=>list.filter(x=>x.g===g)).map(({it,key,g})=>{const reps=it.type==='pyr'?pyrReps(it):null;return{key,okey:key,ex:it.ex,orig:it.ex,planned:reps?reps.length:it.sets,lo:reps?Math.min(...reps):it.lo,hi:reps?Math.max(...reps):it.hi,reps,ss:cnt[g]>1&&g[0]==='g'?g:null,perLeg:!!EX[it.ex].pl,rest:it.rest||null,fin:!!it.fin,logged:[],skipped:false,carried:carry.includes(key)};});
return{id:'s'+Date.now(),type,long:!!long,start:Date.now(),week:gymWeek(),phase:phase().k,restUntil:0,restFor:0,items};}
const tgtOf=(it,k)=>it.reps?it.reps[Math.min(k,it.reps.length-1)]:null;
const restSecOf=it=>it.rest||(EX[it.ex].cmp?S.gym.restC:S.gym.restI);
function planW(a,it,k){if(it.logged[k])return it.logged[k].w;
if(it.reps){if(!lastItem(it.key)&&k>0&&it.logged[k-1]){const n=it.reps.length,f=j=>0.8+0.2*(n>1?j/(n-1):1);return roundW(it.ex,it.logged[k-1].w*f(k)/f(k-1));}return suggestSet(it,k);}
return it.logged.length?it.logged[it.logged.length-1].w:suggestSet(it,0);}
const planR=(it,k,w)=>it.reps?tgtOf(it,k):suggestR(it.key,it.lo,it.hi,k,w);
function afterSet(a,i){const it=a.items[i],cnt=it.logged.length;
if(it.ss){const mem=a.items.map((x,j)=>({x,j})).filter(o=>o.x.ss===it.ss&&!o.x.skipped);const pos=mem.findIndex(o=>o.j===i);
const nx=mem.slice(pos+1).find(o=>o.x.logged.length<cnt&&o.x.logged.length<o.x.planned);if(nx)return{go:nx.j,rest:0,msg:`Superset: ${EX[nx.x.ex].name}`};
const rest=Math.max(...mem.map(o=>restSecOf(o.x)));const first=mem.find(o=>o.x.logged.length<o.x.planned);if(first)return{go:first.j,rest};}
else if(cnt<it.planned)return{go:i,rest:restSecOf(it)};
return curIdx(a)<0?{go:null,rest:0}:{go:null,rest:restSecOf(it)};}

function curIdx(a=S.active){return a.items.findIndex(it=>!it.skipped&&it.logged.length<it.planned);}
function ssPartner(a,i){const it=a.items[i];if(!it.ss)return null;const j=a.items.findIndex((x,k)=>k!==i&&x.ss===it.ss);return j<0?null:a.items[j];}
function sessionsThisWeek(){const m=mondayOf(new Date()).getTime();return S.sessions.filter(s=>s.start>=m);}
function trainedOn(d){const a=dayStart(d).getTime(),b=a+DAY;return S.sessions.some(s=>s.start>=a&&s.start<b);}
function restDay(){const t=new Date();if(trainedOn(t))return false;const y=new Date(t-DAY),y2=new Date(t-2*DAY);return trainedOn(y)&&trainedOn(y2);}
function warmups(ex,w){if(EX[ex].eq!=='b'||!EX[ex].cmp||w<=65)return null;const r=v=>Math.max(45,Math.round(v/5)*5);const out=[[45,10]];[[.5,8],[.7,4],[.85,2]].forEach(([p,n])=>{const v=r(w*p);if(v>out[out.length-1][0]&&v<w)out.push([v,n]);});return out;}
function plates(w){if(w<45)return'Below the 45 lb bar';if(w===45)return'Just the bar';let side=(w-45)/2;const ps=[];for(const p of [45,35,25,10,5,2.5]){while(side>=p-1e-9){ps.push(p);side-=p;}}return`45 lb bar + ${ps.join(' + ')} each side`;}
const e1rm=s=>s.w*(1+s.r/30);

/* ---------- Muscles ---------- */
function muscleCounts(sessions){const c={};const add=(m,k,v)=>{c[m]=c[m]||{p:0,s:0};c[m][k]+=v;};sessions.forEach(s=>s.items.forEach(it=>it.logged.forEach(()=>{EX[it.ex].p.forEach(m=>add(m,'p',1));EX[it.ex].s.forEach(m=>add(m,'s',.5));})));return c;}
function groupSets(sessions){const g={};GROUPS.forEach(([n,ms])=>{let t=0;sessions.forEach(s=>s.items.forEach(it=>it.logged.forEach(()=>{if(EX[it.ex].p.some(m=>ms.includes(m)))t+=1;else if(EX[it.ex].s.some(m=>ms.includes(m)))t+=.5;})));g[n]=t;});return g;}
function levelsFor(sessions,week){const c=muscleCounts(sessions);const L={};Object.keys(MUS).forEach(m=>{const x=c[m];if(!x)L[m]='n';else if(week)L[m]=(x.p+x.s)>=5?'p':'s';else L[m]=x.p>0?'p':'s';});return L;}
const weekTarget=()=>phase().k==='re'?6:10;

/* Body figure */
const FOREARM='path d="M33,112 Q37,108 44,112 L42,148 Q37,150 34,146 Z"';
const F_L=[['trap_up','path d="M73,44 L58,55 L73,53 Z"'],['delt_side','ellipse cx="44" cy="67" rx="6" ry="10"'],['delt_front','ellipse cx="53" cy="63" rx="8.5" ry="10"'],['chest_up','path d="M61,57 Q70,53 79,55 L79,65 Q69,63 60,67 Z"'],['chest_mid','path d="M60,69 Q69,65 79,67 L79,84 Q68,88 59,80 Z"'],['serratus','path d="M57,84 L63,86 L63,100 L58,96 Z"'],['obliques','path d="M63,103 L70,92 L70,128 L63,124 Z"'],['bi_long','ellipse cx="41.5" cy="91" rx="4" ry="14"'],['bi_short','ellipse cx="47" cy="92" rx="3.8" ry="13"'],['brachialis','ellipse cx="39" cy="106" rx="3" ry="6"'],['forearm',FOREARM],['quad_lat','ellipse cx="61" cy="182" rx="6" ry="30"'],['quad_rf','ellipse cx="69" cy="176" rx="6.5" ry="28"'],['quad_med','ellipse cx="74.5" cy="200" rx="4.5" ry="10"'],['adductor','path d="M74,150 L79,150 L78,182 L74,176 Z"'],['tibialis','ellipse cx="64" cy="258" rx="4.5" ry="22"']];
const F_C=[71.5,80.5].flatMap(x=>[88,101,114].map(y=>['abs',`rect x="${x}" y="${y}" width="8" height="11" rx="3"`]));
const B_L=[['trap_up','path d="M73,42 L56,55 L73,57 Z"'],['delt_side','ellipse cx="44" cy="66" rx="6" ry="10"'],['delt_rear','ellipse cx="53" cy="62" rx="8.5" ry="9.5"'],['teres','ellipse cx="63" cy="72" rx="6" ry="6.5"'],['lats','path d="M58,80 L71,84 L77,122 L65,117 Q56,100 58,80 Z"'],['tri_lat','ellipse cx="40.5" cy="88" rx="4" ry="13"'],['tri_long','ellipse cx="46.5" cy="90" rx="4" ry="15"'],['forearm',FOREARM],['glute_med','ellipse cx="67" cy="138" rx="8" ry="6"'],['glute_max','ellipse cx="70" cy="155" rx="10.5" ry="12"'],['ham_bf','ellipse cx="64" cy="197" rx="5.5" ry="26"'],['ham_semi','ellipse cx="73" cy="198" rx="5" ry="26"'],['calf_lat','ellipse cx="64" cy="246" rx="4.5" ry="15"'],['calf_med','ellipse cx="71" cy="248" rx="4.5" ry="16"'],['soleus','ellipse cx="67.5" cy="272" rx="6" ry="9"']];
const B_C=[['trap_mid','path d="M73,58 L87,58 L85,82 L80,86 L75,82 Z"'],['trap_low','path d="M75,87 L85,87 L80,104 Z"'],['erector','rect x="74" y="106" width="5" height="30" rx="2.5"'],['erector','rect x="81" y="106" width="5" height="30" rx="2.5"']];
const SIL_L='path d="M80,6 Q66,6 66,22 Q66,34 73,38 L73,46 L58,50 Q44,54 38,62 Q34,70 35,80 L33,112 L31,148 Q31,160 36,166 Q42,164 41,156 L44,120 L48,100 L53,84 L57,96 L60,124 L60,138 L57,160 L56,200 L59,226 L60,236 L58,262 L60,282 L61,290 L57,297 L73,297 L73,288 L73,262 L74,238 L76,210 L78,172 L80,160 Z"';
function bodySVG(L,w,h,labels=true){const el=(s,cls)=>{const t=s.split(' ')[0];return`<${s} class="${cls}"></${t}>`;};const sh=lst=>lst.map(([k,s])=>el(s,'m-'+(L[k]||'n'))).join('');
const fig=(left,center)=>{const side=el(SIL_L,'m-sil')+sh(left);return side+`<g transform="translate(160,0) scale(-1,1)">${side}</g>`+sh(center);};
const lab=labels?'<text x="90" y="316" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor" opacity=".75">Front</text><text x="260" y="316" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor" opacity=".75">Back</text>':'';
const on=Object.keys(L).filter(k=>L[k]!=='n').map(k=>MUS[k]);
return`<svg width="${w}" height="${h}" viewBox="0 0 340 320" role="img" aria-label="${on.length?'Trained: '+esc(on.join(', ')):'No muscles trained yet'}"><defs><linearGradient id="mgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A5C"/><stop offset="1" stop-color="#FF2D55"/></linearGradient></defs><g transform="translate(10,6)">${fig(F_L,F_C)}</g><g transform="translate(180,6)">${fig(B_L,B_C)}</g>${lab}</svg>`;}
const LEGEND='<div class="legend"><span><i style="background:#FF3B4E"></i>Primary</span><span><i style="background:#FFA690"></i>Secondary</span><span><i style="background:var(--m-n)"></i>Not trained</span></div>';

/* ---------- Steps and body ---------- */
function stepGoal(){const base=S.profile.stepBase||7000;if(base>=10000)return base;const n=Math.floor((Date.now()-parseISO(S.profile.start))/(14*DAY));return Math.min(10000,Math.round((base+1000*n)/500)*500);}
const stepsToday=()=>S.steps[iso()]||0;
const lastWeigh=()=>S.weighIns[S.weighIns.length-1]||null;
function weighDue(){const l=lastWeigh();return!l||(Date.now()-parseISO(l.date))>=6.5*DAY;}
function bmi(){const l=lastWeigh();if(!l)return null;const m=S.profile.height/100;return l.kg/(m*m);}
function bmiLabel(b){return b<18.5?'Below the healthy range':b<25?'Healthy range':b<30?'Above the healthy range':'Well above the healthy range';}
function lastWaist(){for(let i=S.weighIns.length-1;i>=0;i--)if(S.weighIns[i].waist)return S.weighIns[i];return null;}

/* ---------- Coach ---------- */
function coachLine(){if(S.active)return'Workout in progress. Pick up where you left off.';const goal=stepGoal(),st=stepsToday();
const now=new Date(),wm=wakeMin(now),rr=peekDay(iso()),hr=now.getHours();
if(wm!=null&&hr>=4&&hr<11&&!(rr&&rr.wake))return`Wake-up task first, then your brightest lights. Today's target is ${tfmt(wm)}.`;
if(wm!=null&&hr<10&&!trainedOn(now)&&!restDay()&&minOf(now)>wm+40)return'Running late? Start the workout and tap Options, Short on time. The 4 key lifts still count.';
if(trainedOn(new Date()))return st<goal?`Workout done. ${nf(goal-st)} steps to go today.`:'Workout done and steps hit. Solid day.';
if(restDay())return'Two training days in a row, so today is a rest day. A long walk counts.';
const t=nextType(),day=PLAN[t],keys=itemKeys(day);const mi=day.items.findIndex(i=>EX[i.ex]&&EX[i.ex].cmp&&!i.fin);const mk=keys[mi<0?0:mi],l=lastItem(mk),w=suggestW(mk);
if(l&&w>topW(l))return`${day.name} is next. ${EX[mk.split('#')[0]].name}: you earned ${w} lbs today.`;
return`${day.name} is next, about ${estMin(t,isLong())} min.${phase().k==='re'?' Comeback week: stop 2 to 3 reps short.':''}`;}

/* ---------- Coach engine: evidence-based analysis of your own logs ---------- */
const bwLbs=()=>kgNow()*2.2046;const e1x=(ex,z)=>(z.w+(EX[ex]&&EX[ex].eq==='w'?bwLbs():0))*(1+z.r/30);
const within=days=>{const t=Date.now()-days*DAY;return S.sessions.filter(s=>s.start>=t);};
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const fmtN=x=>Math.abs(x-Math.round(x))<.05?String(Math.round(x)):x.toFixed(1);
function setsIn(sessions){const g={};VG.forEach(v=>{g[v.n]=0;});sessions.forEach(s=>s.items.forEach(it=>{const e=EX[it.ex];if(!e)return;it.logged.forEach(()=>{VG.forEach(v=>{if(e.p.some(m=>v.m.includes(m)))g[v.n]+=1;else if(e.s.some(m=>v.m.includes(m)))g[v.n]+=.5;});});}));return g;}
function planWeekly(){const g={};VG.forEach(v=>{g[v.n]=0;});S.plan.days.forEach(d=>d.items.forEach(it=>{if(it.fin)return;const e=EX[it.ex];if(!e)return;VG.forEach(v=>{if(e.p.some(m=>v.m.includes(m)))g[v.n]+=it.sets;else if(e.s.some(m=>v.m.includes(m)))g[v.n]+=it.sets/2;});}));return g;}
const vStat=(v,x)=>x<v.lo?'low':x>v.hi?'high':'ok';
function seriesOf(ex){const out=[];S.sessions.forEach(s=>{const its=s.items.filter(x=>x.ex===ex&&x.logged.length&&!(x.key||'').includes('#f'));if(!its.length)return;const sets=its.flatMap(x=>x.logged);const best=sets.reduce((a,b)=>e1x(ex,b)>e1x(ex,a)?b:a);out.push({t:s.start,v:e1x(ex,best),w:best.w,r:best.r});});return out;}
function trendOf(ex){const s=seriesOf(ex);if(s.length<2)return null;const n=s.length,last=s[n-1];const prevBest=Math.max(...s.slice(0,-1).map(x=>x.v));
const base=s.find(x=>x.t>=Date.now()-28*DAY)||s[0];const pct=(last.v/base.v-1)*100;let st='flat';
if(n>=3&&s[n-1].v<s[n-2].v*.985&&s[n-2].v<s[n-3].v*.985)st='drop';
else if(last.v>prevBest*1.005)st='up';
else if(n>=3&&Math.max(s[n-1].v,s[n-2].v)<=Math.max(...s.slice(0,n-2).map(x=>x.v))*1.005)st='stall';
return{ex,s,last,pct,st};}
function trends(){const seen=[];within(56).slice().reverse().forEach(ss=>ss.items.forEach(it=>{if(it.logged.length&&!(it.key||'').includes('#f')&&!seen.includes(it.ex)&&EX[it.ex])seen.push(it.ex);}));return seen.map(trendOf).filter(Boolean);}
function perfIdx(sess,bi){const prev=S.sessions.slice(0,bi);const r=[];sess.items.forEach(it=>{if(!it.logged.length||(it.key||'').includes('#f'))return;const today=Math.max(...it.logged.map(z=>e1x(it.ex,z)));const pb=[];for(let i=prev.length-1;i>=0&&pb.length<2;i--){const x=prev[i].items.filter(y=>y.ex===it.ex&&y.logged.length);if(x.length)pb.push(Math.max(...x.flatMap(y=>y.logged.map(z=>e1x(it.ex,z)))));}if(pb.length)r.push(today/avg(pb));});return r.length?avg(r):null;}
function effortMix(sessions){const o={easy:0,good:0,hard:0,failed:0,n:0};sessions.forEach(s=>s.items.forEach(it=>it.logged.forEach(x=>{o[x.e]=(o[x.e]||0)+1;o.n++;})));return o;}
function restEvents(sessions){const out=[];sessions.forEach(s=>s.items.forEach(it=>{if(it.ss||!EX[it.ex])return;const tgt=it.rest||(EX[it.ex].cmp?S.gym.restC:S.gym.restI);for(let k=1;k<it.logged.length;k++){const a=it.logged[k-1],b=it.logged[k];const r=(b.t-a.t)/1000-40;if(r<0||r>900)continue;out.push({ex:it.ex,cmp:EX[it.ex].cmp,r,tgt,drop:b.w===a.w?a.r-b.r:0,pyr:!!it.reps});}}));return out;}
function sleepBefore(ts){const d=new Date(ts);const r=peekDay(iso(d));if(!r||!r.wake)return null;const c=[peekDay(iso(addDays(d,-1))),r].filter(Boolean).map(x=>x.nightDone).filter(t=>t&&t<r.wake.at&&r.wake.at-t<14*3600000);if(!c.length)return null;return Math.round((r.wake.at-Math.max(...c))/MIN)-20;}
function stallNote(tr){const e=EX[tr.ex],last=tr.last;const drop=roundW(tr.ex,last.w*.9);const alt=e.alts&&e.alts.length?EX[e.alts[0]].name:null;
if(tr.st==='drop')return{b:`${e.name} dropped two sessions in a row.`,d:`Check sleep and food first. If it drops again next session, take a deload week.`};
return{b:`${e.name}: no new best in 3 sessions.`,d:drop<last.w?`Stuck around ${last.w} lbs × ${last.r}. Fix: drop to ${drop} lbs and add a rep each session until you pass it${alt?`, or swap to ${alt} for 4 weeks`:''}.`:`Stuck around ${last.w} lbs × ${last.r}. Fix: stay at ${last.w} lbs and beat ${last.r} reps by one each session before adding load${alt?`, or swap to ${alt} for 4 weeks`:''}.`};}
function volFix(v,need){const ex=v.add;let best=null,bv=-1;S.plan.days.forEach(d=>{let c=0;d.items.forEach(it=>{const e=EX[it.ex];if(e&&e.p.some(m=>v.m.includes(m))&&!it.fin)c+=it.sets;});const m=estMin(d.id,false);if(c>bv||(c===bv&&m<estMin(best.id,false))){bv=c;best=d;}});
const i=best.items.findIndex(it=>it.ex===ex&&!it.fin);const n=Math.max(2,Math.min(4,Math.ceil(need)));
if(i>=0)return{txt:`Add ${plural(n,'set')} to ${EX[ex].name} on ${best.name}.`,act:{k:'addSet',day:best.id,i,n}};
const lohi=EX[ex].cmp?[8,12]:[12,15];return{txt:`Add ${n} sets of ${EX[ex].name} to ${best.name}.`,act:{k:'addEx',day:best.id,ex,n,lo:lohi[0],hi:lohi[1]}};}
function recs(){const out=[];const span=S.sessions.length?(Date.now()-S.sessions[0].start)/DAY:0;const real=span>=14;const w28=setsIn(within(28));const pl=planWeekly();
const last=S.sessions.slice(-2);if(last.length===2){const p=last.map(s=>perfIdx(s,S.sessions.indexOf(s)));if(p.every(x=>x!=null&&x<.97))out.push({p:1,i:'clock',t:'warn',b:'Two sessions in a row under your recent strength.',d:'That pattern usually means fatigue, not lost muscle. Deload for 5 to 7 days: same exercises, half the sets, stop 3 reps before failure.'});}
VG.forEach(v=>{if(v.ind)return;const x=real?w28[v.n]/Math.min(4,span/7):pl[v.n];const src=real?'You average':'Your plan gives';
if(x<v.lo){const f=volFix(v,v.lo-x);out.push({p:2,i:'up',t:'gym',b:`${v.n}: ${fmtN(x)} sets a week.`,d:`${src} ${fmtN(x)}, under the ${v.lo} to ${v.hi} range where most people grow best. ${f.txt}`,act:f.act});}
else if(x>v.hi+4)out.push({p:5,i:'right',t:'warn',b:`${v.n}: ${fmtN(x)} sets a week.`,d:`Above ${v.hi}. More can still work, but returns shrink and recovery costs rise. If these lifts stall, cut sets here first.`});});
trends().filter(x=>(x.st==='stall'||x.st==='drop')&&EX[x.ex].cmp).slice(0,2).forEach(x=>out.push(Object.assign({p:3,i:'right',t:'warn'},stallNote(x))));
const ef=effortMix(within(7));if(ef.n>=15&&ef.easy/ef.n>.35)out.push({p:4,i:'up',t:'gym',b:`${Math.round(ef.easy/ef.n*100)}% of your sets were Easy this week.`,d:'Sets that end 3 or more reps from failure build less muscle. Add weight or reps until most sets feel Good, 1 to 2 reps left.'});
const re=restEvents(within(7)).filter(x=>!x.pyr&&x.drop>=2&&x.r<x.tgt*.8);if(re.length>=2)out.push({p:4,i:'clock',t:'gym',b:`Short rests cost you reps ${re.length} times this week.`,d:`You rested about ${mmss(avg(re.map(x=>x.r)))} and lost ${fmtN(avg(re.map(x=>x.drop)))} reps on the next set. Let the timer run out: reps are the growth signal.`});
return out.sort((a,b)=>a.p-b.p).slice(0,4);}
function summarize(sess,bi){const notes=[],prs=[];const done=sess.items.filter(it=>it.logged.length);const prev=S.sessions.slice(0,bi);const earned=[],missed=[];
done.forEach(it=>{const e=EX[it.ex],nm=e.name,fin=(it.key||'').includes('#f');const best=Math.max(...it.logged.map(z=>e1x(it.ex,z)));let pb=0;prev.forEach(s=>s.items.forEach(x=>{if(x.ex===it.ex&&!(x.key||'').includes('#f'))x.logged.forEach(z=>{pb=Math.max(pb,e1x(it.ex,z));});}));
const bs=it.logged.reduce((a,s)=>e1x(it.ex,s)>e1x(it.ex,a)?s:a);
if(!fin&&pb&&best>pb*1.005){prs.push(nm);notes.push({p:1,t:'gym',i:'up',b:`New best: ${nm}.`,d:e.eq==='w'?`${bs.w?`+${bs.w} lbs`:'Bodyweight'} × ${bs.r}, your best yet.`:`${bs.w} lbs × ${bs.r}. Estimated max ${Math.round(best)} lbs, up ${Math.max(1,Math.round(best-pb))}.`});}
if(it.reps){const ok=it.logged.filter((s,k)=>s.r>=it.reps[Math.min(k,it.reps.length-1)]&&(s.e==='good'||s.e==='easy')).length;if(ok)earned.push(ok===it.logged.length?nm:`${nm} (${ok} of ${it.logged.length} sets)`);if(ok<it.logged.length&&it.logged.some((s,k)=>s.r<it.reps[Math.min(k,it.reps.length-1)]-1))missed.push(nm);}
else if(allHitTop(it)||allEasy(it))earned.push(allEasy(it)&&!allHitTop(it)?`${nm} (every set Easy)`:nm);
else if(it.logged.some(s=>s.r<it.lo||s.e==='failed'))missed.push(nm);});
const sl=sleepBefore(sess.start),pi=perfIdx(sess,bi);
if(sl!=null&&sl<400&&pi!=null&&pi<.97)notes.push({p:2,t:'warn',i:'clock',b:`About ${fmtN(sl/60)} h of sleep, and lifts ${Math.round((1-pi)*100)}% under your recent level.`,d:'That is the sleep, not lost strength. Same weights next time. Recovery is where the muscle gets built.'});
else if(pi!=null&&pi>=1.03&&!prs.length)notes.push({p:2,t:'gym',i:'up',b:`Strong session: ${Math.round((pi-1)*100)}% above your recent level.`,d:'Whatever you did before this one (sleep, food, timing), repeat it.'});
const sleepy=notes.some(n=>n.p===2&&n.t==='warn');const tr=sleepy?[]:done.map(it=>trendOf(it.ex)).filter(x=>x&&EX[x.ex].cmp&&(x.st==='stall'||x.st==='drop'));const seenT=[];tr.forEach(x=>{if(seenT.includes(x.ex))return;seenT.push(x.ex);if(seenT.length<=1)notes.push(Object.assign({p:3,t:'warn',i:'right'},stallNote(x)));});
const re=restEvents([sess]).filter(x=>!x.pyr&&x.drop>=2&&x.r<x.tgt*.8);if(re.length){const x=re[0];notes.push({p:4,t:'gym',i:'clock',b:`${EX[x.ex].name}: lost ${x.drop} reps after a ${mmss(x.r)} rest.`,d:`Your setting is ${mmss(x.tgt)}. Shorter rests cost reps, and reps are the growth signal.`});}
if(missed.length)notes.push({p:5,t:'warn',i:'right',b:`Missed the rep target: ${missed.slice(0,3).join(', ')}.`,d:'Same weight next time. Beat it by one rep before adding load.'});
if(earned.length)notes.push({p:6,t:'gym',i:'up',b:`Earned more weight: ${earned.slice(0,3).join(', ')}${earned.length>3?` and ${earned.length-3} more`:''}.`,d:'The new weights are pre-filled next time.'});
const wk=setsIn(within(7).filter(s=>s.id!==sess.id).concat([sess])),today=setsIn([sess]);const hit=VG.filter(v=>!v.ind&&today[v.n]>=3).sort((a,b)=>today[b.n]-today[a.n]).slice(0,3);
if(hit.length)notes.push({p:7,t:'gym',i:'body',b:'This week so far: '+hit.map(v=>`${v.n} ${fmtN(wk[v.n])} sets`).join(', ')+'.',d:hit.map(v=>`${v.n} ${vStat(v,wk[v.n])==='low'?'is under':vStat(v,wk[v.n])==='high'?'is above':'is inside'} ${v.lo} to ${v.hi}`).join('. ')+'.'});
const sk=sess.items.filter(it=>!it.logged.length&&!it.cut);if(sk.length)notes.push({p:8,t:'warn',i:'right',b:`Skipped ${sk.map(it=>EX[it.ex].name).join(', ')}.`,d:`${sk.length>1?'They go':'It goes'} first in your next ${PLAN[sess.type].name}.`});
if(sess.phase==='re'){const all=sess.items.flatMap(it=>it.logged),f=all.filter(s=>s.e==='hard'||s.e==='failed').length;if(all.length&&f/all.length>.3)notes.push({p:3,t:'warn',i:'clock',b:`Comeback week: ${f} of ${all.length} sets went to failure.`,d:'Leave 2 to 3 reps this week. You lose nothing, and next week you can push all of them.'});}
notes.sort((a,b)=>a.p-b.p);return{notes:notes.slice(0,5),prs,done:done.length,total:sess.items.filter(it=>!it.cut).length};}
function finishWorkout(){const a=S.active;a.end=Date.now();a.restUntil=0;
const skipped=a.items.filter(it=>!it.logged.length&&!it.cut).map(it=>it.okey||it.key||it.ex);if(skipped.length)S.carry[a.type]=skipped;
S.sessions.push(a);S.active=null;a.summary=summarize(a,S.sessions.length-1);saveNow();return a.id;}
