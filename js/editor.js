/* ---------- Settings and plan editor: sheets and actions ---------- */
const baseSteps=kind=>(RT().steps&&RT().steps[kind])||(kind==='m'?M_STEPS:N_STEPS);
function ensureSteps(kind){const r=RT();r.steps=r.steps||{};if(!r.steps[kind])r.steps[kind]=(kind==='m'?M_STEPS:N_STEPS).map(x=>Object.assign({},x));return r.steps[kind];}
const EQN={b:'Barbell',d:'Dumbbell',c:'Cable',m:'Machine',w:'Bodyweight'};
function itemPreview(sh){return sh.type==='pyr'?`Pyramid: ${pyrReps({sets:sh.sets,r0:sh.r0,r1:sh.r1}).join(' - ')} reps, weight goes up each set`:`${sh.sets} sets of ${Math.min(sh.lo,sh.hi)} to ${Math.max(sh.lo,sh.hi)} reps`;}
function itemSheet(o){const it=o.it||{};const ex=o.ex||it.ex;const iso0=!EX[ex].cmp;const rs=['Default',...range(15,300,15)];
openSheet({k:'item',day:o.day,i:o.i,ex,type:it.type||'straight',sets:it.sets||3,lo:it.lo||(iso0?12:8),hi:it.hi||(iso0?15:12),r0:it.type==='pyr'?it.r0:(it.hi||12),r1:it.type==='pyr'?it.r1:(it.lo||8),rest:it.rest||'Default',link:!!it.link,fin:!!it.fin,wv:{sets:range(1,12,1),lo:range(1,30,1),hi:range(1,30,1),r0:range(1,30,1),r1:range(1,30,1),rest:rs}});}
function sheetHTML3(sh){let b='';
if(sh.k==='item'){const e=EX[sh.ex];const dr=e.cmp?S.gym.restC:S.gym.restI;
b=`<h2>${sh.i>=0?'Edit exercise':'Add exercise'}</h2><button class="row card" style="border-radius:16px" data-a="pickOpen"><div class="grow"><div class="t1">${esc(e.name)}</div><div class="t2">Tap to change exercise</div></div>${ic('chev',16)}</button>
<div class="seg" style="grid-template-columns:1fr 1fr"><button class="${sh.type==='straight'?'on':''}" data-a="itemType" data-v="straight">Straight sets</button><button class="${sh.type==='pyr'?'on':''}" data-a="itemType" data-v="pyr">Pyramid</button></div>
<div class="wheels">${wheel('sets',sh.wv.sets,sh.sets,'sets')}${sh.type==='pyr'?wheel('r0',sh.wv.r0,sh.r0,'first')+wheel('r1',sh.wv.r1,sh.r1,'last'):wheel('lo',sh.wv.lo,sh.lo,'min')+wheel('hi',sh.wv.hi,sh.hi,'max')}</div>
<div class="t2 b center" data-pyr>${esc(itemPreview(sh))}</div>
<div class="card col" style="border-radius:18px"><button class="row" data-a="itemTgl" data-f="link"><div class="grow"><div class="t1" style="font-size:15px">Superset with the next exercise</div><div class="t2">No rest between them, rest after the pair</div></div><span class="sw ${sh.link?'on':''}" data-sw="link"></span></button><button class="row" data-a="itemTgl" data-f="fin"><div class="grow"><div class="t1" style="font-size:15px">Finisher</div><div class="t2">Only in longer sessions (weekends by default)</div></div><span class="sw ${sh.fin?'on':''}" data-sw="fin"></span></button></div>
<div class="flex between"><div class="t1">Rest after each set</div><div class="t2">Default is ${mmss(dr)}</div></div>${wheel('rest',sh.wv.rest,sh.rest,'',v=>v==='Default'?'Default':mmss(v))}
<button class="btn" data-a="itemSave">Save</button>${sh.i>=0?'<button class="link" style="align-self:center;color:var(--amber)" data-a="itemDel">Remove from this day</button>':''}`;}
if(sh.k==='pick'){const dayId=sh.ret.day||(sh.ret.draft&&sh.ret.draft.day);const skip=sh.ret.draft?sh.ret.draft.i:-1;const cov=dayCover(dayId,skip);const pv=sh.sel&&EX[sh.sel]?EX[sh.sel]:null;
const fill=m=>pv&&pv.p.includes(m)?'#0A84FF':pv&&pv.s.includes(m)?'#8EC5FF':cov[m]&&cov[m].p?'#FF3B4E':cov[m]?'#FFA690':'var(--m-n)';
const ids=Object.keys(EX);let groups;
if(sh.mf){const pr=ids.filter(id=>EX[id].p.includes(sh.mf)),se=ids.filter(id=>!EX[id].p.includes(sh.mf)&&EX[id].s.includes(sh.mf));groups=[{n:'Main target: '+(ANAT_NAME[sh.mf]||MUS[sh.mf]),ids:pr},{n:'Also works it',ids:se}];}
else{const seen=new Set();groups=VG.map(v=>{const g=ids.filter(id=>!seen.has(id)&&EX[id].p.some(m=>v.m.includes(m)));g.forEach(id=>seen.add(id));return{n:v.n,ids:g};});const other=ids.filter(id=>!seen.has(id));if(other.length)groups.push({n:'Other',ids:other});}
const warn=pv?overWarn(dayId,skip,sh.sel):'';
b=`<h2>${sh.ret.draft?'Change exercise':'Add exercise'}</h2><div class="t2" style="margin-top:-10px">Tap a muscle to see exercises for it. Tap an exercise to see exactly what it trains.</div>
<div class="pkfig">${anatomy(fill,{h:250,tap:1,act:'pkMus',sel:sh.mf,aria:'Tap a muscle to filter exercises'})}<div class="legend" style="justify-content:center"><span><i style="background:#FF3B4E"></i>Already in this day</span><span><i style="background:#0A84FF"></i>This exercise</span></div></div>
${sh.mf?`<button class="qbtn on" data-a="pkMus" data-m="${sh.mf}" style="align-self:flex-start">${esc(ANAT_NAME[sh.mf]||MUS[sh.mf])} ✕</button>`:''}
<input class="txt" id="pk-q" placeholder="Search exercises" autocomplete="off" value="${esc(sh.q||'')}"><button class="row card" data-a="customOpen" style="border-radius:16px">${tile('gym','plus','sm')}<div class="grow t1">Create your own exercise</div></button>
${groups.filter(g=>g.ids.length).map(g=>`<div class="pkg col gap6"><div class="t2 b" style="padding:4px 6px 0">${esc(g.n)}</div><div class="card col" style="border-radius:18px">${g.ids.map(id=>`<button class="row pk ${sh.sel===id?'pksel':''}" data-a="pkPrev" data-x="${id}" data-n="${esc(EX[id].name.toLowerCase())}"><div class="grow"><div class="t1" style="font-size:15px">${esc(EX[id].name)}</div><div class="t2">${EX[id].p.map(m=>MUS[m]).join(', ')}</div></div><div class="t2">${EQN[EX[id].eq]||'EZ bar'}</div></button>`).join('')}</div></div>`).join('')}
${pv?`<div class="pkbar card"><div class="grow" style="min-width:0"><div class="t1" style="font-size:15px">${esc(pv.name)}</div><div class="t2"><b style="color:#0A84FF">${pv.p.map(m=>MUS[m]).join(', ')}</b>${pv.s.length?`, also ${pv.s.map(m=>MUS[m]).join(', ')}`:''}</div>${warn?`<div class="t2 warn b" style="margin-top:3px">${esc(warn)}</div>`:''}</div><button class="btn sm" data-a="pickEx" data-x="${sh.sel}">${sh.ret.draft?'Use':'Add'}</button></div>`:''}`;}
if(sh.k==='custom')b=`<h2>Your own exercise</h2><input class="txt" id="cx-name" placeholder="Name, for example Smith machine incline press" maxlength="50" autocomplete="off">
<div class="t2 b">Equipment</div><div class="seg" style="grid-template-columns:repeat(5,minmax(0,1fr))">${Object.entries(EQN).map(([k,n])=>`<button class="${sh.eq===k?'on':''}" data-a="cxSet" data-f="eq" data-v="${k}" style="font-size:12px">${n}</button>`).join('')}</div>
<div class="t2 b">Main muscle</div><div class="mini">${VG.map((v,i)=>`<button class="qbtn ${sh.g===i?'on':''}" data-a="cxSet" data-f="g" data-v="${i}">${v.n}</button>`).join('')}</div>
<div class="seg" style="grid-template-columns:1fr 1fr"><button class="${sh.cmp?'on':''}" data-a="cxSet" data-f="cmp" data-v="1">Big lift</button><button class="${!sh.cmp?'on':''}" data-a="cxSet" data-f="cmp" data-v="0">Isolation</button></div><button class="btn" data-a="customSave">Save and use</button>`;
if(sh.k==='rest')b=`<h2>Rest times</h2><div class="t2" style="margin-top:-10px">Big lifts: presses, rows, squats, deadlifts. Longer rest keeps reps up on these. Supersets rest after the last exercise of the pair.</div><div class="wheels">${wheel('rc',sh.wv.rc,sh.rc,'big',mmss)}${wheel('ri',sh.wv.ri,sh.ri,'other',mmss)}</div><button class="btn" data-a="restSave">Save</button>`;
if(sh.k==='offset')b=`<h2>Night routine start</h2><div class="t2" style="margin-top:-10px">Standard is 75 min before your bedtime. Move it if evenings run late.</div>${wheel('n',sh.vals,sh.n,'',v=>v===0?'Standard':v>0?`${v} min earlier`:`${-v} min later`)}<button class="btn" data-a="offsetSave">Save</button>`;
if(sh.k==='social')b=`<h2>Social media block</h2><div class="t2" style="margin-top:-10px">What the app shows. The real block is in Screen Time, so set the same times there.</div><div class="t1">Starts</div><div class="wheels">${wheel('ah',sh.wv.h,sh.ah,'h',v=>String(v))}${wheel('am',sh.wv.m,sh.am,'min',v=>pad2(v))}</div><div class="t1">Ends</div><div class="wheels">${wheel('bh',sh.wv.h,sh.bh,'h',v=>String(v))}${wheel('bm',sh.wv.m,sh.bm,'min',v=>pad2(v))}</div><button class="btn" data-a="socialSave">Save</button>`;
if(sh.k==='dayName')b=`<h2>Rename day</h2><input class="txt" id="dn-name" value="${esc(sh.name)}" placeholder="Name" maxlength="30"><input class="txt" id="dn-focus" value="${esc(sh.focus)}" placeholder="Focus, for example Chest and abs" maxlength="40"><button class="btn" data-a="dayNameSave">Save</button>`;
if(sh.k==='step')b=`<h2>${sh.i>=0?'Edit step':'Add a step'}</h2><input class="txt" id="st-t" value="${esc(sh.t||'')}" placeholder="Step, for example Stretch 5 min" maxlength="40"><input class="txt" id="st-d" value="${esc(sh.d||'')}" placeholder="Note (optional)" maxlength="60"><button class="btn" data-a="stepSave">Save</button>${sh.i>=0&&!sh.auto?'<button class="link" style="align-self:center;color:var(--amber)" data-a="stepDel">Remove step</button>':''}`;
return b;}
function dayCover(dayId,skip,extra){const d=S.plan.days.find(x=>x.id===dayId);const c={};if(!d)return c;const add=(ex,n)=>{const e=EX[ex];if(!e)return;e.p.forEach(m=>{c[m]=c[m]||{p:0,s:0};c[m].p+=n;});e.s.forEach(m=>{c[m]=c[m]||{p:0,s:0};c[m].s+=n;});};d.items.forEach((it,i)=>{if(i!==skip&&!it.fin)add(it.ex,it.sets);});if(extra)add(extra.ex,extra.sets);return c;}
/* per-session limit: past about 10 hard sets for one muscle group in one session, extra sets add little */
function sessionLoad(dayId,skip,extra){const c=dayCover(dayId,skip,extra);const out=[];VG.forEach(v=>{if(v.ind)return;let n=0;const d=S.plan.days.find(x=>x.id===dayId);if(!d)return;const items=d.items.filter((it,i)=>i!==skip&&!it.fin).concat(extra?[extra]:[]);items.forEach(it=>{const e=EX[it.ex];if(e&&e.p.some(m=>v.m.includes(m)))n+=it.sets;});if(n>10)out.push({v,n});});return{c,over:out};}
function overWarn(dayId,skip,ex){const e=EX[ex];if(!e)return'';const sets=e.cmp?3:3;const before=sessionLoad(dayId,skip).over.map(o=>o.v.n);const o=sessionLoad(dayId,skip,{ex,sets}).over.filter(x=>!before.includes(x.v.n));return o.length?`Adds to ${o[0].v.n}: ${o[0].n} sets in one session. Past about 10, extra sets add little.`:'';}
function morphLive(){document.querySelectorAll('#app svg[data-live]').forEach(svg=>{const k=svg.dataset.live,prev=(U.liveFills||{})[k],now={};svg.querySelectorAll('path.an-m').forEach((p,i)=>{now[i]=p.getAttribute('fill');if(prev&&prev[i]&&prev[i]!==now[i]){p.setAttribute('fill',prev[i]);p.classList.add('morph');requestAnimationFrame(()=>requestAnimationFrame(()=>p.setAttribute('fill',now[i])));}});U.liveFills=Object.assign(U.liveFills||{},{[k]:now});});}
function rerenderSheetKeep(){const el=$('#sheets .sheet');const y=el?el.scrollTop:0;renderSheet();const n=$('#sheets .sheet'),sc=$('#sheets .scrim');if(n){n.style.animation='none';n.scrollTop=y;}if(sc)sc.style.animation='none';const qv=$('#pk-q');if(qv&&qv.value)qv.dispatchEvent(new Event('input',{bubbles:true}));}
Object.assign(A,{
itemQuickDel:d=>{const day=S.plan.days.find(x=>x.id===d.day);const it=day.items.splice(+d.i,1)[0];U.undoDel={day:d.day,i:+d.i,it};save();U.keepScroll=true;render();},
itemUndo:()=>{const u=U.undoDel;if(!u)return;const day=S.plan.days.find(x=>x.id===u.day);day.items.splice(u.i,0,u.it);U.undoDel=null;save();U.keepScroll=true;render();},
pkPrev:d=>{U.sheet.sel=U.sheet.sel===d.x?null:d.x;rerenderSheetKeep();},
pkMus:d=>{const sh=U.sheet;sh.mf=sh.mf===d.m?null:d.m;sh.sel=null;rerenderSheetKeep();},
dayMus:d=>{openSheet({k:'pick',ret:{day:curView().id,i:-1},mf:d.m});}
});
function insertItem(day,it){const f=day.items.findIndex(x=>x.fin);if(it.fin||f<0)day.items.push(it);else day.items.splice(f,0,it);}
function swapIn(arr,i,j){if(j<0||j>=arr.length)return false;[arr[i],arr[j]]=[arr[j],arr[i]];return true;}
Object.assign(A,{
pickDay:d=>{U.pickDay=d.d;U.long=null;U.keepScroll=true;render();},
tglLong:()=>{const cur=U.long!=null?U.long:isLong();U.long=!cur;U.keepScroll=true;render();},
startWorkout:d=>{audioReady();S.active=buildSession(d.t,d.l==='1');U.pickDay=null;U.long=null;U.exp=null;save();U.stack=[{v:'workout'}];render();},
expand:d=>{U.exp=+d.i;U.expAnim=+d.i;U.keepScroll=true;render();},
logSet:()=>{const sh=U.sheet,a=S.active,it=a.items[sh.i];const rec={w:sh.w,r:sh.r,e:sh.e,t:Date.now()};
if(sh.s<it.logged.length){rec.t=it.logged[sh.s].t;it.logged[sh.s]=rec;save();closeSheet();U.keepScroll=true;render();return;}
it.logged.push(rec);U.pop=`set:${sh.i}:${it.logged.length-1}`;const nx=afterSet(a,sh.i);
if(nx.rest){a.restFor=nx.rest;a.restUntil=Date.now()+nx.rest*1000;U.restNew=true;}else a.restUntil=0;
if(nx.go!==sh.i&&nx.go!=null)U.expAnim=nx.go;U.exp=nx.go;save();closeSheet();U.keepScroll=true;render();if(nx.msg)toast(nx.msg);},
swapPick:d=>{const it=S.active.items[U.sheet.i];it.ex=d.x;it.key=d.x===it.orig?(it.okey||it.key):d.x;save();closeSheet();U.keepScroll=true;render();},
shortSession:()=>{const a=S.active;const live=a.items.map((it,i)=>({it,i})).filter(o=>!o.it.skipped);const pri=live.slice().sort((x,y)=>(EX[y.it.ex].cmp?1:0)-(EX[x.it.ex].cmp?1:0)||(y.it.logged.length?1:0)-(x.it.logged.length?1:0)||x.i-y.i);const keep=new Set(pri.filter(o=>o.it.logged.length).map(o=>o.i));pri.forEach(o=>{if(keep.size<4)keep.add(o.i);});live.forEach(o=>{if(!keep.has(o.i)){o.it.skipped=true;o.it.cut=true;}});save();closeSheet();toast('Trimmed to the 4 key exercises');render();},
confirmYes:()=>{const sh=U.sheet,t=sh.then;closeSheet();
if(t==='discard'){S.active=null;save();U.stack=[];U.tab='gym';render();}
if(t==='finish')doFinish();
if(t==='erase'){try{localStorage.removeItem(VK);}catch(e){}location.reload();}
if(t==='import'){lsSet(VK,U.pendingImport);U.pendingImport=null;lock();toast('Backup restored. Enter its passcode.');}
if(t==='resetPlan'){S.plan=defaultPlan();S.carry={};save();render();toast('Plan reset to default');}
if(t==='delDay'){S.plan.days=S.plan.days.filter(x=>x.id!==sh.dayId);save();U.stack.pop();render();toast('Day removed');}},
tgl:d=>{S.gym[d.k]=!S.gym[d.k];if(d.k==='comeback'&&S.gym.comeback)S.gym.start=iso();save();U.keepScroll=true;render();},
restOpen:()=>openSheet({k:'rest',rc:S.gym.restC,ri:S.gym.restI,wv:{rc:range(30,300,15),ri:range(15,240,15)}}),
restSave:()=>{S.gym.restC=U.sheet.rc;S.gym.restI=U.sheet.ri;save();closeSheet();U.keepScroll=true;render();toast('Rest times saved');},
offsetOpen:()=>{const vals=range(-60,60,15);openSheet({k:'offset',vals,n:vals.includes(RT().nightEarly)?RT().nightEarly:0});},
offsetSave:()=>{RT().nightEarly=U.sheet.n;save();closeSheet();U.keepScroll=true;render();},
socialOpen:()=>{const r=RT();openSheet({k:'social',ah:Math.floor(r.socialStart/60),am:Math.round(r.socialStart%60/5)*5%60,bh:Math.floor(r.socialEnd/60),bm:Math.round(r.socialEnd%60/5)*5%60,wv:{ah:range(0,23,1),bh:range(0,23,1),am:range(0,55,5),bm:range(0,55,5),h:range(0,23,1),m:range(0,55,5)}});},
socialSave:()=>{const sh=U.sheet;RT().socialStart=sh.ah*60+sh.am;RT().socialEnd=sh.bh*60+sh.bm;save();closeSheet();U.keepScroll=true;render();toast('Saved. Match it in Screen Time.');},
planReset:()=>openSheet({k:'confirm',title:'Reset your plan?',text:'Every day and exercise goes back to the default old-style split. Your workout history stays.',yes:'Reset plan',then:'resetPlan'}),
dayMove:d=>{if(swapIn(S.plan.days,+d.i,+d.i+(+d.dir)))save();U.keepScroll=true;render();},
dayAdd:()=>{const id='D'+Date.now().toString(36);S.plan.days.push({id,name:'New day',focus:'',items:[]});save();U.stack.push({v:'dayEdit',id});render();},
dayName:d=>{const day=S.plan.days.find(x=>x.id===d.id);openSheet({k:'dayName',id:d.id,name:day.name,focus:day.focus||''});},
dayNameSave:()=>{const day=S.plan.days.find(x=>x.id===U.sheet.id);const n=($('#dn-name').value||'').trim();if(!n){toast('Add a name');return;}day.name=n;day.focus=($('#dn-focus').value||'').trim();save();closeSheet();U.keepScroll=true;render();},
dayDel:d=>openSheet({k:'confirm',title:'Remove this day?',text:'Its exercises are removed from your plan. Workout history stays.',yes:'Remove day',then:'delDay',dayId:d.id}),
itemOpen:d=>{const day=S.plan.days.find(x=>x.id===d.day);itemSheet({day:d.day,i:+d.i,it:day.items[+d.i]});},
itemNew:d=>openSheet({k:'pick',ret:{day:d.day,i:-1}}),
itemMove:d=>{const day=S.plan.days.find(x=>x.id===d.day);if(swapIn(day.items,+d.i,+d.i+(+d.dir)))save();U.keepScroll=true;render();},
itemType:d=>{U.sheet.type=d.v;renderSheet();},
itemTgl:d=>{const sh=U.sheet;sh[d.f]=!sh[d.f];const el=$(`[data-sw="${d.f}"]`);if(el)el.classList.toggle('on',sh[d.f]);},
pickOpen:()=>{const draft=U.sheet;openSheet({k:'pick',ret:{draft}});},
pickEx:d=>{const r=U.sheet.ret;if(r.draft){const dr=r.draft;dr.ex=d.x;U.sheet=dr;renderSheet();return;}itemSheet({day:r.day,i:-1,ex:d.x});},
customOpen:()=>{const ret=U.sheet.ret;openSheet({k:'custom',eq:'m',g:0,cmp:false,ret});},
cxSet:d=>{const sh=U.sheet;const v=d.f==='g'?+d.v:d.f==='cmp'?d.v==='1':d.v;sh[d.f]=v;const name=$('#cx-name')?$('#cx-name').value:'';renderSheet();const el=$('#cx-name');if(el)el.value=name;},
customSave:()=>{const sh=U.sheet,name=($('#cx-name').value||'').trim();if(!name){toast('Add a name');return;}const id='cx'+Date.now().toString(36);const c={name,eq:sh.eq,cmp:sh.cmp?1:0,p:VG[sh.g].m.slice(),s:[],start:{b:45,d:20,c:30,m:50,w:0}[sh.eq]};S.customEx[id]=c;EX[id]=E(c.name,c.eq,c.cmp,c.p,[],[],c.start);save();
const r=sh.ret||{};if(r.draft){r.draft.ex=id;U.sheet=r.draft;renderSheet();return;}itemSheet({day:r.day,i:-1,ex:id});},
itemSave:()=>{const sh=U.sheet;const day=S.plan.days.find(x=>x.id===sh.day);const pyr=sh.type==='pyr';
const it={ex:sh.ex,type:sh.type,sets:sh.sets,lo:pyr?Math.min(sh.r0,sh.r1):Math.min(sh.lo,sh.hi),hi:pyr?Math.max(sh.r0,sh.r1):Math.max(sh.lo,sh.hi),r0:sh.r0,r1:sh.r1,link:sh.link,fin:sh.fin,rest:sh.rest==='Default'?null:sh.rest};
if(sh.i>=0)day.items[sh.i]=it;else insertItem(day,it);save();closeSheet();U.keepScroll=true;render();const ov=sessionLoad(day.id,-1).over;toast(ov.length?`Saved. ${ov[0].v.n} now has ${ov[0].n} sets this session, more than about 10 is too much.`:'Plan saved');},
itemDel:()=>{const sh=U.sheet;const day=S.plan.days.find(x=>x.id===sh.day);day.items.splice(sh.i,1);save();closeSheet();U.keepScroll=true;render();},
recAct:d=>{const r=recs()[+d.j];if(!r||!r.act)return;const a=r.act;const day=S.plan.days.find(x=>x.id===a.day);if(!day)return;if(a.k==='addSet')day.items[a.i].sets+=a.n;else insertItem(day,P(a.ex,a.n,a.lo,a.hi));save();U.keepScroll=true;render();toast(`Added to ${day.name}`);},
stepEdit:d=>{const i=+d.i;const s=i>=0?baseSteps(d.k)[i]:{};openSheet({k:'step',kind:d.k,i,t:s.t,d:s.d,auto:!!s.auto});},
stepSave:()=>{const sh=U.sheet,t=($('#st-t').value||'').trim();if(!t){toast('Add a step name');return;}const list=ensureSteps(sh.kind);const d=($('#st-d').value||'').trim();if(sh.i>=0)Object.assign(list[sh.i],{t,d});else list.push({id:'c'+Date.now().toString(36),t,d});save();closeSheet();U.keepScroll=true;render();},
stepDel:()=>{const sh=U.sheet;ensureSteps(sh.kind).splice(sh.i,1);save();closeSheet();U.keepScroll=true;render();},
stepMove:d=>{const list=ensureSteps(d.k);if(swapIn(list,+d.i,+d.i-1)){delete RT().ord[d.k];save();}U.keepScroll=true;render();},
stepsReset:d=>{if(RT().steps)delete RT().steps[d.k];delete RT().ord[d.k];save();U.keepScroll=true;render();toast('Steps reset');}
});
document.addEventListener('input',e=>{if(e.target.id==='pk-q'){if(U.sheet)U.sheet.q=e.target.value;const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.pk').forEach(r=>{r.style.display=!q||r.dataset.n.includes(q)?'':'none';});document.querySelectorAll('.pkg').forEach(g=>{g.style.display=[...g.querySelectorAll('.pk')].some(r=>r.style.display!=='none')?'':'none';});}});
function countUp(){document.querySelectorAll('#app [data-count]').forEach(el=>{const to=+el.dataset.count;if(!to)return;const t0=performance.now();const step=t=>{const p=Math.min(1,(t-t0)/700);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);};el.textContent='0';requestAnimationFrame(step);});}
