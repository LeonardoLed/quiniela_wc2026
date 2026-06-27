
// LÓGICA AUTOMÁTICA — no necesitas editar este archivo para actualizar marcadores.
const { fechaUpdate, reglas, participantes, resultados, pronosticos, partidos, rankingAnterior } = CONFIG;

const ETAPAS = [
  { id:'d16',   label:'16avos de Final', color:'#2ecc71' },
  { id:'d8',    label:'Octavos de Final',color:'#f39c12' },
  { id:'d4',    label:'Cuartos de Final',color:'#e74c3c' },
  { id:'semi',  label:'Semifinales',     color:'#9b59b6' },
  { id:'final', label:'Gran Final',      color:'#F0C030' },
];

const fasesDef = [
  { key:'grupos', cls:'seg-grupos' },
  { key:'d16',   cls:'seg-16'    },
  { key:'d8',    cls:'seg-8'     },
  { key:'d4',    cls:'seg-4'     },
  { key:'semi',  cls:'seg-semi'  },
  { key:'final', cls:'seg-final' },
];

const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const ganador = (m) => !m ? null : (m[0] > m[1] ? 'L' : (m[1] > m[0] ? 'V' : 'E'));

function calcPts(real, pron){
  if(!real || !pron) return 0;
  if(real[0] === pron[0] && real[1] === pron[1]) return reglas.exacto;
  if(ganador(real) === ganador(pron)) return reglas.resultado;
  return reglas.error;
}

function iniciales(nombre){
  return nombre.split(/\s+/).filter(Boolean).slice(0,2).map(x => x[0]).join('').toUpperCase();
}
function avatar(nombre){
  return `<span class="avatar-inicial" aria-hidden="true">${esc(iniciales(nombre))}</span>`;
}
function flagImg(code){
  if(!code) return '';
  const c = code.toLowerCase();
  return `<img class="team-flag" src="https://flagcdn.com/28x21/${c}.png" width="28" height="21" onerror="this.style.display='none'" alt="${esc(code)}">`;
}
function labelPartido(info){
  if(!info || !info.local || info.local === 'Por definir') return '<span style="color:var(--gris)">Por definir</span>';
  return `${flagImg(info.flagL)}<span>${esc(info.local)}</span><span style="color:var(--gris);margin:0 2px">vs</span>${flagImg(info.flagV)}<span>${esc(info.visita)}</span>`;
}
function fechaPartido(info){
  return info && info.fecha ? `<div class="fecha-partido">🗓 ${esc(info.fecha)}</div>` : '';
}

function etapaPtsPorJugador(etId){
  const keys = Object.keys(resultados[etId]);
  return participantes.map((_,pi)=>
    keys.reduce((s,k)=> s + calcPts(resultados[etId][k], pronosticos[pi][etId][k]), 0)
  );
}

const ptsEtapas = Object.fromEntries(ETAPAS.map(et => [et.id, etapaPtsPorJugador(et.id)]));

const jugadores = participantes.map((p,i)=>{
  const etPts = {};
  ETAPAS.forEach(et => etPts[et.id] = ptsEtapas[et.id][i]);
  return { ...p, i, ...etPts, total: (p.grupos || 0) + Object.values(etPts).reduce((s,v)=>s+v,0) };
}).sort((a,b)=> b.total - a.total || a.nombre.localeCompare(b.nombre));

const maxTotal = Math.max(...jugadores.map(j=>j.total),1);
document.getElementById('fecha-update').textContent = fechaUpdate;

function rankingPrevioMap(){
  if(Array.isArray(rankingAnterior) && rankingAnterior.length){
    return new Map(rankingAnterior.map((nombre,idx)=>[nombre, idx+1]));
  }
  try {
    const guardado = JSON.parse(localStorage.getItem('quiniela-ranking-anterior') || '[]');
    return new Map(guardado.map((nombre,idx)=>[nombre, idx+1]));
  } catch (_) { return new Map(); }
}
const rankPrev = rankingPrevioMap();
function rankBadge(nombre, rankActual){
  const prev = rankPrev.get(nombre);
  if(!prev) return '<span class="rank-move rank-same">nuevo</span>';
  const diff = prev - rankActual;
  if(diff > 0) return `<span class="rank-move rank-up">↑ ${diff}</span>`;
  if(diff < 0) return `<span class="rank-move rank-down">↓ ${Math.abs(diff)}</span>`;
  return '<span class="rank-move rank-same">—</span>';
}
function rankRowClass(nombre, rankActual){
  const prev = rankPrev.get(nombre);
  if(!prev) return '';
  if(prev > rankActual) return ' rank-up-row';
  if(prev < rankActual) return ' rank-down-row';
  return '';
}

function medalla(i){ const c=['med-1','med-2','med-3'][i]||'med-n'; return `<span class="medalla ${c}">${i+1}</span>`; }
function ptsClass(i){ return ['pts-total pts-1','pts-total pts-2','pts-total pts-3'][i]||'pts-total pts-n'; }
function badge(v,etId){ return `<td><span class="badge-fase celda-etapa${v===0?' zero':''}" data-et="${etId}">${v===0?'—':v}</span></td>`; }

