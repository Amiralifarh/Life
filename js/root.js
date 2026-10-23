/* ---------- Root ---------- */
function tabbar(){const T=[['today','Today','sun'],['gym','Gym','gym'],['rout','Routines','moon'],['school','School','book'],['money','Money','wallet']];const idx=T.findIndex(t=>t[0]===U.tab);const from=U.prevTabIdx!=null?U.prevTabIdx:idx;return`<div class="tabwrap"><nav class="tabs card" aria-label="Sections"><span class="tabind" data-to="${idx}" style="--i:${from}"></span>${T.map(([k,n,i])=>`<button class="tab t-${k} ${U.tab===k&&!U.stack.length?'on':''}" data-a="tab" data-t="${k}" aria-current="${U.tab===k?'page':'false'}">${ic(i,24,2)}${n}</button>`).join('')}</nav></div>`;}
function view(){if(U.mode==='lock')return vLock();if(U.mode==='onb')return vOnb();if(U.mode!=='app')return'';const v=curView();
let body;switch(v.v){case'today':body=vToday();break;case'gym':body=vGym();break;case'rout':body=vRout();break;case'school':body=vSchool();break;case'money':body=vSoon(v.v);break;case'schoolItem':body=vSchoolItem(v.id);break;case'syncView':body=vSyncView();break;case'notifView':body=vNotifView();break;case'healthView':body=vHealthView();break;case'routine':body=vRoutine(v.id);break;case'water':body=vWater();break;case'read':body=vRead();break;case'supps':body=vSupps();break;case'wakeplan':body=vWakePlan();break;case'review':body=vReview();break;case'wake':body=U.wk?vWake():vToday();break;case'workout':body=vWorkout();break;case'summary':body=vSummary(v.id);break;case'mm':body=vMM(v);break;case'plan':body=vPlan();break;case'coach':body=vCoach();break;case'dayEdit':body=vDayEdit(v.id);break;case'stepsEdit':body=vStepsEdit(v.id);break;case'settings':body=vSettings();break;default:body=vToday();}
const showTabs=!U.stack.length;return body+(showTabs?tabbar():'');}

