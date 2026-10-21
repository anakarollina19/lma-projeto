(function(){var t;try{t=localStorage.getItem('lma-theme');}catch(e){}document.documentElement.setAttribute('data-theme',t||'light');})();

/* ======================== bloco ======================== */
(function(){
document.getElementById('year').textContent=new Date().getFullYear();
const drawer=document.getElementById('drawer');
document.getElementById('menuBtn').addEventListener('click',()=>{drawer.classList.add('open');document.body.style.overflow='hidden'});
window.closeDrawer=()=>{drawer.classList.remove('open');document.body.style.overflow=''};
drawer.addEventListener('click',e=>{if(e.target.hasAttribute('data-close')||e.target.closest('[data-close]'))closeDrawer()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();closeScreen();closeResched();document.querySelectorAll('.modal-scrim.open').forEach(m=>m.classList.remove('open'))}});
window.openScreen=function(n){closeDrawer();document.getElementById('scr-'+n).classList.add('open');document.body.style.overflow='hidden';if(n==='admin')paintAll()};
window.closeScreen=function(){document.querySelectorAll('.overlay.open').forEach(o=>o.classList.remove('open'));document.body.style.overflow='';closePtDetail()};

const d0=new Date();d0.setMinutes(d0.getMinutes()-d0.getTimezoneOffset());const today=d0.toISOString().slice(0,10);
document.getElementById('f-date').min=today;document.getElementById('fc-date').value=today;
function fillTimes(sel){for(let h=8;h<=18;h++)for(let m of[0,30]){if(h===18&&m===30)continue;const v=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');const o=document.createElement('option');o.value=v;o.textContent=v;sel.appendChild(o)}}
fillTimes(document.getElementById('f-time'));fillTimes(document.getElementById('r-time'));
document.getElementById('r-date').min=today;

const MO=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const LABEL={pendente:'Pendente',confirmado:'Confirmado',concluido:'Concluído',cancelado:'Cancelado'};
const STS=['pendente','confirmado','concluido','cancelado'];

/* ===== DENTAL CHART CONFIG ===== */
const CONDITIONS=[
  {id:'higido',label:'Hígido',color:'#E8F5E9',stroke:'#81C784'},
  {id:'carie',label:'Cárie',color:'#D32F2F',stroke:'#B71C1C'},
  {id:'restaurado',label:'Restaurado',color:'#1976D2',stroke:'#0D47A1'},
  {id:'ausente',label:'Ausente',color:'#9E9E9E',stroke:'#616161'},
  {id:'implante',label:'Implante',color:'#7B1FA2',stroke:'#4A148C'},
  {id:'protese',label:'Prótese',color:'#F57C00',stroke:'#E65100'},
  {id:'endo',label:'Endodontia',color:'#00838F',stroke:'#006064'},
  {id:'fratura',label:'Fratura',color:'#5D4037',stroke:'#3E2723'},
  {id:'extruido',label:'Extruído',color:'#FBC02D',stroke:'#F9A825'},
  {id:'tratamento',label:'Em tratamento',color:'#C98A90',stroke:'#8E4F58'}
];

// FDI tooth numbers
const UPPER_R=[18,17,16,15,14,13,12,11]; // right to center
const UPPER_L=[21,22,23,24,25,26,27,28]; // center to left
const LOWER_L=[31,32,33,34,35,36,37,38];
const LOWER_R=[48,47,46,45,44,43,42,41]; // right to center
const ALL_TEETH=[...UPPER_R,...UPPER_L,...LOWER_L,...LOWER_R];

// Tooth widths by type (molars wider, incisors narrow)
function toothW(n){const t=n%10;if(t>=6)return 32;if(t>=4)return 28;if(t===3)return 24;return 22}
function toothH(n){return n<=28?38:36} // upper slightly taller
function isIncisor(n){const t=n%10;return t<=2}
function isCanine(n){return n%10===3}
function isMolar(n){return n%10>=6}

/* Anatomical odontogram builder */
const PERM={UR:[18,17,16,15,14,13,12,11],UL:[21,22,23,24,25,26,27,28],LR:[48,47,46,45,44,43,42,41],LL:[31,32,33,34,35,36,37,38]};
const DEC={UR:[55,54,53,52,51],UL:[61,62,63,64,65],LR:[85,84,83,82,81],LL:[71,72,73,74,75]};
function ttype(n,dec){var p=n%10;if(dec){if(p<=2)return'incisor';if(p===3)return'canine';return'molar';}if(p<=2)return'incisor';if(p===3)return'canine';if(p<=5)return'premolar';return'molar';}
function twidth(t){return t==='molar'?48:t==='premolar'?40:t==='canine'?36:32;}

/* side silhouette, crown at TOP, roots at BOTTOM, in box 0..w / 0..h */
function sidePath(t,w,h){
  var cx=w/2;function X(f){return (cx+f*w).toFixed(1);}function Y(f){return (f*h).toFixed(1);}
  if(t==='incisor'||t==='canine'){
    var top=t==='canine'?0.03:0.07;
    return 'M'+X(-0.30)+' '+Y(0.46)+'C'+X(-0.35)+' '+Y(0.28)+' '+X(-0.28)+' '+Y(top+0.03)+' '+X(0)+' '+Y(top)+
    'C'+X(0.28)+' '+Y(top+0.03)+' '+X(0.35)+' '+Y(0.28)+' '+X(0.30)+' '+Y(0.46)+
    'C'+X(0.21)+' '+Y(0.64)+' '+X(0.12)+' '+Y(0.82)+' '+X(0)+' '+Y(0.96)+
    'C'+X(-0.12)+' '+Y(0.82)+' '+X(-0.21)+' '+Y(0.64)+' '+X(-0.30)+' '+Y(0.46)+'Z';
  }
  if(t==='premolar'){
    return 'M'+X(-0.34)+' '+Y(0.44)+'C'+X(-0.37)+' '+Y(0.28)+' '+X(-0.30)+' '+Y(0.15)+' '+X(-0.16)+' '+Y(0.15)+
    'C'+X(-0.09)+' '+Y(0.09)+' '+X(-0.10)+' '+Y(0.20)+' '+X(0)+' '+Y(0.19)+
    'C'+X(0.10)+' '+Y(0.20)+' '+X(0.09)+' '+Y(0.09)+' '+X(0.16)+' '+Y(0.15)+
    'C'+X(0.30)+' '+Y(0.15)+' '+X(0.37)+' '+Y(0.28)+' '+X(0.34)+' '+Y(0.44)+
    'C'+X(0.22)+' '+Y(0.64)+' '+X(0.12)+' '+Y(0.82)+' '+X(0)+' '+Y(0.97)+
    'C'+X(-0.12)+' '+Y(0.82)+' '+X(-0.22)+' '+Y(0.64)+' '+X(-0.34)+' '+Y(0.44)+'Z';
  }
  /* molar: wide crown + two roots with furcation */
  return 'M'+X(-0.42)+' '+Y(0.42)+'C'+X(-0.44)+' '+Y(0.24)+' '+X(-0.36)+' '+Y(0.13)+' '+X(-0.24)+' '+Y(0.13)+
  'C'+X(-0.16)+' '+Y(0.07)+' '+X(-0.17)+' '+Y(0.19)+' '+X(-0.07)+' '+Y(0.18)+
  'C'+X(0)+' '+Y(0.21)+' '+X(0)+' '+Y(0.21)+' '+X(0.07)+' '+Y(0.18)+
  'C'+X(0.17)+' '+Y(0.19)+' '+X(0.16)+' '+Y(0.07)+' '+X(0.24)+' '+Y(0.13)+
  'C'+X(0.36)+' '+Y(0.13)+' '+X(0.44)+' '+Y(0.24)+' '+X(0.42)+' '+Y(0.42)+
  'C'+X(0.40)+' '+Y(0.58)+' '+X(0.32)+' '+Y(0.78)+' '+X(0.27)+' '+Y(0.95)+
  'L'+X(0.19)+' '+Y(0.95)+'C'+X(0.17)+' '+Y(0.74)+' '+X(0.15)+' '+Y(0.60)+' '+X(0.12)+' '+Y(0.50)+
  'C'+X(0.06)+' '+Y(0.45)+' '+X(-0.06)+' '+Y(0.45)+' '+X(-0.12)+' '+Y(0.50)+
  'C'+X(-0.15)+' '+Y(0.60)+' '+X(-0.17)+' '+Y(0.74)+' '+X(-0.19)+' '+Y(0.95)+
  'L'+X(-0.27)+' '+Y(0.95)+'C'+X(-0.32)+' '+Y(0.78)+' '+X(-0.40)+' '+Y(0.58)+' '+X(-0.42)+' '+Y(0.42)+'Z';
}

/* occlusal (top-down) markup with absolute coords */
function occMarkup(t,x,y,w,h,n){
  var cx=x+w/2,cy=y+h/2,g='#C9BFB6';
  if(t==='incisor'||t==='canine'){
    var rx=(w*0.30).toFixed(1),ry=(h*0.34).toFixed(1);
    return '<ellipse class="tooth-fill" data-tooth="'+n+'" cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" rx="'+rx+'" ry="'+ry+'" fill="#FCF7F3" stroke="#C2A98F" stroke-width="1.4"/>';
  }
  var sq=Math.min(w-6,h-2),sx=cx-sq/2,sy=cy-sq/2,r=(sq*0.28).toFixed(1);
  var rect='<rect class="tooth-fill" data-tooth="'+n+'" x="'+sx.toFixed(1)+'" y="'+sy.toFixed(1)+'" width="'+sq.toFixed(1)+'" height="'+sq.toFixed(1)+'" rx="'+r+'" fill="#FCF7F3" stroke="#C2A98F" stroke-width="1.4"/>';
  var grooves;
  if(t==='premolar'){
    grooves='<path d="M'+(sx+sq*0.22).toFixed(1)+' '+cy.toFixed(1)+'H'+(sx+sq*0.78).toFixed(1)+'" stroke="'+g+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
  }else{
    grooves='<path d="M'+(sx+sq*0.2).toFixed(1)+' '+cy.toFixed(1)+'H'+(sx+sq*0.8).toFixed(1)+'M'+cx.toFixed(1)+' '+(sy+sq*0.2).toFixed(1)+'V'+(sy+sq*0.8).toFixed(1)+'" stroke="'+g+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
  }
  return rect+grooves;
}

function buildDentalSVG(mode){
  var dec=mode==='dec',S=dec?DEC:PERM;
  var upper=S.UR.concat(S.UL),lower=S.LR.concat(S.LL),splitU=S.UR.length,splitL=S.LR.length;
  var numH=16,sideH=64,occH=42,vgap=5,archGap=30,hgap=5,midGap=22,padX=14,padY=8;
  function cw(n){return twidth(ttype(n,dec));}
  function layout(arr,split){var x=padX,out=[];arr.forEach(function(n,i){var w=cw(n);out.push({n:n,x:x,w:w});x+=w+hgap;if(i+1===split)x+=midGap;});return {items:out,width:x-hgap-padX};}
  var LU=layout(upper,splitU),LL=layout(lower,splitL);
  var rowW=Math.max(LU.width,LL.width);
  var svgW=rowW+padX*2;
  var ySideU=padY+numH, yOccU=ySideU+sideH+vgap, yOccL=yOccU+occH+archGap, ySideL=yOccL+occH+vgap;
  var svgH=ySideL+sideH+numH+padY;
  var cx=svgW/2, yDiv=yOccU+occH+archGap/2;
  var s='<svg viewBox="0 0 '+svgW+' '+svgH+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:'+svgW+'px">';
  s+='<line x1="'+padX+'" y1="'+yDiv+'" x2="'+(svgW-padX)+'" y2="'+yDiv+'" stroke="#D8C6A8" stroke-width="1" stroke-dasharray="4 4" opacity=".6"/>';
  s+='<line x1="'+cx+'" y1="'+(padY+2)+'" x2="'+cx+'" y2="'+(svgH-padY-2)+'" stroke="#D8C6A8" stroke-width="1" stroke-dasharray="4 4" opacity=".5"/>';
  function tooth(o,arch){
    var n=o.n,t=ttype(n,dec),w=o.w,x=o.x;
    var g='<g class="tooth-cell" data-tooth="'+n+'">';
    if(arch==='upper'){
      g+='<text class="tooth-num" x="'+(x+w/2).toFixed(1)+'" y="'+(padY+11)+'" style="font:600 11px Manrope;fill:#6E585C;text-anchor:middle">'+n+'</text>';
      g+='<g transform="translate('+x.toFixed(1)+' '+(ySideU+sideH).toFixed(1)+') scale(1,-1)"><path class="tooth-fill" data-tooth="'+n+'" d="'+sidePath(t,w,sideH)+'" fill="#FCF7F3" stroke="#C2A98F" stroke-width="1.4" stroke-linejoin="round"/></g>';
      g+=occMarkup(t,x,yOccU,w,occH,n);
    }else{
      g+=occMarkup(t,x,yOccL,w,occH,n);
      g+='<g transform="translate('+x.toFixed(1)+' '+ySideL.toFixed(1)+')"><path class="tooth-fill" data-tooth="'+n+'" d="'+sidePath(t,w,sideH)+'" fill="#FCF7F3" stroke="#C2A98F" stroke-width="1.4" stroke-linejoin="round"/></g>';
      g+='<text class="tooth-num" x="'+(x+w/2).toFixed(1)+'" y="'+(ySideL+sideH+13).toFixed(1)+'" style="font:600 11px Manrope;fill:#6E585C;text-anchor:middle">'+n+'</text>';
    }
    var hy=arch==='upper'?padY:yOccL, hh=arch==='upper'?(yOccU+occH-padY):(svgH-padY-yOccL);
    g+='<rect data-tooth="'+n+'" x="'+x.toFixed(1)+'" y="'+hy.toFixed(1)+'" width="'+w+'" height="'+hh.toFixed(1)+'" fill="transparent"/>';
    g+='</g>';
    return g;
  }
  LU.items.forEach(function(o){s+=tooth(o,'upper');});
  LL.items.forEach(function(o){s+=tooth(o,'lower');});
  s+='</svg>';
  return s;
}
/* ===== DATA ===== */
const SAMPLE_BK=[
  {id:1,patient_name:'Maria Clara Souza',patient_phone:'(62) 99145-2210',service:'Lentes & facetas',preferred_date:'2026-09-24',preferred_time:'09:00',notes:null,status:'pendente'},
  {id:2,patient_name:'João Pedro Lima',patient_phone:'(62) 99630-8841',service:'Avaliação',preferred_date:'2026-09-24',preferred_time:'10:30',notes:'Primeira vez',status:'pendente'},
  {id:3,patient_name:'Ana Beatriz Martins',patient_phone:'(62) 98212-7793',service:'Clareamento',preferred_date:'2026-09-25',preferred_time:'14:00',notes:'Prefere tarde',status:'confirmado'},
  {id:4,patient_name:'Rita Gonçalves',patient_phone:'(62) 99401-5567',service:'Próteses dentárias',preferred_date:'2026-09-26',preferred_time:'08:30',notes:null,status:'confirmado'},
  {id:5,patient_name:'Carla Ferreira',patient_phone:'(62) 99988-1002',service:'Harmonização',preferred_date:'2026-09-22',preferred_time:'16:00',notes:null,status:'concluido'},
  {id:6,patient_name:'Bruno Alves',patient_phone:'(62) 99117-4420',service:'Implantes',preferred_date:'2026-09-23',preferred_time:'11:00',notes:'Remarcar',status:'cancelado'}
];
const SAMPLE_FICHAS=[
  {id:1,patient_name:'Maria Clara Souza',date:'2026-09-20',proc:'Lentes / facetas',diag_sist:'Sem alergias',diag_regiao:'Dentes 11-23: desgaste',queixa:'Sorriso mais harmônico',desc:'Lentes e.max 11-13, 21-23',anest:'Bloqueio alveolar superior anterior',prescr:'Ibuprofeno 400mg 8/8h 3 dias',obs:'Paciente ansiosa',pos_conduta:'Retorno 7 dias'},
  {id:2,patient_name:'Carla Ferreira',date:'2026-09-18',proc:'Harmonização orofacial',diag_sist:'Hipertensão — Losartana 50mg',diag_regiao:'Terço inferior, mento e mandíbula',queixa:'Definição no contorno do rosto',desc:'AH mento 1ml + mandíbula 2ml',anest:'Tópica + bloqueio mentoniano',prescr:'Gelo 15min a cada 2h / 24h',obs:'Sem exercício 48h',pos_conduta:'Retorno 15 dias'}
];
const SAMPLE_ATTACH=[
  {patient:'Maria Clara Souza',files:[{name:'Panorâmica.jpg',date:'20/09/2026',type:'img'},{name:'Planejamento DSD.pdf',date:'21/09/2026',type:'pdf'}]},
  {patient:'Carla Ferreira',files:[{name:'Foto frontal.jpg',date:'18/09/2026',type:'img'},{name:'Consentimento.pdf',date:'18/09/2026',type:'pdf'}]}
];
// Sample dental chart data (per patient)
const SAMPLE_ODONTO={
  'Maria Clara Souza':{11:{cond:'tratamento',note:'Lente de contato e.max'},12:{cond:'tratamento',note:'Lente'},13:{cond:'tratamento',note:'Lente'},21:{cond:'tratamento',note:'Lente'},22:{cond:'tratamento',note:'Lente'},23:{cond:'tratamento',note:'Lente'},36:{cond:'restaurado',note:'Restauração MOD resina'},46:{cond:'restaurado',note:'Restauração OD amálgama'}},
  'Carla Ferreira':{18:{cond:'ausente',note:'Extraído'},28:{cond:'ausente',note:'Extraído'},38:{cond:'ausente',note:'Extraído'},48:{cond:'ausente',note:'Extraído'},16:{cond:'restaurado',note:''},26:{cond:'carie',note:'Cárie oclusal'}}
};

let manualPatients=[], fichaOdonto={}; // {name,phone,birth,obs}
let data=clone(SAMPLE_BK),fichas=clone(SAMPLE_FICHAS),odonto=JSON.parse(JSON.stringify(SAMPLE_ODONTO)),nextId=100,nextFichaId=100,filter='todos';
function clone(a){return a.map(o=>Object.assign({},o))}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

/* Booking */
document.getElementById('bookForm').addEventListener('submit',function(e){e.preventDefault();const sv=document.getElementById('f-service').value,dt=document.getElementById('f-date').value,tm=document.getElementById('f-time').value,nm=document.getElementById('f-name').value.trim(),ph=document.getElementById('f-phone').value.trim(),nt=document.getElementById('f-notes').value.trim()||null,ok=document.getElementById('f-consent').checked;if(!sv||!dt||!tm||!nm||!ph||!ok){document.getElementById('formMsg').innerHTML='<div class="notice err" style="margin:.4rem 0 1rem">Preencha todos os campos.</div>';return}document.getElementById('formMsg').innerHTML='';data.push({id:nextId++,patient_name:nm,patient_phone:ph,service:sv,preferred_date:dt,preferred_time:tm,notes:nt,status:'pendente'});document.getElementById('bookForm').hidden=true;document.getElementById('successText').textContent='Pedido para '+dt.split('-').reverse().join('/')+' às '+tm+'.';document.getElementById('bookSuccess').hidden=false;paintAll()});
document.getElementById('bookAgain').addEventListener('click',()=>{const f=document.getElementById('bookForm');f.reset();f.hidden=false;document.getElementById('bookSuccess').hidden=true});
document.getElementById('loginBtn').addEventListener('click',doLogin);document.getElementById('l-pass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin()});
function doLogin(){if(document.getElementById('l-user').value.trim()==='admin'&&document.getElementById('l-pass').value==='admin'){closeScreen();openScreen('admin')}else{document.getElementById('loginMsg').innerHTML='<div class="notice err" style="margin:.4rem 0 1rem">Incorretos.</div>'}}

/* Admin tabs */
document.getElementById('adminTabs').addEventListener('click',function(e){const b=e.target.closest('button');if(!b)return;const tab=b.dataset.tab;this.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('#scr-admin > div:last-child > .tab-content').forEach(x=>x.classList.toggle('active',x.id==='tab-'+tab));if(tab==='pacientes')paintPatients();if(tab==='ficha-nova'){populateFcPatients();fichaOdonto={};mountFichaChart();}if(tab==='orcamentos')initBudgets();if(tab==='financeiro')initFinance();closePtDetail()});
function adminGoBack(){if(document.getElementById('pt-detail').classList.contains('open')){closePtDetail();return}closeScreen()}
function closePtDetail(){document.getElementById('pt-detail').classList.remove('open');document.getElementById('pacientes-list-view').style.display='';document.getElementById('adminBack').textContent='← Voltar ao site';selectedTooth=null}

/* Agendamentos */
function paintAll(){paintStats();paintToolbar();paintList()}
function paintStats(){const c={pendente:0,confirmado:0,concluido:0,cancelado:0};data.forEach(b=>c[b.status]++);document.getElementById('stats').innerHTML=st(data.length,'total')+st(c.pendente,'pendentes')+st(c.confirmado,'confirmados')+st(c.concluido,'concluídos')}
function st(n,l){return'<div class="stat"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>'}
function paintToolbar(){document.getElementById('toolbar').innerHTML=['todos'].concat(STS).map(t=>'<button class="chip'+(filter===t?' active':'')+'" data-f="'+t+'">'+(t==='todos'?'Todos':LABEL[t])+'</button>').join('')+'<span class="spacer"></span>';document.querySelectorAll('#toolbar .chip').forEach(c=>c.addEventListener('click',()=>{filter=c.dataset.f;paintToolbar();paintList()}))}
function paintList(){const rows=filter==='todos'?data:data.filter(b=>b.status===filter);const el=document.getElementById('list');if(!rows.length){el.innerHTML='<div class="empty"><svg><use href="#ic-calendar"/></svg><p>Nenhum agendamento.</p></div>';return}el.innerHTML='<div class="booking-list">'+rows.map(bkCard).join('')+'</div>';el.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',onBkAct))}
function bkCard(b){const[,m,d]=b.preferred_date.split('-');return'<div class="bk"><div class="when"><div class="d">'+d+'</div><div class="m">'+(MO[+m-1]||'')+'</div><div class="t">'+b.preferred_time+'</div></div><div class="who"><div class="nm">'+esc(b.patient_name)+'</div><div class="sv">'+esc(b.service)+'</div><div class="meta"><span><svg><use href="#ic-phone"/></svg>'+esc(b.patient_phone)+'</span></div>'+(b.notes?'<div class="note">"'+esc(b.notes)+'"</div>':'')+'</div><div class="side"><span class="badge '+b.status+'">'+LABEL[b.status]+'</span><div class="actions"><button class="resched" data-act="resched" data-id="'+b.id+'">Reagendar</button>'+(b.status!=='confirmado'?actBtn(b.id,'confirmado','Confirmar'):'')+(b.status!=='concluido'?actBtn(b.id,'concluido','Concluir'):'')+(b.status!=='cancelado'?actBtn(b.id,'cancelado','Cancelar'):'')+'<button class="danger" data-act="del" data-id="'+b.id+'">Excluir</button></div></div></div>'}
function actBtn(id,s,l){return'<button data-act="st" data-id="'+id+'" data-status="'+s+'">'+l+'</button>'}
function onBkAct(e){const el=e.currentTarget,id=+el.dataset.id;if(el.dataset.act==='st'){const b=data.find(x=>x.id===id);if(b)b.status=el.dataset.status;paintAll()}else if(el.dataset.act==='del'){if(confirm('Excluir?')){data=data.filter(x=>x.id!==id);paintAll()}}else if(el.dataset.act==='resched'){openResched(id)}}

/* Reschedule */
let reschedId=null;
function openResched(id){const b=data.find(x=>x.id===id);if(!b)return;reschedId=id;document.getElementById('reschedInfo').textContent=b.patient_name+' — '+b.service;document.getElementById('r-date').value=b.preferred_date;document.getElementById('r-time').value=b.preferred_time;document.getElementById('reschedModal').classList.add('open')}
window.closeResched=function(){document.getElementById('reschedModal').classList.remove('open')};
document.getElementById('reschedSave').addEventListener('click',function(){const nd=document.getElementById('r-date').value,nt=document.getElementById('r-time').value;if(!nd||!nt)return;const b=data.find(x=>x.id===reschedId);if(b){b.preferred_date=nd;b.preferred_time=nt;b.status='pendente';b.notes=(b.notes?b.notes+' | ':'')+'Reagendado '+nd.split('-').reverse().join('/')}closeResched();paintAll()});
document.getElementById('reschedModal').addEventListener('click',function(e){if(e.target===this)closeResched()});

/* Patients */
function getPatients(){const map={};data.forEach(b=>{const k=b.patient_name;if(!map[k])map[k]={name:k,phone:b.patient_phone,bookings:[],fichas:[],attachments:[]};map[k].bookings.push(b)});fichas.forEach(f=>{const k=f.patient_name;if(!map[k])map[k]={name:k,phone:'',bookings:[],fichas:[],attachments:[]};map[k].fichas.push(f)});SAMPLE_ATTACH.forEach(a=>{if(map[a.patient])map[a.patient].attachments=a.files});manualPatients.forEach(p=>{if(!map[p.name])map[p.name]={name:p.name,phone:p.phone,bookings:[],fichas:[],attachments:[]};else map[p.name].phone=map[p.name].phone||p.phone});return Object.values(map)}

function paintPatients(){const pts=getPatients();const q=(document.getElementById('ptSearch').value||'').toLowerCase();
  const filtered=q?pts.filter(p=>p.name.toLowerCase().includes(q)||p.phone.includes(q)):pts;
  const el=document.getElementById('ptGrid');
  if(!filtered.length){el.innerHTML='<p style="color:var(--ink-soft)">Nenhum paciente encontrado.</p>';return}
  el.innerHTML=filtered.map(p=>{const last=p.bookings.sort((a,b)=>b.preferred_date.localeCompare(a.preferred_date))[0];const nf=p.fichas.length;const hasOdonto=!!odonto[p.name];
    return'<div class="pt-card" data-pt="'+esc(p.name)+'"><div class="top"><div class="av">'+esc(p.name[0])+'</div><div><div class="nm">'+esc(p.name)+'</div><div class="ph">'+esc(p.phone)+'</div></div></div><div class="tags">'+(last?'<span class="recent">'+last.preferred_date.split('-').reverse().join('/')+'</span>':'')+'<span>'+p.bookings.length+' consulta(s)</span>'+(nf?'<span>'+nf+' ficha(s)</span>':'')+(hasOdonto?'<span>Odontograma</span>':'')+'</div></div>'}).join('');
  el.querySelectorAll('.pt-card').forEach(c=>c.addEventListener('click',()=>openPatient(c.dataset.pt)))}
document.getElementById('ptSearch').addEventListener('input',paintPatients);

/* New patient */
document.getElementById('newPtBtn').addEventListener('click',()=>document.getElementById('newPtModal').classList.add('open'));
document.getElementById('newPtModal').addEventListener('click',function(e){if(e.target===this)this.classList.remove('open')});
document.getElementById('npSave').addEventListener('click',function(){
  const nm=document.getElementById('np-name').value.trim(),ph=document.getElementById('np-phone').value.trim();
  if(!nm||!ph){document.getElementById('npMsg').innerHTML='<div class="notice err" style="margin:.4rem 0 0">Informe nome e telefone.</div>';return}
  manualPatients.push({name:nm,phone:ph,birth:document.getElementById('np-birth').value,obs:document.getElementById('np-obs').value.trim()});
  document.getElementById('newPtModal').classList.remove('open');
  document.querySelectorAll('#newPtModal input,#newPtModal textarea').forEach(el=>el.value='');document.getElementById('npMsg').innerHTML='';
  paintPatients();
});

let currentPt=null,selectedTooth=null;
function openPatient(name){
  currentPt=name;const pts=getPatients();const p=pts.find(x=>x.name===name);if(!p)return;
  document.getElementById('pacientes-list-view').style.display='none';
  document.getElementById('pt-detail').classList.add('open');
  document.getElementById('adminBack').textContent='← Voltar à lista';
  document.getElementById('ptHeader').innerHTML='<div class="av-lg">'+esc(p.name[0])+'</div><div class="info"><div class="nm">'+esc(p.name)+'</div><div class="ph">'+esc(p.phone)+' · '+p.bookings.length+' consulta(s) · '+p.fichas.length+' ficha(s)</div></div>';
  document.querySelectorAll('#ptTabs button').forEach((b,i)=>b.classList.toggle('active',i===0));
  document.querySelectorAll('#pt-detail .tab-content').forEach((t,i)=>t.classList.toggle('active',i===0));
  // History
  const sorted=[...p.bookings].sort((a,b)=>b.preferred_date.localeCompare(a.preferred_date));
  document.getElementById('ptTimeline').innerHTML=sorted.length?sorted.map(b=>'<div class="tl-item"><div class="dot-col"><div class="dot"></div><div class="line"></div></div><div><div class="dt">'+b.preferred_date.split('-').reverse().join('/')+' '+b.preferred_time+' <span class="badge '+b.status+'">'+LABEL[b.status]+'</span></div><div class="sv">'+esc(b.service)+'</div>'+(b.notes?'<div class="nt">'+esc(b.notes)+'</div>':'')+'</div></div>').join(''):'<p style="color:var(--ink-soft)">Nenhum atendimento.</p>';
  // Fichas
  const fl=document.getElementById('ptFichas');
  fl.innerHTML=p.fichas.length?p.fichas.map(f=>'<div class="ficha-item" data-fid="'+f.id+'"><div class="top"><span class="proc">'+esc(f.proc)+'</span><span class="date">'+f.date.split('-').reverse().join('/')+'</span></div><div class="preview">'+esc(f.diag_regiao||f.desc||f.queixa||'')+'</div></div>').join('')+'<div style="margin-top:.8rem"><button class="btn btn-primary btn-sm" onclick="goToNewFicha(\''+esc(name)+'\')">+ Nova ficha</button></div>':'<p style="color:var(--ink-soft)">Nenhuma ficha.<br><button class="btn btn-primary btn-sm" style="margin-top:.6rem" onclick="goToNewFicha(\''+esc(name)+'\')">Criar ficha</button></p>';
  fl.querySelectorAll('.ficha-item').forEach(fi=>fi.addEventListener('click',()=>showFicha(+fi.dataset.fid)));
  // Odontograma
  initDentalChart(name);
  // Attachments
  document.getElementById('ptAttach').innerHTML=p.attachments.length?p.attachments.map(a=>'<div class="attach-item"><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.4" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path fill="none" stroke="currentColor" stroke-width="1.4" d="M14 2v6h6"/></svg><div class="fn">'+esc(a.name)+'</div><div class="dt">'+a.date+'</div></div>').join(''):'<p style="color:var(--ink-soft);text-align:center">Nenhum anexo.</p>';
  initAnamnese(name);initDocuments(name);
}
document.getElementById('ptTabs').addEventListener('click',function(e){const b=e.target.closest('button');if(!b)return;this.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('#pt-detail .tab-content').forEach(x=>x.classList.toggle('active',x.id==='ptab-'+b.dataset.ptab))});

/* Dental chart */
function applyChartColors(chartEl,store){chartEl.querySelectorAll('.tooth-fill').forEach(t=>{const tn=+t.dataset.tooth,info=store[tn];if(info){const c=CONDITIONS.find(x=>x.id===info.cond);if(c){t.setAttribute('fill',c.color);t.setAttribute('stroke',c.stroke);t.setAttribute('stroke-width','2');return;}}t.setAttribute('fill','#FCF7F3');t.setAttribute('stroke','#C2A98F');t.setAttribute('stroke-width','1.4');});}
function mountOdonto(o){const chartEl=document.getElementById(o.chart);if(!chartEl)return;chartEl.innerHTML=buildDentalSVG(o.mode||'perm');if(o.legend)document.getElementById(o.legend).innerHTML=CONDITIONS.map(c=>'<div class="leg"><div class="swatch" style="background:'+c.color+';border-color:'+c.stroke+'"></div>'+c.label+'</div>').join('');applyChartColors(chartEl,o.getStore());const panel=document.getElementById(o.panel),noteEl=document.getElementById(o.note);let sel=null;noteEl.oninput=function(){if(sel!=null){const s=o.getStore();if(s[sel])s[sel].note=this.value;}};chartEl.querySelectorAll('.tooth-cell').forEach(t=>t.addEventListener('click',function(){const tn=+this.dataset.tooth;sel=tn;panel.classList.add('open');document.getElementById(o.title).textContent='Dente '+tn;const s=o.getStore(),ex=s[tn];noteEl.value=ex?(ex.note||''):'';document.getElementById(o.cond).innerHTML=CONDITIONS.map(c=>'<button data-cond="'+c.id+'"'+(ex&&ex.cond===c.id?' class="active"':'')+' style="border-color:'+c.stroke+'">'+c.label+'</button>').join('');document.querySelectorAll('#'+o.cond+' button').forEach(btn=>btn.onclick=function(){document.querySelectorAll('#'+o.cond+' button').forEach(x=>x.classList.remove('active'));this.classList.add('active');const st=o.getStore();st[tn]={cond:this.dataset.cond,note:noteEl.value};applyChartColors(chartEl,st);});}));panel.classList.remove('open');sel=null;}
var dentMode='perm';function initDentalChart(name){if(!odonto[name])odonto[name]={};mountOdonto({chart:'dentalChart',legend:'dentalLegend',panel:'toothPanel',title:'toothTitle',cond:'condOptions',note:'toothNote',mode:dentMode,getStore:()=>odonto[name]});var bp=document.getElementById('dent-perm'),bd=document.getElementById('dent-dec');if(bp&&bd){bp.classList.toggle('active',dentMode==='perm');bd.classList.toggle('active',dentMode==='dec');bp.onclick=function(){dentMode='perm';initDentalChart(name);};bd.onclick=function(){dentMode='dec';initDentalChart(name);};}}
function mountFichaChart(){mountOdonto({chart:'fichaChart',legend:'fichaLegend',panel:'fichaToothPanel',title:'fichaToothTitle',cond:'fichaCondOptions',note:'fichaToothNote',getStore:()=>fichaOdonto});}
function showFicha(id){const f=fichas.find(x=>x.id===id);if(!f)return;document.getElementById('fichaTitle').textContent=f.proc+' — '+f.date.split('-').reverse().join('/');
  const flds=[['Paciente',f.patient_name],['Diagnóstico sistêmico',f.diag_sist],['Diagnóstico da região',f.diag_regiao],['Queixa principal',f.queixa],['Descrição',f.desc],['Anestesia',f.anest],['Prescrição',f.prescr],['Observações',f.obs],['Pós-operatório',f.pos_conduta]];
  var _od=f.odonto&&Object.keys(f.odonto).length?('<div style="margin-bottom:.7rem"><div style="font-weight:600;font-size:.82rem;color:var(--gold-text)">Odontograma</div><div style="color:var(--ink);margin-top:.15rem">'+Object.keys(f.odonto).length+' dente(s) marcado(s)</div></div>'):'';document.getElementById('fichaBody').innerHTML=flds.filter(([,v])=>v).map(([k,v])=>'<div style="margin-bottom:.7rem"><div style="font-weight:600;font-size:.82rem;color:var(--gold-text)">'+k+'</div><div style="color:var(--ink);margin-top:.15rem">'+esc(v)+'</div></div>').join('')+_od;
  document.getElementById('fichaModal').classList.add('open')}
document.getElementById('fichaModal').addEventListener('click',function(e){if(e.target===this)this.classList.remove('open')});

/* New ficha */
function populateFcPatients(){const sel=document.getElementById('fc-patient');const pts=getPatients();sel.innerHTML='<option value="" disabled selected>Selecione…</option>'+pts.map(p=>'<option>'+esc(p.name)+'</option>').join('')}
window.goToNewFicha=function(name){closePtDetail();document.querySelectorAll('#adminTabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab==='ficha-nova'));document.querySelectorAll('#scr-admin > div:last-child > .tab-content').forEach(x=>x.classList.toggle('active',x.id==='tab-ficha-nova'));populateFcPatients();fichaOdonto={};mountFichaChart();if(name)document.getElementById('fc-patient').value=name};
document.querySelectorAll('input[name="fc-instr"]').forEach(r=>r.addEventListener('change',function(){document.getElementById('fc-instr-desc').style.display=this.value==='sim'?'':'none'}));
document.getElementById('fc-save').addEventListener('click',function(){
  const pt=document.getElementById('fc-patient').value,proc=document.getElementById('fc-proc').value;
  if(!pt||!proc){document.getElementById('fcMsg').innerHTML='<div class="notice err">Selecione paciente e procedimento.</div>';return}
  fichas.push({id:nextFichaId++,patient_name:pt,date:document.getElementById('fc-date').value||today,proc,diag_sist:document.getElementById('fc-diag-sist').value.trim(),diag_regiao:document.getElementById('fc-diag-regiao').value.trim(),queixa:document.getElementById('fc-queixa').value.trim(),desc:document.getElementById('fc-desc').value.trim(),anest:document.getElementById('fc-anest').value.trim(),prescr:document.getElementById('fc-prescr').value.trim(),obs:document.getElementById('fc-obs').value.trim(),pos_conduta:document.getElementById('fc-pos-conduta').value.trim(),odonto:JSON.parse(JSON.stringify(fichaOdonto))});
  if(Object.keys(fichaOdonto).length){if(!odonto[pt])odonto[pt]={};Object.assign(odonto[pt],fichaOdonto);}document.getElementById('fcMsg').innerHTML='<div class="notice ok"><strong>Ficha salva!</strong> Aparece no perfil do paciente.</div>';fichaOdonto={};mountFichaChart();
});
document.getElementById('fc-clear').addEventListener('click',function(){document.querySelectorAll('#tab-ficha-nova textarea,#tab-ficha-nova select,#tab-ficha-nova input[type=date]').forEach(el=>el.value=el.tagName==='SELECT'?'':'');document.getElementById('fcMsg').innerHTML='';fichaOdonto={};mountFichaChart();});


/* ===== NEW MODULES: budgets, anamnese, documents ===== */
function fmtToday(){return today.split('-').reverse().join('/');}
function money(v){return 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});}
window.doPrint=function(){document.body.classList.add('printing');window.print();setTimeout(function(){document.body.classList.remove('printing');},600);};
window.addEventListener('afterprint',function(){document.body.classList.remove('printing');});

/* BUDGETS */
const PROCS=[['Avaliação',80],['Profilaxia / limpeza',150],['Restauração',250],['Clareamento',900],['Lente / faceta (un.)',1500],['Implante',3500],['Prótese',2000],['Extração',300],['Endodontia',700],['Harmonização (ml)',800]];
let budgets=[{id:1,patient:'Maria Clara Souza',date:'2026-09-20',items:[{proc:'Lente / faceta (un.)',tooth:'11,12,13,21,22,23',val:9000}],total:9000,status:'aprovado'}];
let nextBudgetId=100,budgetItems=[];
function initBudgets(){
  const ps=document.getElementById('bud-patient'),pts=getPatients();
  ps.innerHTML='<option value="" disabled selected>Selecione…</option>'+pts.map(p=>'<option>'+esc(p.name)+'</option>').join('');
  const proc=document.getElementById('bud-proc');proc.innerHTML=PROCS.map(p=>'<option>'+p[0]+'</option>').join('');
  document.getElementById('bud-val').value=PROCS[0][1];
  document.getElementById('bud-date').value=today;
  proc.onchange=function(){const p=PROCS.find(x=>x[0]===this.value);if(p)document.getElementById('bud-val').value=p[1];};
  document.getElementById('bud-add').onclick=function(){const pr=document.getElementById('bud-proc').value,th=document.getElementById('bud-tooth').value.trim(),vl=parseFloat(document.getElementById('bud-val').value)||0;if(!pr)return;budgetItems.push({proc:pr,tooth:th,val:vl});document.getElementById('bud-tooth').value='';renderBudgetItems();};
  document.getElementById('bud-save').onclick=function(){const pt=document.getElementById('bud-patient').value;if(!pt||!budgetItems.length){document.getElementById('budMsg').innerHTML='<div class="notice err">Selecione paciente e adicione itens.</div>';return;}const total=budgetItems.reduce((s,i)=>s+i.val,0);budgets.push({id:nextBudgetId++,patient:pt,date:document.getElementById('bud-date').value||today,items:budgetItems.slice(),total:total,status:'aberto'});budgetItems=[];renderBudgetItems();document.getElementById('budMsg').innerHTML='<div class="notice ok">Orçamento salvo!</div>';renderBudgetList();};
  document.getElementById('bud-clear').onclick=function(){budgetItems=[];renderBudgetItems();document.getElementById('budMsg').innerHTML='';};
  renderBudgetItems();renderBudgetList();
}
function renderBudgetItems(){const el=document.getElementById('bud-items');if(!budgetItems.length){el.innerHTML='<p style="color:var(--ink-soft);font-size:.9rem;margin:.4rem 0">Nenhum item adicionado.</p>';return;}let total=0;el.innerHTML=budgetItems.map((it,i)=>{total+=it.val;return'<div class="bud-line"><span>'+esc(it.proc)+'</span><span style="color:var(--ink-soft)">'+(esc(it.tooth)||'—')+'</span><span>'+money(it.val)+'</span><button class="btn btn-ghost btn-sm rm" data-i="'+i+'">✕</button></div>';}).join('')+'<div class="bud-total">Total: <span class="val">'+money(total)+'</span></div>';el.querySelectorAll('.rm').forEach(b=>b.onclick=function(){budgetItems.splice(+b.dataset.i,1);renderBudgetItems();});}
function renderBudgetList(){const el=document.getElementById('bud-list');if(!budgets.length){el.innerHTML='<p style="color:var(--ink-soft)">Nenhum orçamento ainda.</p>';return;}el.innerHTML=budgets.slice().reverse().map(b=>'<div class="bud-card"><div class="top"><div><strong>'+esc(b.patient)+'</strong> · <span style="color:var(--ink-soft);font-size:.9rem">'+b.date.split('-').reverse().join('/')+'</span></div><span class="badge '+(b.status==='aprovado'?'confirmado':'pendente')+'">'+(b.status==='aprovado'?'Aprovado':'Aberto')+'</span></div><div style="font-size:.9rem;color:var(--ink-soft);margin:.5rem 0">'+b.items.map(i=>esc(i.proc)+(i.tooth?' ('+esc(i.tooth)+')':'')).join(' · ')+'</div><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem"><span style="font-family:Fraunces;font-size:1.25rem;color:var(--heading)">'+money(b.total)+'</span><span style="display:flex;gap:.4rem">'+(b.status!=='aprovado'?'<button class="btn btn-primary btn-sm" data-ap="'+b.id+'">Aprovar</button>':'')+'<button class="btn btn-ghost btn-sm" data-del="'+b.id+'">Excluir</button></span></div></div>').join('');el.querySelectorAll('[data-ap]').forEach(x=>x.onclick=function(){const b=budgets.find(y=>y.id==x.dataset.ap);if(b)b.status='aprovado';renderBudgetList();});el.querySelectorAll('[data-del]').forEach(x=>x.onclick=function(){if(confirm('Excluir orçamento?')){budgets=budgets.filter(y=>y.id!=x.dataset.del);renderBudgetList();}});}

/* ANAMNESE */
const QUESTIONS=[
  {id:'trat',t:'Está em tratamento médico atualmente?'},
  {id:'med',t:'Faz uso de algum medicamento?'},
  {id:'alergia',t:'Tem alergia a medicamentos ou anestésicos?',alert:1},
  {id:'cardio',t:'Tem problemas cardíacos ou hipertensão?',alert:1},
  {id:'diabetes',t:'É diabético(a)?',alert:1},
  {id:'coag',t:'Problema de coagulação ou usa anticoagulante?',alert:1},
  {id:'gest',t:'Está grávida ou amamentando?',alert:1},
  {id:'anest',t:'Já teve reação a anestesia?',alert:1},
  {id:'fumante',t:'É fumante?'},
  {id:'bruxismo',t:'Aperta ou range os dentes (bruxismo)?'}
];
let anamneses={'Carla Ferreira':{cardio:'sim',alergia:'nao',_obs:'Hipertensão controlada com Losartana.'}};
function initAnamnese(name){
  const store=anamneses[name]||{};
  document.getElementById('anamForm').innerHTML=QUESTIONS.map(q=>{const v=store[q.id]||'';return'<div class="anam-q'+(q.alert&&v==='sim'?' alert-on':'')+'" data-q="'+q.id+'"><div class="qt">'+q.t+'</div><div class="opts"><label><input type="radio" name="an-'+q.id+'" value="sim"'+(v==='sim'?' checked':'')+'> Sim</label><label><input type="radio" name="an-'+q.id+'" value="nao"'+(v==='nao'?' checked':'')+'> Não</label></div></div>';}).join('')+'<div class="field" style="margin-top:.9rem"><label>Observações gerais</label><textarea class="input" id="an-obs">'+esc(store._obs||'')+'</textarea></div>';
  document.querySelectorAll('#anamForm input[type=radio]').forEach(r=>r.addEventListener('change',function(){const qid=this.name.slice(3),q=QUESTIONS.find(x=>x.id===qid),row=document.querySelector('#anamForm .anam-q[data-q="'+qid+'"]');if(q&&q.alert)row.classList.toggle('alert-on',this.value==='sim');renderAnamAlerts();}));
  renderAnamAlerts();
}
function currentAnam(){const a={};QUESTIONS.forEach(q=>{const c=document.querySelector('#anamForm input[name="an-'+q.id+'"]:checked');if(c)a[q.id]=c.value;});const o=document.getElementById('an-obs');if(o)a._obs=o.value;return a;}
function renderAnamAlerts(){const a=currentAnam(),al=QUESTIONS.filter(q=>q.alert&&a[q.id]==='sim').map(q=>q.t);document.getElementById('anamAlerts').innerHTML=al.length?'<div class="alert-box"><strong>⚠ Alertas clínicos:</strong> '+al.map(esc).join(' · ')+'</div>':'';}

/* DOCUMENTS */
let docPatient=null,rxMeds=[];
const MEDS=[
{cat:'Analgésicos',name:'Dipirona sódica 500mg',pos:'Tomar 1 comprimido de 6/6 horas, se dor.'},
{cat:'Analgésicos',name:'Dipirona sódica 1g',pos:'Tomar 1 comprimido de 6/6 horas, se dor forte.'},
{cat:'Analgésicos',name:'Paracetamol 750mg',pos:'Tomar 1 comprimido de 6/6 horas, se dor (máx. 4 ao dia).'},
{cat:'Analgésicos',name:'Paracetamol 500mg + Codeína 30mg',pos:'Tomar 1 comprimido de 6/6 horas, se dor intensa (receita de controle especial).'},
{cat:'Anti-inflamatórios',name:'Ibuprofeno 600mg',pos:'Tomar 1 comprimido de 8/8 horas, após as refeições, por 3 dias.'},
{cat:'Anti-inflamatórios',name:'Nimesulida 100mg',pos:'Tomar 1 comprimido de 12/12 horas, após as refeições, por 3 a 5 dias.'},
{cat:'Anti-inflamatórios',name:'Ketoprofeno 100mg',pos:'Tomar 1 comprimido de 12/12 horas, após as refeições, por 3 dias.'},
{cat:'Anti-inflamatórios',name:'Naproxeno 500mg',pos:'Tomar 1 comprimido de 12/12 horas, após as refeições, por 5 dias.'},
{cat:'Anti-inflamatórios',name:'Diclofenaco potássico 50mg',pos:'Tomar 1 comprimido de 8/8 horas, após as refeições, por 3 dias.'},
{cat:'Antibióticos',name:'Amoxicilina 500mg',pos:'Tomar 1 cápsula de 8/8 horas, por 7 dias.'},
{cat:'Antibióticos',name:'Amoxicilina 500mg + Clavulanato 125mg',pos:'Tomar 1 comprimido de 8/8 horas, por 7 dias.'},
{cat:'Antibióticos',name:'Azitromicina 500mg',pos:'Tomar 1 comprimido ao dia, por 3 a 5 dias.'},
{cat:'Antibióticos',name:'Clindamicina 300mg',pos:'Tomar 1 cápsula de 8/8 horas, por 7 dias.'},
{cat:'Antibióticos',name:'Metronidazol 400mg',pos:'Tomar 1 comprimido de 8/8 horas, por 7 dias.'},
{cat:'Antibióticos',name:'Cefalexina 500mg',pos:'Tomar 1 cápsula de 6/6 horas, por 7 dias.'},
{cat:'Corticoides',name:'Dexametasona 4mg',pos:'Tomar 1 comprimido, dose única, 1 hora antes do procedimento.'},
{cat:'Corticoides',name:'Prednisolona 20mg',pos:'Tomar 1 comprimido ao dia, pela manhã, por 3 dias.'},
{cat:'Antisséptico bucal',name:'Clorexidina 0,12% (solução)',pos:'Bochechar 15 ml por 1 minuto, 2x ao dia, por 7 dias. Não engolir.'},
{cat:'Antifúngicos',name:'Nistatina 100.000 UI/ml (suspensão)',pos:'Bochechar e engolir 5 ml de 6/6 horas, por 14 dias.'},
{cat:'Antifúngicos',name:'Miconazol gel oral 20mg/g',pos:'Aplicar na região afetada de 6/6 horas, por 14 dias.'},
{cat:'Profilaxia',name:'Amoxicilina 500mg (profilaxia)',pos:'Tomar 4 cápsulas (2g) em dose única, 1 hora antes do procedimento.'}
];
function receitaSheet(patient,meds){
  var rows=meds.map(function(m){return '<li><div class="m">'+esc(m.med)+'</div><div class="p">'+esc(m.pos)+'</div></li>';}).join('');
  return '<div class="no-print" style="text-align:right;margin-bottom:.6rem;display:flex;gap:.5rem;justify-content:flex-end;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="openSignModal(\'Receituário\')">Solicitar assinatura</button><button class="btn btn-ghost btn-sm" onclick="doPrint()">Imprimir / PDF</button></div>'
  +'<div class="rx-sheet"><div class="rx-head"><div class="rx-brand"><div class="rx-name">Luíza Martins Albuquerque</div><div class="rx-sub">Cirurgiã-Dentista · CRO-GO 00000</div></div><div class="rx-contact">Rua Exemplo, 000 — Sala 00<br>Sua Cidade / GO<br>(00) 0000-0000</div></div>'
  +'<div class="rx-rule"></div>'
  +'<div class="rx-patient"><span>Paciente:</span> '+esc(patient)+'</div>'
  +'<div class="rx-use">Uso Oral</div>'
  +'<ol class="rx-meds">'+rows+'</ol>'
  +'<div class="rx-foot"><div>Sua Cidade / GO, '+fmtToday()+'</div><div class="rx-sign">_____________________________________<br>Dra. Luíza Martins Albuquerque · CRO-GO 00000</div></div></div>';
}
function initDocuments(name){docPatient=name;rxMeds=[];const sel=document.getElementById('dc-proc');sel.innerHTML=PROCS.map(p=>'<option>'+p[0]+'</option>').join('')+'<option>Outro procedimento</option>';document.getElementById('rx-list').innerHTML='';document.getElementById('docOutput').innerHTML='';document.getElementById('rx-med').value='';document.getElementById('rx-pos').value='';var rp=document.getElementById('rx-preset'),cats={};MEDS.forEach(function(m){(cats[m.cat]=cats[m.cat]||[]).push(m);});rp.innerHTML='<option value="" disabled selected>Escolher medicação…</option>'+Object.keys(cats).map(function(c){return '<optgroup label="'+c+'">'+cats[c].map(function(m){return '<option>'+esc(m.name)+'</option>';}).join('')+'</optgroup>';}).join('');renderSigList(name);}
function consentText(patient,proc){return 'Eu, '+esc(patient)+', declaro que fui devidamente informado(a) pela Dra. Luíza Martins Albuquerque (CRO 00000-GO) sobre o procedimento de <strong>'+esc(proc)+'</strong>, incluindo seus objetivos, benefícios, possíveis riscos e complicações, alternativas de tratamento e os cuidados necessários. Tive a oportunidade de esclarecer todas as minhas dúvidas e autorizo, de livre e espontânea vontade, a realização do procedimento proposto.';}
function renderRx(){const el=document.getElementById('rx-list');el.innerHTML=rxMeds.map((m,i)=>'<div class="rx-line"><span><strong>'+esc(m.med)+'</strong> — '+esc(m.pos)+'</span><button data-i="'+i+'">✕</button></div>').join('');el.querySelectorAll('button').forEach(b=>b.onclick=function(){rxMeds.splice(+b.dataset.i,1);renderRx();});}
function bindDocs(){
  document.getElementById('dc-gen').onclick=function(){var proc=document.getElementById('dc-proc').value;document.getElementById('docOutput').innerHTML=consentSheet(docPatient||'—',proc);};
  document.getElementById('rx-add').onclick=function(){const m=document.getElementById('rx-med').value.trim(),p=document.getElementById('rx-pos').value.trim();if(!m)return;rxMeds.push({med:m,pos:p||'Conforme orientação'});document.getElementById('rx-med').value='';document.getElementById('rx-pos').value='';renderRx();};
  document.getElementById('rx-gen').onclick=function(){if(!rxMeds.length){alert('Adicione ao menos um medicamento.');return;}document.getElementById('docOutput').innerHTML=receitaSheet(docPatient||'—',rxMeds);};document.getElementById('rx-preset').onchange=function(){var m=MEDS.find(function(x){return x.name===this.value;}.bind(this));if(m){document.getElementById('rx-med').value=m.name;document.getElementById('rx-pos').value=m.pos;}};document.getElementById('med-toggle').onclick=function(){var fm=document.getElementById('med-form');fm.style.display=fm.style.display==='none'?'':'none';};document.getElementById('med-save').onclick=function(){var n=document.getElementById('med-name').value.trim(),c=document.getElementById('med-cat').value.trim()||'Outros',p=document.getElementById('med-pos').value.trim();if(!n)return;MEDS.push({cat:c,name:n,pos:p||'Conforme orientação'});var rp=document.getElementById('rx-preset'),cats={};MEDS.forEach(function(m){(cats[m.cat]=cats[m.cat]||[]).push(m);});rp.innerHTML='<option value="" disabled selected>Escolher medicação…</option>'+Object.keys(cats).map(function(cc){return '<optgroup label="'+cc+'">'+cats[cc].map(function(m){return '<option>'+esc(m.name)+'</option>';}).join('')+'</optgroup>';}).join('');document.getElementById('rx-med').value=n;document.getElementById('rx-pos').value=p||'Conforme orientação';document.getElementById('med-name').value='';document.getElementById('med-cat').value='';document.getElementById('med-pos').value='';document.getElementById('med-form').style.display='none';};document.getElementById('rx-model').onclick=function(){document.getElementById('docOutput').innerHTML=receitaSheet(docPatient||'Nome do Paciente (modelo)',[{med:'Amoxicilina 500mg — 21 cápsulas',pos:'Tomar 1 cápsula de 8/8 horas, por 7 dias.'},{med:'Ibuprofeno 600mg — 9 comprimidos',pos:'Tomar 1 comprimido de 8/8 horas, após as refeições, por 3 dias.'},{med:'Dipirona sódica 500mg — 20 comprimidos',pos:'Tomar 1 comprimido de 6/6 horas, se dor.'}]);};
}
bindDocs();
document.getElementById('anamSave').addEventListener('click',function(){if(!currentPt)return;anamneses[currentPt]=currentAnam();document.getElementById('anamMsg').innerHTML='<div class="notice ok">Anamnese salva!</div>';});



/* ===== MODULE 2: finance + signature + consent sheet ===== */
/* CONSENT LETTERHEAD */
function consentSheet(patient,proc){
  return '<div class="no-print" style="text-align:right;margin-bottom:.6rem;display:flex;gap:.5rem;justify-content:flex-end;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="openSignModal(\'Termo de consentimento\')">Solicitar assinatura</button><button class="btn btn-ghost btn-sm" onclick="doPrint()">Imprimir / PDF</button></div>'
  +'<div class="rx-sheet"><div class="rx-head"><div class="rx-brand"><div class="rx-name">Luíza Martins Albuquerque</div><div class="rx-sub">Cirurgiã-Dentista · CRO-GO 00000</div></div><div class="rx-contact">Rua Exemplo, 000 — Sala 00<br>Sua Cidade / GO<br>(00) 0000-0000</div></div>'
  +'<div class="rx-rule"></div>'
  +'<div class="rx-doctitle">Termo de Consentimento Livre e Esclarecido</div>'
  +'<div class="rx-body"><p>'+consentText(patient,proc)+'</p><p>Declaro estar ciente das orientações pré e pós-operatórias e comprometo-me a segui-las, bem como a comparecer às consultas de retorno agendadas.</p></div>'
  +'<div class="rx-foot" style="margin-top:2rem"><div>Sua Cidade / GO, '+fmtToday()+'</div><div style="display:flex;gap:2.5rem;flex-wrap:wrap;justify-content:center"><div class="rx-sign">______________________________<br>'+esc(patient)+' — Paciente</div><div class="rx-sign">______________________________<br>Dra. Luíza Martins Albuquerque · CRO-GO 00000</div></div></div></div>';
}

/* SIGNATURE */
let signdocs={},sigTipo=null;
window.openSignModal=function(tipo){sigTipo=tipo;var nm=currentPt||'Paciente';document.getElementById('sig-pt-name').textContent=nm;var first=(currentPt?currentPt.toLowerCase().split(' ')[0]:'paciente').normalize('NFD').replace(/[\u0300-\u036f]/g,'');document.getElementById('sig-pt-email').textContent=first+'@email.com';document.getElementById('signModal').classList.add('open');};
function renderSigList(name){var el=document.getElementById('sigList');if(!el)return;var arr=signdocs[name]||[];if(!arr.length){el.innerHTML='';return;}el.innerHTML='<h4 style="font-family:Fraunces;font-weight:400;color:var(--heading);font-size:1.05rem;margin:.4rem 0 .6rem">Documentos enviados para assinatura</h4>'+arr.slice().reverse().map(function(s){return '<div class="rx-line"><span>'+esc(s.tipo)+' · '+s.date.split('-').reverse().join('/')+'</span><span class="badge '+(s.status==='assinado'?'confirmado':'pendente')+'">'+(s.status==='assinado'?'✓ Assinado':'Aguardando assinatura')+'</span></div>';}).join('');}

/* FINANCE */
let finance=[
  {id:1,desc:'Lentes de contato — sinal',patient:'Maria Clara Souza',val:4500,tipo:'entrada',status:'pago',nf:true,date:'2026-09-20'},
  {id:2,desc:'Lentes de contato — parcela 2',patient:'Maria Clara Souza',val:4500,tipo:'entrada',status:'pendente',nf:false,date:'2026-10-20'},
  {id:3,desc:'Compra de material (resina)',patient:'',val:680,tipo:'saida',status:'pago',nf:false,date:'2026-09-15'}
];
let nextFinId=100;
function initFinance(){
  var ps=document.getElementById('fin-patient'),pts=getPatients();
  ps.innerHTML='<option value="">— Paciente (opcional) —</option>'+pts.map(function(p){return '<option>'+esc(p.name)+'</option>';}).join('');
  document.getElementById('fin-date').value=today;
  document.getElementById('fin-add').onclick=function(){var d=document.getElementById('fin-desc').value.trim(),v=parseFloat(document.getElementById('fin-val').value)||0,tp=document.getElementById('fin-tipo').value,stt=document.getElementById('fin-status').value,pt=document.getElementById('fin-patient').value,dt=document.getElementById('fin-date').value||today;if(!d||!v){document.getElementById('finMsg').innerHTML='<div class="notice err">Informe descrição e valor.</div>';return;}finance.push({id:nextFinId++,desc:d,patient:pt,val:v,tipo:tp,status:stt,nf:false,date:dt});document.getElementById('fin-desc').value='';document.getElementById('fin-val').value='';document.getElementById('finMsg').innerHTML='';renderFin();};
  renderFin();
}
function renderFin(){
  var rec=0,arec=0,sai=0;
  finance.forEach(function(t){if(t.tipo==='entrada'&&t.status==='pago')rec+=t.val;if(t.tipo==='entrada'&&t.status==='pendente')arec+=t.val;if(t.tipo==='saida'&&t.status==='pago')sai+=t.val;});
  document.getElementById('finStats').innerHTML=
    '<div class="stat"><div class="n" style="color:var(--ok)">'+money(rec)+'</div><div class="l">Recebido</div></div>'
   +'<div class="stat"><div class="n" style="color:var(--warn)">'+money(arec)+'</div><div class="l">A receber</div></div>'
   +'<div class="stat"><div class="n" style="color:var(--bad)">'+money(sai)+'</div><div class="l">Saídas</div></div>'
   +'<div class="stat"><div class="n">'+money(rec-sai)+'</div><div class="l">Saldo</div></div>';
  var el=document.getElementById('fin-list');
  if(!finance.length){el.innerHTML='<p style="color:var(--ink-soft)">Nenhum lançamento.</p>';return;}
  el.innerHTML=finance.slice().reverse().map(function(t){
    var color=t.tipo==='entrada'?'var(--ok)':'var(--bad)',sign=t.tipo==='entrada'?'+':'−';
    return '<div class="bud-card"><div class="top"><div><strong>'+esc(t.desc)+'</strong>'+(t.patient?' · <span style="color:var(--ink-soft);font-size:.9rem">'+esc(t.patient)+'</span>':'')+'<div style="font-size:.82rem;color:var(--ink-soft)">'+t.date.split('-').reverse().join('/')+(t.nf?' · NF emitida':'')+'</div></div><span style="font-family:Fraunces;font-size:1.2rem;color:'+color+'">'+sign+' '+money(t.val)+'</span></div><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;margin-top:.5rem"><span class="badge '+(t.status==='pago'?'confirmado':'pendente')+'">'+(t.status==='pago'?'Pago':'Pendente')+'</span><span style="display:flex;gap:.4rem;flex-wrap:wrap">'+(t.status!=='pago'?'<button class="btn btn-primary btn-sm" data-pay="'+t.id+'">Registrar pagamento</button>':'')+(t.tipo==='entrada'&&!t.nf?'<button class="btn btn-ghost btn-sm" data-nf="'+t.id+'">Emitir NF</button>':'')+'<button class="btn btn-ghost btn-sm" data-fdel="'+t.id+'">Excluir</button></span></div></div>';
  }).join('');
  el.querySelectorAll('[data-pay]').forEach(function(x){x.onclick=function(){var t=finance.find(function(y){return y.id==x.dataset.pay;});if(t)t.status='pago';renderFin();};});
  el.querySelectorAll('[data-nf]').forEach(function(x){x.onclick=function(){var t=finance.find(function(y){return y.id==x.dataset.nf;});if(t)t.nf=true;renderFin();};});
  el.querySelectorAll('[data-fdel]').forEach(function(x){x.onclick=function(){if(confirm('Excluir lançamento?')){finance=finance.filter(function(y){return y.id!=x.dataset.fdel;});renderFin();}};});
}

/* signature modal bindings */
document.getElementById('sigRequest').addEventListener('click',function(){if(!currentPt)return;var rec={tipo:sigTipo||'Documento',date:today,status:'pendente'};(signdocs[currentPt]=signdocs[currentPt]||[]).push(rec);document.getElementById('signModal').classList.remove('open');renderSigList(currentPt);setTimeout(function(){rec.status='assinado';renderSigList(currentPt);},1600);});
document.getElementById('signModal').addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');});


document.getElementById('resetDemo').addEventListener('click',()=>{data=clone(SAMPLE_BK);fichas=clone(SAMPLE_FICHAS);odonto=JSON.parse(JSON.stringify(SAMPLE_ODONTO));manualPatients=[];budgets=[];anamneses={};signdocs={};budgetItems=[];rxMeds=[];nextId=100;nextFichaId=100;nextBudgetId=100;filter='todos';paintAll()});
paintAll();
})();

/* ======================== bloco ======================== */
(function(){var b=document.getElementById('themeToggle');if(b)b.addEventListener('click',function(){var d=document.documentElement.getAttribute('data-theme')==='dark';var n=d?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('lma-theme',n);}catch(e){}});})();