function buildTooltipUsuario(p) {
  let html = `<div class="tooltip-inner"><h4 style="color:var(--dorado)">${avatar(p.nombre)} ${esc(p.nombre.toUpperCase())} — DESGLOSE COMPLETO</h4>`;

  html += `<div class="tip-fase-bloque">
    <div class="tip-fase-titulo" style="color:var(--c-grupos)">▸ FASE DE GRUPOS</div>
    <div class="tip-chips"><div class="tip-chip chip-p3"><div class="tip-partido">Puntos de grupos</div><div class="tip-scores"><span class="tip-pron">${p.grupos} pts (estáticos)</span></div></div></div>
  </div>`;

  ETAPAS.forEach(et => {
    const keys = Object.keys(resultados[et.id]);
    let chips = '';
    keys.forEach(k => {
      const real = resultados[et.id][k];
      const pron = pronosticos[p.i][et.id][k];
      const info = partidos[et.id][k];
      // Oculta en pantalla los partidos sin resultado y sin pronóstico, pero siguen en config.js para editarlos después.
      if (!real && !pron) return;
      const pts = calcPts(real, pron);
      const chipCls = pts===reglas.exacto?'chip-p3':pts===reglas.resultado?'chip-p1':'chip-p0';
      const badgeCls = pts===reglas.exacto?'b3':pts===reglas.resultado?'b1':'b0';
      const realStr = real ? `${real[0]}-${real[1]}` : '?-?';
      const pronStr = pron ? `${pron[0]}-${pron[1]}` : '—';
      const ptsLabel = real ? (pts===reglas.exacto?`+${reglas.exacto}`:pts===reglas.resultado?`+${reglas.resultado}`:'0') : '';
      chips += `<div class="tip-chip ${chipCls}">${fechaPartido(info)}<div class="tip-partido">${labelPartido(info)}</div><div class="tip-scores"><span class="tip-real">Real: ${realStr}</span><span class="tip-pron">Pron: ${pronStr}</span><span class="tip-badge ${badgeCls}">${ptsLabel}</span></div></div>`;
    });
    if (!chips) chips = `<span style="color:var(--gris);font-size:11px">Sin partidos visibles aún</span>`;
    html += `<div class="tip-fase-bloque"><div class="tip-fase-titulo" style="color:${et.color}">▸ ${esc(et.label.toUpperCase())}</div><div class="tip-chips">${chips}</div></div>`;
  });

  return html + '</div>';
}

function renderTabla(){
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  jugadores.forEach((p,rank)=>{
    const tr = document.createElement('tr');
    tr.className = 'fila-jugador' + rankRowClass(p.nombre, rank+1);
    tr.innerHTML = `
      <td>${medalla(rank)}</td>
      <td>${avatar(p.nombre)}<span class="nombre">${esc(p.nombre)}</span>${rankBadge(p.nombre, rank+1)}<span class="hint-clic">▼ ver detalle</span></td>
      <td class="col-total"><span class="${ptsClass(rank)}">${p.total}</span></td>
      <td><span class="badge-fase${p.grupos===0?' zero':''}">${p.grupos===0?'—':p.grupos}</span></td>
      ${badge(p.d16,'d16')}${badge(p.d8,'d8')}${badge(p.d4,'d4')}${badge(p.semi,'semi')}${badge(p.final,'final')}`;

    const tr2 = document.createElement('tr');
    tr2.className = 'tooltip-usuario';
    tr2.id = `tip-user-${p.i}`;
    tr2.innerHTML = `<td colspan="9" class="tooltip-cell">${buildTooltipUsuario(p)}</td>`;
    tbody.appendChild(tr);
    tbody.appendChild(tr2);
    tr.addEventListener('click', (e) => {
      if (e.target.closest('.celda-etapa')) return;
      const yaAbierto = tr2.classList.contains('open');
      document.querySelectorAll('.tooltip-usuario').forEach(r => r.classList.remove('open'));
      document.querySelectorAll('.hint-clic').forEach(h => h.textContent = '▼ ver detalle');
      if (!yaAbierto) { tr2.classList.add('open'); tr.querySelector('.hint-clic').textContent = '▲ ocultar'; }
    });
  });
  try { localStorage.setItem('quiniela-ranking-anterior', JSON.stringify(jugadores.map(j=>j.nombre))); } catch (_) {}
}