/* ---------- Sheets ---------- */
function sheetHTML(){const sh=U.sheet;if(!sh)return'';let b=sheetHTML2(sh)||sheetHTML3(sh)||schoolSheets(sh)||devSheets(sh);
if(sh.k==='set'){const a=S.active,it=a.items[sh.i],e=EX[it.ex];const tg=tgtOf(it,sh.s);const lo=Math.max(1,(tg||it.lo)-3),hi=(tg||it.hi)+3;const reps=range(lo,hi,1);const isT=r=>tg?r===tg:(r>=it.lo&&r<=it.hi);
const fake={...a,items:a.items.map((x,j)=>j===sh.i?{...x,logged:x.logged.concat(sh.s<x.logged.length?[]:[{w:0,r:0}])}:x)};const nx=sh.s<it.logged.length?null:afterSet(fake,sh.i);
const lbl2=sh.s<it.logged.length?'Save set':nx&&nx.go!=null&&nx.rest===0?`Log set · then ${esc(EX[a.items[nx.go].ex].name)}`:nx&&nx.rest?`Log set · rest ${mmss(nx.rest)} starts`:'Log set';
b=`<div class="flex between" style="align-items:baseline;gap:10px"><h2>Set ${sh.s+1} · ${esc(e.name)}</h2></div><div class="t2" style="margin-top:-10px">${esc(lastLine(it))}</div>
${wheel('w',sh.vals,sh.w,e.eq==='w'?'+ lbs':'lbs')}
<div class="flex between" style="gap:8px;flex-wrap:wrap"><div class="t2 b" data-plate>${e.eq==='b'?plates(sh.w):e.eq==='d'?'Per dumbbell':e.eq==='w'?(sh.w?'Added to your bodyweight':'Bodyweight only'):e.eq==='z'?'EZ bar, total':'Stack weight'}</div><div class="flex" style="gap:6px"><button class="qbtn" data-a="wq" data-d="-1">-${EQ[e.eq].step}</button><button class="qbtn" data-a="wq" data-d="0">Same</button><button class="qbtn" data-a="wq" data-d="1">+${EQ[e.eq].step}</button></div></div>
<div class="col gap8"><div class="flex between t2 b"><span>Reps${it.perLeg?' per leg':''}</span><span>${tg?`Pyramid target ${tg}`:`Target ${it.lo===it.hi?it.lo:it.lo+' to '+it.hi}`}</span></div><div class="chips" role="radiogroup" aria-label="Reps">${reps.map(r=>`<button class="chip ${r===sh.r?'on':isT(r)?'tgt':''}" role="radio" aria-checked="${r===sh.r}" data-a="rep" data-r="${r}">${r}</button>`).join('')}</div></div>
<div class="col gap8"><div class="t2 b">How did it feel?</div><div class="seg" style="grid-template-columns:repeat(4,minmax(0,1fr))" role="radiogroup">${[['easy','Easy','3+ left'],['good','Good','1 to 2 left'],['hard','Hard','0 left'],['failed','Failed','missed']].map(([k,n,s2])=>`<button class="${sh.e===k?'on':''}" role="radio" aria-checked="${sh.e===k}" data-a="eff" data-e="${k}">${n}<small>${s2}</small></button>`).join('')}</div></div>
<button class="btn" data-a="logSet">${lbl2}</button>${sh.s<it.logged.length?`<button class="link" style="align-self:center;color:var(--amber)" data-a="delSet">Delete this set</button>`:''}`;}
if(sh.k==='weigh'){b=`<h2>Weekly weigh-in</h2><div class="t2" style="margin-top:-10px">Same time each week: after waking, before eating.</div><div class="t1">Weight</div><div class="wheels">${wheel('kgI',range(40,180,1),sh.kgI,'')}${wheel('kgD',range(0,9,1),sh.kgD,'kg',v=>'.'+v)}</div><div class="t1">Waist</div>${wheel('waist',['Skip',...range(55,150,1)],sh.waist,'cm')}<button class="btn" data-a="weighSave">Save weigh-in</button>`;}
if(sh.k==='steps'){b=`<h2>Steps today</h2><div class="t2" style="margin-top:-10px">Copy today’s number from the Health app. Automatic syncing comes with the sync build.</div>${wheel('n',sh.vals,sh.n,'steps',v=>nf(v))}<button class="btn" data-a="stepsSave">Save steps</button>`;}
if(sh.k==='swap'){const it=S.active.items[sh.i];const opts=[it.orig,...EX[it.orig].alts].filter((x,j,arr)=>arr.indexOf(x)===j&&x!==it.ex);b=`<h2>Swap ${esc(EX[it.ex].name)}</h2><div class="t2" style="margin-top:-10px">Same muscles, for when the equipment is taken. Just for today.</div><div class="card col">${opts.map(x=>`<button class="row" data-a="swapPick" data-x="${x}"><div class="grow"><div class="t1">${esc(EX[x].name)}${x===it.orig?' <span class="tag">Planned</span>':''}</div><div class="t2">${EX[x].p.map(m=>MUS[m]).join(', ')}</div></div>${ic('chev',16)}</button>`).join('')}</div>`;}
if(sh.k==='menu'){b=`<h2>Workout options</h2><div class="card col"><button class="row" data-a="shortSession">${tile('gym','clock','sm')}<div class="grow"><div class="t1">Short on time</div><div class="t2">Keep the 4 most important exercises</div></div></button><button class="row" data-a="discard">${tile('warn','skip','sm')}<div class="grow"><div class="t1">Discard workout</div><div class="t2">Nothing from this session is saved</div></div></button></div><button class="btn soft" data-a="close">Cancel</button>`;}
if(sh.k==='confirm'){b=`<h2>${esc(sh.title)}</h2><div class="t3">${esc(sh.text)}</div><button class="btn" style="background:linear-gradient(135deg,#C2410C,#9A3412)" data-a="confirmYes">${esc(sh.yes)}</button><button class="btn soft" data-a="close">Cancel</button>`;}
if(sh.k==='height'){b=`<h2>Height</h2>${wheel('h',range(140,210,1),sh.h,'cm')}<button class="btn" data-a="heightSave">Save</button>`;}
if(sh.k==='base'){b=`<h2>Starting step average</h2><div class="t2" style="margin-top:-10px">Your goal grows from here by 1,000 every 2 weeks, up to 10,000.</div>${wheel('n',range(2000,15000,500),sh.n,'steps',v=>nf(v))}<button class="btn" data-a="baseSave">Save</button>`;}
if(sh.k==='pass'){b=`<h2 class="center">${sh.stage===0?'New passcode':'Enter it again'}</h2><div class="t2 center">${sh.err?`<span class="warn">${esc(sh.err)}</span>`:'6 digits'}</div><div id="pad" class="col" style="gap:24px">${keypad()}</div>`;}
return`<div class="scrim" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${b}</div>`;}
function openSheet(sh){U.sheet=sh;U.entry='';renderSheet();}
function closeSheet(){const root=$('#sheets');const old=root.firstElementChild&&!matchMedia('(prefers-reduced-motion: reduce)').matches?root.cloneNode(true):null;U.sheet=null;renderSheet();if(old){old.removeAttribute('id');old.classList.add('closing');document.body.appendChild(old);setTimeout(()=>old.remove(),260);}}
function renderSheet(){const root=$('#sheets');root.innerHTML=sheetHTML();initWheels(root);}

