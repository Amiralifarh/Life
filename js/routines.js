/* ---------- Routines: data helpers ---------- */
const MIN=60000;
const tfmt=(m,ap)=>{m=((Math.round(m)%1440)+1440)%1440;const h=Math.floor(m/60);return`${h%12||12}:${pad2(m%60)}${ap?(h<12?' am':' pm'):''}`;};
const minOf=d=>d.getHours()*60+d.getMinutes();
const addDays=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const RT=()=>S.rt;
const peekDay=k=>S.days[k]||null;
function dayRec(k=iso()){return S.days[k]||(S.days[k]={m:{},n:{},why:{},water:0,pages:0,supp:{}});}
const isEvening=()=>{const h=new Date().getHours();return h>=18||h<4;};
const DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* Wake-up plan: shift 15 min every 3 days, weekdays only */
function pausedBefore(date){let n=0;RT().wake.pauses.forEach(p=>{const a=parseISO(p.from),b=parseISO(p.to);const e=Math.min(date,b);if(e>a)n+=Math.round((e-a)/DAY);});return n;}
function wakeSteps(date){const w=RT().wake;if(!w.start)return 0;const raw=Math.round((dayStart(date)-parseISO(w.start))/DAY);const max=Math.ceil(Math.max(0,w.from-w.target)/15);return clamp(Math.floor((raw-pausedBefore(dayStart(date)))/3),0,max);}
function wakeMin(date){const w=RT().wake;if(!w.start)return null;const dw=date.getDay();if(dw===0||dw===6)return null;if(w.from<=w.target)return w.target;return Math.max(w.target,w.from-15*wakeSteps(date));}
function wakeInfo(){const w=RT().wake;if(!w.start)return null;const steps=Math.ceil(Math.max(0,w.from-w.target)/15);const total=Math.max(1,Math.ceil(steps*3/7));const t=dayStart(new Date());const raw=Math.round((t-parseISO(w.start))/DAY)-pausedBefore(t);const wk=Math.floor(Math.max(0,raw)/7)+1;return{total,wk:Math.min(wk,total),holding:wakeSteps(t)>=steps};}
function wakeLabel(){const i=wakeInfo();if(!i)return'Wake-up plan';const w=RT().wake;return i.holding?`Holding ${tfmt(w.target)}`:`Week ${i.wk} of ${i.total} toward ${tfmt(w.target)}`;}
function alarmNext(){const now=new Date();for(let k=0;k<3;k++){const d=addDays(now,k),m=wakeMin(d);if(m==null)continue;const at=new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(m/60),m%60);if(at>now&&at-now<20*3600000)return{at,min:m};}return null;}
function nextWakeMin(){const now=new Date();for(let k=(now.getHours()<4?0:1);k<6;k++){const m=wakeMin(addDays(now,k));if(m!=null)return m;}return RT().wake.target;}
/* Bedtime = 7.5 h before the wake time, never later than 12:30 am */
function bedMin(tg){const rel=((tg-450)%1440+1440)%1440;let b=rel<720?rel+1440:rel;return Math.min(b,1470)%1440;}
function nightStart(){return((bedMin(nextWakeMin())-75-(RT().nightEarly||0))%1440+1440)%1440;}
function sleepCalc(){const al=alarmNext();let a=new Date(Date.now()+15*MIN);a=new Date(Math.ceil(a.getTime()/(5*MIN))*5*MIN);if(!al)return{al:null,asleep:a};return{al,asleep:a,mins:Math.max(0,Math.round((al.at-a)/MIN))};}
const wakeOnTime=(r,t)=>!!(r&&r.wake&&minOf(new Date(r.wake.at))<=t+10);