function renderPaneles(){
  ETAPAS.forEach(et=>{
    const panel = document.getElementById(`panel-${et.id}`);
    const etPts = ptsEtapas[et.id];
    const keys  = Object.keys(resultados[et.id]);
    const rankEtapa = [...jugadores].sort((a,b)=>etPts[b.i]-etPts[a.i] || a.nombre.localeCompare(b.nombre));

    let html=`<div class="panel-header"><div class="panel-titulo" style="color:${et.color}">⚽ ${esc(et.label.toUpperCase())}</div><button class="panel-cerrar" onclick="togglePanel('${et.id}')">✕ cerrar</button></div><div class="panel-jugadores">`;

    rankEtapa.forEach(p=>{
      const totalEt=etPts[p.i];
      const ptsClass2=totalEt>=6?'pts-alto':totalEt>=3?'pts-med':'pts-bajo';
      let chips='';
      keys.forEach(k=>{
        const real=resultados[et.id][k];
        const pron=pronosticos[p.i][et.id][k];
        const info=partidos[et.id][k];
        if(!real && !pron) return;
        const pts=calcPts(real,pron);
        const chipCls=pts===reglas.exacto?'chip-p3':pts===reglas.resultado?'chip-p1':'chip-p0';
        const badgeCls=pts===reglas.exacto?'b3':pts===reglas.resultado?'b1':'b0';
        const realStr=real?`${real[0]}-${real[1]}`:'?-?';
        const pronStr=pron?`${pron[0]}-${pron[1]}`:'—';
        const ptsLabel=real?(pts===reglas.exacto?`+${reglas.exacto}`:pts===reglas.resultado?`+${reglas.resultado}`:'0'):'';
        chips+=`<div class="pchip ${chipCls}">${fechaPartido(info)}<div class="pchip-partido">${labelPartido(info)}</div><div class="pchip-scores"><span class="pchip-real">Real: ${realStr}</span><span class="pchip-pron">Pronós: ${pronStr}</span><span class="pchip-badge ${badgeCls}">${ptsLabel}</span></div></div>`;
      });
      if(!chips) chips=`<span style="color:var(--gris);font-size:12px">Sin partidos visibles aún</span>`;
      html+=`<div class="panel-jugador"><div class="pj-nombre">${avatar(p.nombre)}<span>${esc(p.nombre)}</span><span class="pj-pts ${ptsClass2}">${totalEt} pts</span></div><div class="partidos-chips">${chips}</div></div>`;
    });

    panel.innerHTML = html + '</div>';
  });
}

function togglePanel(etId){
  const panel=document.getElementById(`panel-${etId}`);
  const th=document.getElementById(`th-${etId}`);
  const yaAbierto=panel.classList.contains('open');
  document.querySelectorAll('.panel-etapa').forEach(p=>p.classList.remove('open'));
  document.querySelectorAll('.th-etapa').forEach(t=>t.classList.remove('activa'));
  document.querySelectorAll('.celda-etapa').forEach(c=>c.classList.remove('highlight'));
  if(!yaAbierto){
    panel.classList.add('open'); th.classList.add('activa');
    document.querySelectorAll(`[data-et="${etId}"]`).forEach(c=>c.classList.add('highlight'));
    panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}

function renderGrafica(){
  const bars=document.getElementById('bars');
  bars.innerHTML = '';
  jugadores.forEach(p=>{
    const div=document.createElement('div');
    div.className='bar-row';
    const segs = fasesDef.map(f=>{
      const pts = p[f.key] || 0;
      const label = pts > 0 ? pts : '';
      return `<div class="seg ${f.cls}" style="width:0%" data-key="${f.key}" data-pts="${pts}">${label}</div>`;
    }).join('');
    div.innerHTML=`<div class="bar-label">${avatar(p.nombre)} ${esc(p.nombre)}</div><div class="bar-track">${segs}</div><div class="bar-total" data-original-total="${p.total}">${p.total}</div>`;
    bars.appendChild(div);
  });
  setTimeout(recalcularGrafica, 150);
}

const fasesActivas = Object.fromEntries(fasesDef.map(f => [f.key, true]));
function recalcularGrafica(){
  const filas = [...document.querySelectorAll('.bar-row')];
  const maxVisible = Math.max(...filas.map(row =>
    [...row.querySelectorAll('.seg')].reduce((s,seg)=> fasesActivas[seg.dataset.key] ? s + Number(seg.dataset.pts || 0) : s, 0)
  ), 1);

  filas.forEach(row => {
    let totalVisible = 0;
    row.querySelectorAll('.seg').forEach(seg => {
      const pts = Number(seg.dataset.pts || 0);
      const activo = fasesActivas[seg.dataset.key];
      if (activo) totalVisible += pts;
      const pct = activo && pts > 0 ? (pts / maxVisible * 100) : 0;
      seg.style.width = pct.toFixed(2) + '%';
      seg.textContent = activo && pts > 0 ? pts : '';
      seg.style.display = activo ? 'flex' : 'none';
    });
    row.querySelector('.bar-total').textContent = totalVisible;
    row.classList.toggle('is-zero', totalVisible === 0);
  });
}
function toggleFase(fase, btn){
  fasesActivas[fase] = !fasesActivas[fase];
  btn.classList.toggle('activo', fasesActivas[fase]);
  recalcularGrafica();
}
function toggleGrafica(){
  const wrap=document.getElementById('grafica-wrapper');
  const btn=document.getElementById('btn-grafica');
  const oculta = wrap.classList.toggle('oculta');
  btn.textContent = oculta ? '⚡ MOSTRAR GRÁFICA' : '⚡ OCULTAR GRÁFICA';
  btn.setAttribute('aria-expanded', String(!oculta));
}

window.togglePanel = togglePanel;
window.toggleFase = toggleFase;
window.toggleGrafica = toggleGrafica;

renderTabla();
renderPaneles();
renderGrafica();