/* ---------- Wheels ---------- */
function initWheels(root){root.querySelectorAll('.wheel').forEach(w=>{const idx=+w.dataset.idx;const items=w.querySelectorAll('.wi');const mark=i=>{items.forEach((el,k)=>{el.classList.toggle('on',k===i);el.setAttribute('aria-selected',k===i);});};
requestAnimationFrame(()=>{w.scrollTop=idx*44;});mark(idx);w.dataset.cur=idx;
w.addEventListener('scroll',()=>{const i=clamp(Math.round(w.scrollTop/44),0,items.length-1);if(i!==+w.dataset.cur){w.dataset.cur=i;mark(i);onWheel(w.dataset.wheel,i);}},{passive:true});
w.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const i=clamp(+w.dataset.cur+(e.key==='ArrowDown'?1:-1),0,items.length-1);w.scrollTo({top:i*44,behavior:'smooth'});}});});}
function wheelVals(name){if(U.mode==='onb'){return({h:range(140,210,1),kgI:range(40,180,1),kgD:range(0,9,1),waist:['Skip',...range(55,150,1)],steps:range(2000,15000,500)})[name];}
const sh=U.sheet;if(sh.wv&&sh.wv[name])return sh.wv[name];if(name==='w'||name==='n')return sh.vals;return({h:range(140,210,1),kgI:range(40,180,1),kgD:range(0,9,1),waist:['Skip',...range(55,150,1)]})[name];}
function onWheel(name,i){const v=wheelVals(name)[i];if(U.mode==='onb'){U.onb[name]=v;return;}const sh=U.sheet;if(!sh)return;sh[name]=v;if(sh.k==='item'){const pv=$('[data-pyr]');if(pv)pv.textContent=itemPreview(sh);}
if(sh.k==='set'&&name==='w'){const el=$('[data-plate]');const e=EX[S.active.items[sh.i].ex];if(el&&e.eq==='b')el.textContent=plates(v);if(el&&e.eq==='w')el.textContent=v?'Added to your bodyweight':'Bodyweight only';}}
function scrollWheelTo(name,val){const w=$(`.wheel[data-wheel="${name}"]`);const i=wheelVals(name).indexOf(val);if(w&&i>=0)w.scrollTo({top:i*44,behavior:'smooth'});}