/* Steps of the morning and night routines */
const M_STEPS=[{id:'wake',t:'Wake-up task',d:'Brightest lights, then the task',auto:1},{id:'bed',t:'Make your bed'},{id:'snack',t:'Snack or coffee',d:'Coffee before the gym'}];
const N_STEPS=[{id:'bag',t:'Pack your gym bag'},{id:'lunch',t:'Make lunch'},{id:'clothes',t:'Lay out work clothes'},{id:'face',t:'Face wash routine'},{id:'teeth',t:'Brush teeth'},{id:'read',t:'Read',d:'Log the page you reach',read:1}];
function stepsOf(kind){let base=baseSteps(kind).slice();const when=kind==='m'?'morning':'night';
const sp=RT().supps.filter(s=>s.when===when).map(s=>({id:'supp:'+s.id,t:`Take ${s.name.toLowerCase()}`,d:s.dose||'',supp:s.id}));
if(kind==='n'){const i=base.findIndex(x=>x.read);base.splice(i,0,...sp);}else base.push(...sp);
const ord=RT().ord[kind]||{};const mv=base.filter(x=>!x.auto&&!x.read);
if(mv.length&&mv.every(x=>ord[x.id]&&ord[x.id].n>=3)){mv.sort((a,b)=>ord[a.id].s/ord[a.id].n-ord[b.id].s/ord[b.id].n);let k=0;base=base.map(x=>(x.auto||x.read)?x:mv[k++]);}
return base;}
function stState(kind,st,k=iso()){const r=peekDay(k);if(!r)return null;if(st.supp&&r.supp[st.supp])return'd';return r[kind][st.id]||null;}
function setStep(kind,st,val,why){const r=dayRec();const had=stState(kind,st);
if(st.supp){const sp=RT().supps.find(s=>s.id===st.supp);if(val==='d'){if(!r.supp[st.supp]){r.supp[st.supp]=true;if(sp&&sp.stock!=null)sp.stock=Math.max(0,sp.stock-1);}delete r[kind][st.id];}else{if(r.supp[st.supp]){delete r.supp[st.supp];if(sp&&sp.stock!=null)sp.stock++;}if(val==='s')r[kind][st.id]='s';else delete r[kind][st.id];}}
else{if(val)r[kind][st.id]=val;else delete r[kind][st.id];}
if(val==='s'&&why)r.why[st.id]=why;else if(val!=='s')delete r.why[st.id];
if(val==='d'&&had!=='d'){const n=stepsOf(kind).filter(x=>x.id!==st.id&&stState(kind,x)==='d').length+1;const o=RT().ord[kind]=RT().ord[kind]||{};const e=o[st.id]=o[st.id]||{s:0,n:0};e.s+=n;e.n++;}
save();}
function rprog(kind,k=iso()){const sts=stepsOf(kind);let done=0,skip=0;sts.forEach(s=>{const v=stState(kind,s,k);if(v==='d')done++;else if(v==='s')skip++;});return{done,skip,total:sts.length,left:sts.length-done-skip};}
const nextStep=kind=>stepsOf(kind).find(s=>!stState(kind,s))||null;
const routTotals=()=>{const a=rprog('m'),b=rprog('n');return{done:a.done+b.done,total:a.total+b.total};};

/* Water */
const kgNow=()=>{const l=lastWeigh();return l?l.kg:75;};
function isGymDay(){const t=new Date(),dw=t.getDay();return trainedOn(t)||!!S.active||(dw>=1&&dw<=5&&!restDay()&&sessionsThisWeek().length<4);}
const waterTarget=()=>Math.round((kgNow()*30+(isGymDay()?500:0))/250)*250;
const bottleN=()=>Math.max(1,Math.ceil(waterTarget()/RT().bottleMl));
const waterDone=(k=iso())=>{const r=peekDay(k);return r?r.water:0;};

/* Reading */
const curBook=()=>[...RT().books].reverse().find(b=>!b.done)||null;
function bookRate(b){const cut=iso(addDays(new Date(),-13));const rec=(b.log||[]).filter(x=>x.d>=cut);if(rec.length<2)return null;const days=Math.max(1,Math.round((dayStart(new Date())-parseISO(rec[0].d))/DAY)+1);return rec.reduce((a,x)=>a+x.p,0)/days;}
const readOk=k=>{const r=peekDay(k);return!!(r&&(r.pages>0||r.n.read==='d'));};
const nightOk=k=>{const p=rprog('n',k);return p.total>0&&p.left===0&&p.done>=Math.ceil(p.total*.6);};
/* Forgiving streak: one isolated miss pauses it, two in a row reset it */
function streakOf(ok){const t=dayStart(new Date());const at=i=>iso(addDays(t,-i));let n=ok(at(0))?1:0,since=99,paused=false;
for(let i=1;i<400;i++){if(ok(at(i))){n++;since++;continue;}
const newer=i===1?true:ok(at(i-1)),older=ok(at(i+1));
if(newer&&older&&since>=7){if(i===1&&!ok(at(0)))paused=true;since=0;continue;}break;}
return{n,paused};}

