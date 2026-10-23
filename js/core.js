'use strict';
const VK='life.vault.v1';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pad2=n=>String(n).padStart(2,'0');
const iso=(d=new Date())=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const parseISO=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const DAY=86400000;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dayStart=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
const mondayOf=d=>{const x=dayStart(d);x.setDate(x.getDate()-((x.getDay()+6)%7));return x;};
const fmtDay=d=>d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
const fmtLong=d=>d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
const mmss=s=>{s=Math.max(0,Math.round(s));return `${Math.floor(s/60)}:${pad2(s%60)}`;};
const dur=ms=>{const m=Math.max(1,Math.round(ms/60000));return m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m}m`;};
const nf=n=>Math.round(n).toLocaleString('en-US');
const range=(a,b,s)=>{const o=[];for(let v=a;v<=b+1e-9;v+=s)o.push(Math.round(v*10)/10);return o;};
const plural=(n,w)=>`${n} ${w}${n===1?'':'s'}`;

const IC={
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
gym:'<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M6.5 17A2.5 2.5 0 0 0 4 19.5 2.5 2.5 0 0 0 6.5 22H20v-5"/>',
wallet:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>',
spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
check:'<path d="M5 12l5 5L20 7"/>',
up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
right:'<path d="M5 12h14M13 6l6 6-6 6"/>',
chev:'<path d="M9 6l6 6-6 6"/>',
back:'<path d="M15 6l-6 6 6 6"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
scale:'<rect x="3" y="4" width="18" height="16" rx="4"/><path d="M8 9a5 5 0 0 1 8 0M12 9l1.5 2"/>',
walk:'<circle cx="13" cy="4" r="2"/><path d="M9 22l2-6 3 3v3M7 12l3-4 4 1 2 3h3M10 8l-1 6"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
swap:'<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
skip:'<path d="M5 5l10 7-10 7zM19 5v14"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
body:'<circle cx="12" cy="4.5" r="2.5"/><path d="M6 9h12M12 9v6M12 15l-3 6M12 15l3 6"/>',
list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
share:'<path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
drop:'<path d="M12 3s6.5 6.6 6.5 11.2a6.5 6.5 0 0 1-13 0C5.5 9.6 12 3 12 3z"/>',
pill:'<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-40 12 12)"/><path d="M9.8 8.2l5.8 7.6"/>',
camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'
};
const ic=(n,s=20,w=2.2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const tile=(sec,icon,cls='')=>`<div class="tile tg-${sec} ${cls}">${ic(icon,cls.includes('sm')?15:18)}</div>`;

/* Muscles */
const MUS={chest_up:'Upper chest',chest_mid:'Middle chest',chest_low:'Lower chest',tri_med:'Triceps medial head',abs_low:'Lower abs',delt_front:'Front delts',delt_side:'Side delts',delt_rear:'Rear delts',trap_up:'Upper traps',trap_mid:'Mid traps',trap_low:'Lower traps',lats:'Lats',teres:'Teres',erector:'Lower back',bi_long:'Biceps long head',bi_short:'Biceps short head',brachialis:'Brachialis',tri_long:'Triceps long head',tri_lat:'Triceps lateral head',forearm:'Forearms',abs:'Upper abs',obliques:'Obliques',serratus:'Serratus',glute_max:'Glute max',glute_med:'Glute med',quad_rf:'Rectus femoris',quad_lat:'Outer quad',quad_med:'Inner quad',adductor:'Adductors',ham_bf:'Outer hamstring',ham_semi:'Inner hamstring',calf_lat:'Outer calf',calf_med:'Inner calf',soleus:'Soleus',tibialis:'Shins'};
const SHORT={chest_up:'Upper',chest_mid:'Middle',chest_low:'Lower',tri_med:'Triceps medial',abs_low:'Lower abs',delt_front:'Front',delt_side:'Side',delt_rear:'Rear',lats:'Lats',trap_mid:'Mid traps',trap_low:'Lower traps',teres:'Teres',erector:'Lower back',bi_long:'Biceps long',bi_short:'Biceps short',brachialis:'Brachialis',tri_long:'Triceps long',tri_lat:'Triceps lateral',abs:'Upper abs',obliques:'Obliques',glute_max:'Max',glute_med:'Med',quad_rf:'Middle',quad_lat:'Outer',quad_med:'Inner',ham_bf:'Outer',ham_semi:'Inner',calf_lat:'Outer',calf_med:'Inner',soleus:'Soleus'};
const GROUPS=[['Chest',['chest_up','chest_mid','chest_low']],['Shoulders',['delt_front','delt_side','delt_rear']],['Back',['lats','trap_mid','trap_low','teres','erector']],['Arms',['bi_long','bi_short','brachialis','tri_long','tri_lat','tri_med']],['Core',['abs','abs_low','obliques']],['Glutes',['glute_max','glute_med']],['Quads',['quad_rf','quad_lat','quad_med']],['Hamstrings',['ham_bf','ham_semi']],['Calves',['calf_lat','calf_med','soleus']]];

/* Exercise library: equip b=barbell d=dumbbell c=cable m=machine w=bodyweight(+added) */
const E=(name,eq,cmp,p,s,alts,start,lower,max)=>({name,eq,cmp,p,s,alts,start,lower:!!lower,max});
const EX={
incline_bb:E('Incline barbell press','b',1,['chest_up','delt_front'],['tri_lat','tri_long','chest_mid'],['incline_db','bb_bench'],95),
incline_db:E('Incline DB press','d',1,['chest_up','delt_front'],['tri_lat','tri_long','chest_mid'],['incline_bb','db_flat'],35),
bb_bench:E('Barbell bench press','b',1,['chest_mid'],['delt_front','tri_lat','tri_long','chest_up'],['db_flat','machine_chest'],115),
db_flat:E('DB flat bench press','d',1,['chest_mid'],['delt_front','tri_lat','tri_long','chest_up'],['bb_bench','machine_chest'],40),
machine_chest:E('Chest press machine','m',1,['chest_mid'],['delt_front','tri_lat','chest_up'],['db_flat','bb_bench'],90),
cable_row:E('Seated cable row, close grip','c',1,['lats','trap_mid','teres'],['bi_long','bi_short','brachialis','delt_rear','forearm'],['db_row','machine_row'],90),
db_row:E('One-arm DB row','d',1,['lats','trap_mid','teres'],['bi_long','bi_short','brachialis','delt_rear','forearm'],['cable_row','machine_row'],45),
machine_row:E('Chest-supported row machine','m',1,['trap_mid','lats','teres'],['delt_rear','bi_long','bi_short','brachialis'],['cable_row','db_row'],90),
pulldown_wide:E('Lat pulldown, wide','c',1,['lats','teres'],['bi_long','bi_short','brachialis','trap_low','delt_rear'],['pullup_assist','pulldown_close'],90),
pulldown_close:E('Lat pulldown, reverse close grip','c',1,['lats'],['bi_long','bi_short','brachialis','trap_low'],['pulldown_wide','pullup_assist'],90),
pullup_assist:E('Assisted pull-up machine','m',1,['lats','teres'],['bi_long','bi_short','brachialis','trap_low'],['pulldown_wide','pulldown_close'],50),
lat_raise:E('Side lateral raise','d',0,['delt_side'],['trap_up'],['cable_lat_raise'],15),
cable_lat_raise:E('Cable lateral raise','c',0,['delt_side'],['trap_up'],['lat_raise'],10),
db_curl:E('DB curl','d',0,['bi_long','bi_short'],['brachialis','forearm'],['bb_curl','cable_curl'],25),
bb_curl:E('Barbell curl','b',0,['bi_long','bi_short'],['brachialis','forearm'],['db_curl','cable_curl'],50),
cable_curl:E('Cable curl','c',0,['bi_long','bi_short'],['brachialis','forearm'],['db_curl','bb_curl'],40),
rope_pushdown:E('Rope pushdown','c',0,['tri_lat'],['tri_long'],['bar_pushdown'],40),
bar_pushdown:E('Cable pushdown, bar','c',0,['tri_lat'],['tri_long'],['rope_pushdown'],50),
squat:E('Back squat','b',1,['quad_rf','quad_lat','quad_med','glute_max'],['adductor','erector'],['hack_squat','leg_press'],135,1),
hack_squat:E('Hack squat machine','m',1,['quad_rf','quad_lat','quad_med','glute_max'],['adductor'],['squat','leg_press'],90,1),
rdl:E('Romanian deadlift','b',1,['ham_bf','ham_semi','glute_max'],['erector','adductor','forearm','trap_up'],['db_rdl'],135,1),
db_rdl:E('DB Romanian deadlift','d',1,['ham_bf','ham_semi','glute_max'],['erector','adductor','forearm'],['rdl'],50,1),
leg_press:E('Leg press','m',1,['quad_rf','quad_lat','quad_med','glute_max'],['adductor'],['hack_squat','squat'],180,1,1000),
lying_curl:E('Lying leg curl','m',0,['ham_bf','ham_semi'],['calf_med','calf_lat'],['seated_curl'],70,1),
seated_curl:E('Seated leg curl','m',0,['ham_bf','ham_semi'],['calf_med','calf_lat'],['lying_curl'],80,1),
standing_calf:E('Standing calf raise','m',0,['calf_med','calf_lat'],['soleus'],['single_db_calf','seated_calf'],100,1),
single_db_calf:E('Single-leg DB calf raise','d',0,['calf_med','calf_lat'],['soleus'],['standing_calf'],25,1),
seated_calf:E('Seated calf raise','m',0,['soleus'],['calf_med','calf_lat'],['standing_calf'],70,1),
leg_raise:E('Captain’s chair leg raise','w',0,['abs'],['obliques'],['bench_leg_raise'],0),
bench_leg_raise:E('Bench leg raise','w',0,['abs'],['obliques'],['leg_raise'],0),
ohp:E('Standing military press','b',1,['delt_front','delt_side'],['tri_lat','tri_long','chest_up','trap_up','abs'],['seated_db_press','arnold'],75),
seated_db_press:E('Seated DB shoulder press','d',1,['delt_front','delt_side'],['tri_lat','tri_long','trap_up'],['ohp','arnold'],35),
arnold:E('Arnold press','d',1,['delt_front','delt_side'],['tri_lat','tri_long'],['seated_db_press','ohp'],30),
dips:E('Weighted dips','w',1,['chest_mid','tri_lat','tri_long'],['delt_front'],['dip_machine','db_flat'],0),
dip_machine:E('Dip machine','m',1,['chest_mid','tri_lat','tri_long'],['delt_front'],['dips','db_flat'],90),
rear_fly:E('Rear delt cable fly','c',0,['delt_rear'],['trap_mid','teres'],['reverse_pec_deck'],15),
reverse_pec_deck:E('Reverse pec deck','m',0,['delt_rear'],['trap_mid','teres'],['rear_fly'],50),
oh_rope:E('Overhead rope extension','c',0,['tri_long'],['tri_lat'],['db_oh_ext'],35),
db_oh_ext:E('Overhead DB extension','d',0,['tri_long'],['tri_lat'],['oh_rope'],30),
lunges:E('Walking lunges with DBs','d',1,['quad_rf','quad_lat','quad_med','glute_max'],['adductor','glute_med','ham_semi'],['split_squat'],25,1),
split_squat:E('Bulgarian split squat','d',1,['quad_rf','quad_lat','quad_med','glute_max'],['adductor','glute_med'],['lunges'],20,1),
leg_ext:E('Leg extension','m',0,['quad_rf','quad_lat','quad_med'],[],['split_squat'],70,1),
back_ext:E('Weighted back extension','w',0,['erector'],['glute_max','ham_bf','ham_semi'],['db_rdl'],0,1),
weighted_situp:E('Weighted sit-up','w',0,['abs'],['obliques'],['cable_crunch'],0),
cable_crunch:E('Cable crunch','c',0,['abs'],['obliques'],['weighted_situp'],60)
};
const EQ={b:{min:45,max:600,step:5,label:'Barbell'},d:{min:5,max:150,step:5,label:'Dumbbells, per hand'},c:{min:5,max:400,step:5,label:'Cable'},m:{min:10,max:600,step:5,label:'Machine'},w:{min:0,max:200,step:5,label:'Added weight'}};
const wRange=id=>{const e=EX[id],q=EQ[e.eq];return range(q.min,e.max||q.max,q.step);};
const incOf=id=>{const e=EX[id];return e.lower&&e.cmp&&(e.eq==='b'||e.eq==='m')?10:5;};
const restOf=id=>EX[id].cmp?150:75;

/* Plan */
const I=(ex,sets,lo,hi,ss,perLeg)=>({ex,sets,lo,hi,ss:ss||null,perLeg:!!perLeg});
const LEGACY={
UA:{name:'Upper A',focus:'Chest and back',items:[I('incline_bb',3,6,10),I('cable_row',3,8,12),I('db_flat',3,8,12),I('pulldown_wide',2,8,12),I('lat_raise',3,12,15),I('db_curl',2,10,12,1),I('rope_pushdown',2,12,15,1)]},
LA:{name:'Lower A',focus:'Squat focus',items:[I('squat',3,5,8),I('rdl',3,8,10),I('leg_press',2,10,12),I('lying_curl',3,10,12),I('standing_calf',3,10,15),I('leg_raise',3,12,15)]},
UB:{name:'Upper B',focus:'Shoulders and arms',items:[I('ohp',3,6,10),I('pulldown_close',3,8,12),I('dips',3,8,12),I('db_row',2,8,12),I('rear_fly',2,12,15,1),I('lat_raise',2,12,15,1),I('oh_rope',2,12,15,2),I('bb_curl',2,8,12,2)]},
LB:{name:'Lower B',focus:'Legs and lower back',items:[I('leg_press',3,8,12),I('lunges',2,10,10,null,1),I('seated_curl',3,10,12),I('leg_ext',2,12,15),I('back_ext',2,12,15),I('seated_calf',3,12,15),I('weighted_situp',3,10,15)]}
};