/* ---------- Render ---------- */
function render(){const v=U.mode==='app'?curView():{v:'today'};document.body.dataset.sec=U.mode==='app'?secOf(v):'today';if(v.v!=='wake')camStop();const night=U.mode==='app'&&v.v==='today'&&isEvening();document.documentElement.toggleAttribute('data-night',night);if(night)document.documentElement.dataset.theme='dark';else delete document.documentElement.dataset.theme;const key=U.mode+':'+v.v+':'+(v.id||'');const old=$('#app .scroll');if(old&&U.lastKey)U.scroll[U.lastKey]=old.scrollTop;
const anim=key!==U.lastKey;const TB=['today','gym','rout','school','money'],depth=U.stack.length,ti=TB.indexOf(U.tab);let dir='';
if(U.mode==='app'&&anim&&U.prevNav&&old){if(depth>U.prevNav.d)dir='push';else if(depth<U.prevNav.d)dir='pop';else if(ti!==U.prevNav.t)dir=ti>U.prevNav.t?'right':'left';}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let ghost=null;if(dir&&!reduce){ghost=old.cloneNode(true);ghost.classList.add('navghost','gx-'+dir);ghost.dataset.y=old.scrollTop;}
$('#app').classList.toggle('anim',anim);$('#app').innerHTML=view();if(anim)countUp();
if(ghost){const ns=$('#app .scroll');if(ns)ns.classList.add('in-'+dir);$('#app').appendChild(ghost);ghost.scrollTop=+ghost.dataset.y;setTimeout(()=>ghost.remove(),460);}
U.prevNav=U.mode==='app'?{d:depth,t:ti}:null;
const ind=$('.tabind');if(ind){const to=+ind.dataset.to;requestAnimationFrame(()=>requestAnimationFrame(()=>ind.style.setProperty('--i',to)));U.prevTabIdx=to;}U.pop=null;U.restNew=false;U.expAnim=null;morphLive();const sc=$('#app .scroll');if(sc&&U.scroll[key]&&key===U.lastKey)sc.scrollTop=U.scroll[key];else if(sc&&U.scroll[key]&&U.keepScroll)sc.scrollTop=U.scroll[key];U.lastKey=key;U.keepScroll=false;initWheels($('#app'));}

/* ---------- Audio ---------- */
let AC=null;function audioReady(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){}}
function beep(){try{if(!AC)return;[0,.22].forEach(t=>{const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=880;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.0001,AC.currentTime+t);g.gain.exponentialRampToValueAtTime(.25,AC.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+t+.18);o.start(AC.currentTime+t);o.stop(AC.currentTime+t+.2);});if(navigator.vibrate)navigator.vibrate([120,80,120]);}catch(e){}}