/* Weekly review numbers */
function weekStats(mon){const today=dayStart(new Date());const ds=[0,1,2,3,4,5,6].map(i=>addDays(mon,i)).filter(d=>d<=today);
const sess=S.sessions.filter(s=>s.start>=mon.getTime()&&s.start<mon.getTime()+7*DAY);
const M={wake:{t:0,k:0},night:{t:0,k:0},read:{t:0,k:0},water:{t:0,k:0},steps:{t:0,k:0}};
const late=new Date().getHours()>=12;let pages=0;
ds.forEach(d=>{const k=iso(d),past=d<today,r=peekDay(k);const add=(m,ok,applies=true)=>{if(!applies)return;if(past||ok){M[m].t++;if(ok)M[m].k++;}};
const t=wakeMin(d);if(t!=null){const ok=wakeOnTime(r,t);if(past||ok||late){M.wake.t++;if(ok)M.wake.k++;}}
add('night',nightOk(k));add('read',readOk(k));
add('water',!!r&&r.water>=(r.wgoal||bottleN())&&r.water>0);add('steps',(S.steps[k]||0)>=stepGoal()&&(S.steps[k]||0)>0);if(r)pages+=r.pages||0;});
return{n:ds.length,workouts:sess.length,prNames:sess.flatMap(s=>s.summary?s.summary.prs:[]),M,pages};}
function reviewData(){const mon=mondayOf(new Date());const st=weekStats(mon);const c=[];
c.push({key:'gym',frac:st.workouts/4,t:`${st.workouts} of 4 workouts`,d:st.prNames.length?`New best: ${st.prNames[0]}${st.prNames.length>1?` and ${st.prNames.length-1} more`:''}`:'Every session counts',i:'gym',sec:'gym',has:true});
const wt=wakeMin(addDays(mon,4));const m=st.M;
if(m.wake.t)c.push({key:'wake',frac:m.wake.k/m.wake.t,t:`Up by ${tfmt(wt!=null?wt:RT().wake.target)} on ${m.wake.k} of ${m.wake.t} days`,d:m.wake.k/m.wake.t>=.8?'Right on the plan':'Close. The shift keeps going',i:'sun',sec:'rout',fix:1});
if(m.night.t)c.push({key:'night',frac:m.night.k/m.night.t,t:`Night routine ${m.night.k} of ${m.night.t} nights`,d:'Every step handled',i:'moon',sec:'rout',fix:1});
if(m.read.t)c.push({key:'read',frac:m.read.k/m.read.t,t:`Read ${m.read.k} of ${m.read.t} nights`,d:st.pages?`${st.pages} pages this week`:'Pages add up fast',i:'book',sec:'warn',fix:1});
if(m.water.t)c.push({key:'water',frac:m.water.k/m.water.t,t:`Water goal ${m.water.k} of ${m.water.t} days`,d:'Hydration made easy',i:'drop',sec:'today',fix:1});
if(m.steps.t)c.push({key:'steps',frac:m.steps.k/m.steps.t,t:`Steps goal ${m.steps.k} of ${m.steps.t} days`,d:`Goal is ${nf(stepGoal())}`,i:'walk',sec:'today'});
const wins=c.filter(x=>x.frac>=.6).sort((a,b)=>b.frac-a.frac).slice(0,3);
const fixes=c.filter(x=>x.fix&&x.frac<.7).sort((a,b)=>a.frac-b.frac);
return{mon,st,wins,fix:fixes[0]||null,any:c.some(x=>x.frac>0)};}
const FIXTXT={wake:'Hold the wake target steady for a week?',night:'Start the night routine 15 min earlier?',read:'Move the social media block to 9:30 pm?',water:'Try a different bottle size?'};
function todayWins(){const w=[];const dd=peekDay(iso());const d=new Date();
if(trainedOn(d)){const s=S.sessions[S.sessions.length-1];const n=s.summary?s.summary.prs.length:0;w.push({sec:'gym',t:`${PLAN[s.type].name} done${n?`, ${plural(n,'PR')}`:''}`});}
if(dd&&dd.wake){const t=wakeMin(d);w.push({sec:'rout',t:`Up at ${tfmt(minOf(new Date(dd.wake.at)),true)}${t!=null&&wakeOnTime(dd,t)?', on target':''}`});}
if(rprog('m').left===0&&rprog('m').done>0)w.push({sec:'rout',t:'Morning routine done'});
if(waterDone()>=bottleN())w.push({sec:'today',t:`Water goal hit, ${bottleN()} bottles`});
if(stepsToday()>=stepGoal())w.push({sec:'today',t:`${nf(stepsToday())} steps`});
if(dd&&dd.pages>0)w.push({sec:'warn',t:`Read ${plural(dd.pages,'page')}`});
SCH().items.forEach(it=>{const x=(it.studied||[]).find(y=>y.d===iso());if(x)w.push({sec:'school',t:`${x.min} min ${it.kind==='exam'?'exam':it.kind} study`});});
return w.slice(0,4);}