/* ---------- Actions ---------- */
async function onKey(k){if(k==='del'){U.entry=U.entry.slice(0,-1);}else if(U.entry.length<6)U.entry+=k;
const pad=$('#pad');if(pad){pad.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i<U.entry.length));}
if(U.entry.length<6)return;const code=U.entry;
if(U.mode==='lock'){const m=$('#lockmsg');if(m)m.textContent='Unlocking…';try{await openVault(code);U.mode='app';U.err='';U.entry='';afterUnlock();}catch(e){U.entry='';U.err='Wrong passcode. Try again.';render();const p=$('#pad');if(p)p.classList.add('shake');}return;}
if(U.mode==='onb'){const o=U.onb;if(o.step===1){o.pass=code;o.step=2;U.entry='';U.err='';render();}else if(o.step===2){if(code===o.pass){if(o.join){await finishJoin(code);return;}o.step=3;U.entry='';U.err='';render();}else{o.step=1;o.pass=null;U.entry='';U.err='Those didn’t match. Start again.';render();$('#pad')?.classList.add('shake');}}return;}
if(U.sheet&&U.sheet.k==='pass'){const sh=U.sheet;if(sh.stage===0){sh.p1=code;sh.stage=1;sh.err='';U.entry='';renderSheet();}else if(code===sh.p1){U.entry='';await createVault(code,true);closeSheet();toast('Passcode changed');}else{sh.stage=0;sh.err='Those didn’t match. Start again.';U.entry='';renderSheet();}}}
function afterUnlock(){ensureSC().then(()=>syncPull()).then(()=>{if(SCH().feed&&Date.now()-(SCH().last||0)>6*3600000)feedRefresh();notifPrune();}).catch(()=>{});const m=location.hash.match(/steps=(\d+)/);if(m){S.steps[iso()]=+m[1];save();try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}toast(`Steps updated: ${nf(+m[1])}`);}
if(S.active&&!U.stack.length){U.tab='gym';U.stack=[{v:'workout'}];render();return;}
if(/#(rout-n|school)/.test(location.hash)){const h=location.hash;try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}if(h.includes('rout-n')){U.tab='rout';U.stack=[{v:'routine',id:'n'}];}else{U.tab='school';U.stack=[];}render();return;}
if(/#wake/.test(location.hash)||wakeDue()){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}A.wakeStart();return;}
render();}
function lock(){camStop();saveNow().then(()=>{S=null;KEY=null;U.sc=null;U.showPhrase=false;U.mode='lock';U.entry='';U.err='';U.sheet=null;U.stack=[];renderSheet();render();});}
function openSetSheet(i,s){const a=S.active,it=a.items[i];const done=it.logged[s];const w=done?done.w:planW(a,it,s);const r=done?done.r:planR(it,s,w);const vals=wRange(it.ex);const wv=vals.includes(w)?w:roundW(it.ex,w);openSheet({k:'set',i,s,w:wv,r,e:done?done.e:'good',vals,orig:wv});}
const A={
key:d=>onKey(d.k),
onbBack:()=>{U.onb.step=0;U.onb.join=null;render();},
onbNext:()=>{U.onb.step++;U.err='';render();},
onbFinish:async()=>{const o=U.onb;S=freshState({h:o.h,kg:o.kgI+o.kgD/10,waist:o.waist==='Skip'?null:o.waist,steps:o.steps});await createVault(o.pass);o.pass=null;o.step=5;render();try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist();}catch(e){}},
onbDone:()=>{U.mode='app';U.tab='today';render();},
tab:d=>{U.tab=d.t;U.stack=[];U.exp=null;render();const sc=$('#app .scroll');if(sc)sc.scrollTop=0;},
push:d=>{U.mmMode=null;U.mSel=null;U.undoDel=null;U.stack.push({v:d.v,id:d.id,mode:d.mode});render();const sc=$('#app .scroll');if(sc)sc.scrollTop=0;},
back:()=>{U.stack.pop();U.keepScroll=true;render();},
goGym:()=>{U.tab='gym';U.stack=[];render();},
startWorkout:d=>{audioReady();S.active=buildSession(d.t);U.exp=null;save();U.stack=[{v:'workout'}];render();},
openWorkout:()=>{U.tab='gym';U.exp=null;U.stack=[{v:'workout'}];render();},
woMenu:()=>openSheet({k:'menu'}),
expand:d=>{U.exp=+d.i;U.keepScroll=true;render();},
openSet:d=>{audioReady();openSetSheet(+d.i,+d.s);},
wq:d=>{const sh=U.sheet;const step=EQ[EX[S.active.items[sh.i].ex].eq].step;const v=+d.d===0?sh.orig:clamp(sh.w+(+d.d)*step,sh.vals[0],sh.vals[sh.vals.length-1]);scrollWheelTo('w',v);},
rep:d=>{U.sheet.r=+d.r;document.querySelectorAll('.chip').forEach(c=>{const on=+c.dataset.r===U.sheet.r;c.classList.toggle('on',on);c.setAttribute('aria-checked',on);});},
eff:d=>{U.sheet.e=d.e;document.querySelectorAll('[data-a="eff"]').forEach(c=>{const on=c.dataset.e===d.e;c.classList.toggle('on',on);c.setAttribute('aria-checked',on);});},
logSet:()=>{const sh=U.sheet,a=S.active,it=a.items[sh.i];const rec={w:sh.w,r:sh.r,e:sh.e,t:Date.now()};
if(sh.s<it.logged.length){rec.t=it.logged[sh.s].t;it.logged[sh.s]=rec;}else{it.logged.push(rec);const more=curIdx(a)>=0;if(more){a.restFor=restOf(it.ex);a.restUntil=Date.now()+a.restFor*1000;}}
if(it.logged.length>=it.planned)U.exp=null;save();U.sheet=null;renderSheet();U.keepScroll=true;render();},
delSet:()=>{const sh=U.sheet,it=S.active.items[sh.i];it.logged.splice(sh.s,1);save();closeSheet();U.keepScroll=true;render();},
addSet:d=>{S.active.items[+d.i].planned++;save();U.exp=+d.i;U.keepScroll=true;render();},
skip:d=>{const it=S.active.items[+d.i];if(it.logged.length)it.planned=it.logged.length;else it.skipped=true;U.exp=null;save();U.keepScroll=true;render();},
unskip:d=>{const it=S.active.items[+d.i];it.skipped=false;it.cut=false;U.exp=+d.i;save();U.keepScroll=true;render();},
swapOpen:d=>openSheet({k:'swap',i:+d.i}),
swapPick:d=>{const it=S.active.items[U.sheet.i];it.ex=d.x;save();closeSheet();U.keepScroll=true;render();},
shortSession:()=>{const a=S.active;let keep=0;a.items.forEach(it=>{if(it.skipped)return;if(it.logged.length||keep<4){keep++;return;}it.skipped=true;it.cut=true;});save();closeSheet();toast('Trimmed to the key exercises');render();},
discard:()=>openSheet({k:'confirm',title:'Discard this workout?',text:'Nothing from this session will be saved.',yes:'Discard',then:'discard'}),
restSkip:()=>{S.active.restUntil=0;save();U.keepScroll=true;render();},
restAdd:()=>{S.active.restUntil+=30000;S.active.restFor+=30;save();},
endWorkout:()=>{const a=S.active;if(!a.items.some(it=>it.logged.length)){A.discard();return;}const left=a.items.filter(it=>!it.skipped&&it.logged.length<it.planned).length;
if(left)openSheet({k:'confirm',title:'End workout?',text:`${plural(left,'exercise')} not finished. Skipped ones move to the top of your next ${PLAN[a.type].name}.`,yes:'End workout',then:'finish'});else doFinish();},
confirmYes:()=>{const t=U.sheet.then;closeSheet();if(t==='discard'){S.active=null;save();U.stack=[];U.tab='gym';render();}if(t==='finish')doFinish();if(t==='erase'){try{localStorage.removeItem(VK);}catch(e){}location.reload();}if(t==='import'){lsSet(VK,U.pendingImport);U.pendingImport=null;lock();toast('Backup restored. Enter its passcode.');}},
doneSummary:()=>{U.justDone=false;U.stack=[];U.tab='gym';render();},
mTap:d=>{U.mSel=U.mSel===d.m?null:d.m;U.keepScroll=true;render();},
mmMode:d=>{U.mmMode=d.m;U.keepScroll=true;render();},
stepsOpen:()=>{const vals=range(0,40000,100);const cur=stepsToday();openSheet({k:'steps',vals,n:vals.includes(cur)?cur:Math.round(cur/100)*100});},
stepsSave:()=>{S.steps[iso()]=U.sheet.n;save();closeSheet();render();},
weighOpen:()=>{const l=lastWeigh(),w=lastWaist();const kg=l?l.kg:75;openSheet({k:'weigh',kgI:Math.floor(kg),kgD:Math.round((kg-Math.floor(kg))*10)%10,waist:w?w.waist:'Skip'});},
weighSave:()=>{const sh=U.sheet;const rec={date:iso(),kg:sh.kgI+sh.kgD/10,waist:sh.waist==='Skip'?null:sh.waist};const l=lastWeigh();if(l&&l.date===rec.date)S.weighIns[S.weighIns.length-1]=rec;else S.weighIns.push(rec);save();closeSheet();render();toast('Weigh-in saved');},
heightOpen:()=>openSheet({k:'height',h:S.profile.height}),
heightSave:()=>{S.profile.height=U.sheet.h;save();closeSheet();render();},
baseOpen:()=>openSheet({k:'base',n:S.profile.stepBase}),
baseSave:()=>{S.profile.stepBase=U.sheet.n;save();closeSheet();render();},
lockNow:()=>lock(),
passOpen:()=>openSheet({k:'pass',stage:0}),
export:async()=>{await saveNow();const data=lsGet(VK);const name=`life-backup-${iso()}.json`;try{const file=new File([data],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Life backup'});return;}}catch(e){if(e&&e.name==='AbortError')return;}
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();a.remove();},
importPick:()=>$('#importIn')?.click(),
eraseOpen:()=>openSheet({k:'confirm',title:'Erase everything?',text:'All workouts, weigh-ins and steps on this device will be deleted. Export a backup first if you might want them.',yes:'Erase everything',then:'erase'}),
close:()=>closeSheet()
};
function doFinish(){const id=finishWorkout();U.justDone=true;U.exp=null;U.stack=[{v:'summary',id}];U.tab='gym';render();}
document.addEventListener('click',e=>{if(Date.now()-(U.noClick||0)<350)return;const el=e.target.closest('[data-a]');if(!el)return;const f=A[el.dataset.a];if(f){e.preventDefault();f(el.dataset,el,e);}});
document.addEventListener('change',e=>{if(e.target.id==='importIn'){const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const v=JSON.parse(t);if(!v.salt||!v.ct)throw 0;U.pendingImport=t;openSheet({k:'confirm',title:'Restore this backup?',text:'It replaces everything on this device. You’ll need the passcode that backup was made with.',yes:'Restore backup',then:'import'});}catch(err){toast('That file isn’t a Life backup');}});}});
