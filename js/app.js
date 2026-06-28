
// LÓGICA AUTOMÁTICA — no necesitas editar este archivo para actualizar marcadores.
const { reglas, participantes, resultados, pronosticos, partidos } = CONFIG;

const ETAPAS = [
  { id:'d16',   label:'16avos de Final', color:'#2ecc71' },
  { id:'d8',    label:'Octavos de Final',color:'#f39c12' },
  { id:'d4',    label:'Cuartos de Final',color:'#e74c3c' },
  { id:'semi',  label:'Semifinales',     color:'#9b59b6' },
  { id:'final', label:'Finales',          color:'#F0C030', nota:'Incluye la gran final y el partido por tercer lugar' },
];

const ROUND_LIMITS = { d16:16, d8:8, d4:4, semi:2, final:2 };

function keysEtapa(etId){
  return Object.keys(resultados[etId] || {}).sort().slice(0, ROUND_LIMITS[etId] || Infinity);
}

const fasesDef = [
  { key:'grupos', cls:'seg-grupos' },
  { key:'d16',   cls:'seg-16'    },
  { key:'d8',    cls:'seg-8'     },
  { key:'d4',    cls:'seg-4'     },
  { key:'semi',  cls:'seg-semi'  },
  { key:'final', cls:'seg-final' },
];

const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function marcadorDe(valor){
  if(!valor) return null;
  return Array.isArray(valor) ? valor : valor.marcador;
}
function pasaDe(valor){
  return valor && !Array.isArray(valor) ? valor.pasa : null;
}
function ganadorMarcador(m){
  if(!m) return null;
  if(m[0] > m[1]) return 'L';
  if(m[1] > m[0]) return 'V';
  return 'E';
}
function clasificado(valor){
  const m = marcadorDe(valor);
  if(!m) return null;
  const g = ganadorMarcador(m);
  // Si el marcador queda empatado, el clasificado debe indicarse con pasa: "L" o pasa: "V".
  return g === 'E' ? pasaDe(valor) : g;
}
function marcadorExacto(real, pron){
  const r = marcadorDe(real);
  const p = marcadorDe(pron);
  return !!(r && p && r[0] === p[0] && r[1] === p[1]);
}
function calcPts(real, pron){
  if(!real || !pron) return 0;

  const r = marcadorDe(real);
  const p = marcadorDe(pron);
  if(!r || !p) return 0;

  const exacto = marcadorExacto(real, pron);
  const realEmpate = ganadorMarcador(r) === 'E';
  const pronEmpate = ganadorMarcador(p) === 'E';

  // Marcador exacto: si hubo empate, también debe coincidir quién pasa.
  if(exacto){
    if(realEmpate || pronEmpate){
      return clasificado(real) && clasificado(real) === clasificado(pron) ? reglas.exacto : reglas.error;
    }
    return reglas.exacto;
  }

  // Un punto por acertar quién pasa / ganador.
  return clasificado(real) && clasificado(real) === clasificado(pron) ? reglas.resultado : reglas.error;
}
function scoreStr(valor){
  const m = marcadorDe(valor);
  return m ? `${m[0]}-${m[1]}` : null;
}
function pasaTexto(valor, info){
  const m = marcadorDe(valor);
  const pasa = pasaDe(valor);
  if(!m || ganadorMarcador(m) !== 'E') return '';
  if(!pasa) return ' · pasa: sin definir';
  const equipo = pasa === 'L' ? (info?.local || 'Local') : (info?.visita || 'Visitante');
  return ` · pasa ${esc(equipo)}`;
}

function equipoNombre(info, lado){
  if(!info) return lado === 'L' ? 'Local' : 'Visitante';
  return lado === 'L' ? (info.local || 'Local') : (info.visita || 'Visitante');
}
function equipoFlag(info, lado){
  if(!info) return '';
  return lado === 'L' ? (info.flagL || '') : (info.flagV || '');
}
function clasificadoHtml(valor, info, etiqueta){
  const c = clasificado(valor);
  if(!c) return '';
  const nombre = equipoNombre(info, c);
  const flag = flagImg(equipoFlag(info, c));
  return `<div class="clasifica-line"><span>${esc(etiqueta)}</span><strong>${flag}${esc(nombre)}</strong></div>`;
}
function scoreDisplay(valor){
  const m = marcadorDe(valor);
  return m ? `${m[0]} <span>:</span> ${m[1]}` : `— <span>:</span> —`;
}
function puntosLabel(pts){
  if(pts === reglas.exacto) return `+${reglas.exacto}`;
  if(pts === reglas.resultado) return `+${reglas.resultado}`;
  return '0';
}
function puntosClass(pts){
  if(pts === reglas.exacto) return 'b3';
  if(pts === reglas.resultado) return 'b1';
  return 'b0';
}
function matchCard({info, real, pron, pts, chipCls, badgeCls, compact=false}){
  const infoOk = info && info.local && info.local !== 'Por definir';
  if(!infoOk) return `<div class="match-card match-pending"><div class="match-empty">Por definir</div></div>`;
  const mostrarPts = !!real;
  return `<div class="match-card ${chipCls}">
    ${fechaPartido(info)}
    <div class="match-teams">
      <div class="match-team">${flagImg(info.flagL)}<span>${esc(info.local)}</span></div>
      <div class="match-vs">VS</div>
      <div class="match-team">${flagImg(info.flagV)}<span>${esc(info.visita)}</span></div>
    </div>
    <div class="match-scores">
      <div class="score-line"><span class="score-label">Real</span><strong>${scoreDisplay(real)}</strong></div>
      <div class="score-line"><span class="score-label">Pron</span><strong>${scoreDisplay(pron)}</strong></div>
    </div>
    <div class="match-classifica">
      ${clasificadoHtml(real, info, 'Clasificó')}
      ${clasificadoHtml(pron, info, 'Pronosticó')}
    </div>
    ${mostrarPts ? `<div class="match-points ${badgeCls}">${puntosLabel(pts)}</div>` : ''}
  </div>`;
}

function iniciales(nombre){
  return nombre.split(/\s+/).filter(Boolean).slice(0,2).map(x => x[0]).join('').toUpperCase();
}
function avatar(nombre){
  return `<span class="avatar-inicial" aria-hidden="true">${esc(iniciales(nombre))}</span>`;
}
function flagImg(code){
  if(!code) return '';
  const c = String(code).toLowerCase().trim();
  // Banderas planas oficiales por país desde FlagCDN en SVG.
  // No son emoji, por eso no se ven onduladas.
  return `<span class="flag-square" aria-hidden="true"><img class="team-flag" src="https://flagcdn.com/${c}.svg" loading="lazy" onerror="this.closest('.flag-square').style.display='none'" alt="${esc(code)}"></span>`;
}
function labelPartido(info){
  if(!info || !info.local || info.local === 'Por definir') return '<span style="color:var(--gris)">Por definir</span>';
  return `${flagImg(info.flagL)}<span>${esc(info.local)}</span><span style="color:var(--gris);margin:0 2px">vs</span>${flagImg(info.flagV)}<span>${esc(info.visita)}</span>`;
}
function fechaPartido(info){
  const fecha = info && info.fecha ? `🗓 ${esc(info.fecha)}` : '';
  const nota = info && info.nota ? esc(info.nota) : '';
  if(!fecha && !nota) return '';
  return `<div class="fecha-partido">${fecha}${fecha && nota ? ' · ' : ''}${nota}</div>`;
}

function etapaPtsPorJugador(etId){
  const keys = keysEtapa(etId);
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

jugadores.forEach((j, idx) => { j.rankOriginal = idx + 1; });
let tablaOrden = [...jugadores];
let sortState = { campo:'rank', asc:true };

const maxTotal = Math.max(...jugadores.map(j=>j.total),1);

function obtenerRepoGitHub(){
  const host = window.location.hostname;
  const pathRepo = window.location.pathname.split('/').filter(Boolean)[0];

  // En GitHub Pages de proyecto: usuario.github.io/repositorio/
  if(host.endsWith('.github.io')){
    const user = host.replace('.github.io', '');
    const repo = pathRepo || `${user}.github.io`;
    return { user, repo };
  }

  // Fallback opcional para pruebas locales o dominio personalizado:
  // github: { user: "TU_USUARIO", repo: "TU_REPO" } en CONFIG.
  if(CONFIG.github && CONFIG.github.user && CONFIG.github.repo){
    return { user: CONFIG.github.user, repo: CONFIG.github.repo };
  }

  return null;
}

async function cargarUltimaActualizacion(){
  const el = document.getElementById('fecha-update');
  if(!el) return;

  el.textContent = 'Consultando...';

  const repoInfo = obtenerRepoGitHub();
  if(!repoInfo){
    el.textContent = 'No disponible';
    return;
  }

  try{
    const res = await fetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.repo}/commits?per_page=1`, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });

    if(!res.ok) throw new Error('No se pudo consultar GitHub');

    const data = await res.json();
    const fechaISO = data?.[0]?.commit?.committer?.date || data?.[0]?.commit?.author?.date;
    if(!fechaISO) throw new Error('Fecha no disponible');

    const fecha = new Date(fechaISO);
    const fechaTxt = fecha.toLocaleDateString('es-MX', {
      day:'2-digit', month:'2-digit', year:'numeric'
    });
    const horaTxt = fecha.toLocaleTimeString('es-MX', {
      hour:'2-digit', minute:'2-digit'
    });

    el.textContent = `${fechaTxt} · ${horaTxt} h`;
  }catch(e){
    el.textContent = 'No disponible';
  }
}

cargarUltimaActualizacion();

function faseEstaAbierta(etId){
  return faseAbiertaDefault === etId;
}

function medalla(i){ const c=['med-1','med-2','med-3'][i]||'med-n'; return `<span class="medalla ${c}">${i+1}</span>`; }
function ptsClass(i){ return ['pts-total pts-1','pts-total pts-2','pts-total pts-3'][i]||'pts-total pts-n'; }
function badge(v,etId){
  return `<td><span class="badge-fase celda-etapa${v===0?' zero':''}" data-et="${etId}" onclick="event.stopPropagation(); togglePanel('${etId}')" title="Ver detalle de fase">${v===0?'—':v}</span></td>`;
}

function buildTooltipUsuario(p) {
  let html = `<div class="tooltip-inner"><h4 style="color:var(--dorado)">${avatar(p.nombre)} ${esc(p.nombre.toUpperCase())} — DESGLOSE COMPLETO</h4>`;

  html += `<div class="tip-fase-bloque user-fase ${faseEstaAbierta('grupos') ? 'open' : ''}">
    <button class="tip-fase-header" type="button" onclick="toggleUserFase(this)" style="--fase-color:var(--c-grupos)">
      <span>FASE DE GRUPOS</span>
      <strong>${p.grupos || 0} pts</strong>
    </button>
    <div class="tip-fase-content">
      <div class="grupo-score-card">
        <div class="grupo-score-label">Puntos de grupos</div>
        <div class="grupo-score-value">${p.grupos || 0}</div>
        <div class="grupo-score-unit">pts</div>
      </div>
    </div>
  </div>`;

  ETAPAS.forEach(et => {
    const keys = keysEtapa(et.id);
    let chips = '';
    keys.forEach(k => {
      const real = resultados[et.id][k];
      const pron = pronosticos[p.i][et.id][k];
      const info = partidos[et.id][k];
      const pts = calcPts(real, pron);
      const chipCls = real ? (pts===reglas.exacto?'chip-p3':pts===reglas.resultado?'chip-p1':'chip-p0') : '';
      const badgeCls = puntosClass(pts);
      chips += matchCard({info, real, pron, pts, chipCls, badgeCls, compact:true});
    });
    if (!chips) chips = `<span style="color:var(--gris);font-size:11px">Sin partidos visibles aún</span>`;
    const totalEt = p[et.id] || 0;
    const nota = et.nota ? `<div class="fase-note">${esc(et.nota)}</div>` : '';
    html += `<div class="tip-fase-bloque user-fase ${faseEstaAbierta(et.id) ? 'open' : ''}">
      <button class="tip-fase-header" type="button" onclick="toggleUserFase(this)" style="--fase-color:${et.color}">
        <span>${esc(et.label.toUpperCase())}</span>
        <strong>${totalEt} pts</strong>
      </button>
      ${nota}
      <div class="tip-fase-content"><div class="tip-chips">${chips}</div></div>
    </div>`;
  });

  return html + '</div>';
}

function valorOrden(j, campo){
  if(campo === 'rank') return j.rankOriginal;
  if(campo === 'nombre') return j.nombre.toLocaleLowerCase('es-MX');
  return Number(j[campo] || 0);
}

function actualizarFlechasOrden(){
  document.querySelectorAll("[id^='arrow-']").forEach(el => { el.textContent = ''; });
  const arrow = document.getElementById(`arrow-${sortState.campo}`);
  if(arrow) arrow.textContent = sortState.asc ? '▲' : '▼';
}

function sortTable(campo){
  const mismoCampo = sortState.campo === campo;
  sortState = { campo, asc: mismoCampo ? !sortState.asc : (campo === 'nombre' || campo === 'rank') };
  tablaOrden = [...jugadores].sort((a,b)=>{
    const va = valorOrden(a,campo);
    const vb = valorOrden(b,campo);
    let cmp;
    if(typeof va === 'string') cmp = va.localeCompare(vb, 'es-MX');
    else cmp = va - vb;
    if(!sortState.asc) cmp *= -1;
    return cmp || a.nombre.localeCompare(b.nombre, 'es-MX');
  });
  actualizarFlechasOrden();
  renderTabla();
}

function renderTabla(){
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  tablaOrden.forEach((p,rank)=>{
    const tr = document.createElement('tr');
    tr.className = 'fila-jugador';
    tr.innerHTML = `
      <td>${medalla(rank)}</td>
      <td>${avatar(p.nombre)}<span class="nombre">${esc(p.nombre)}</span><span class="hint-clic">▼ ver detalle</span></td>
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
}


function renderPaneles(){
  ETAPAS.forEach(et=>{
    const panel = document.getElementById(`panel-${et.id}`);
    const etPts = ptsEtapas[et.id];
    const keys  = keysEtapa(et.id);
    const rankEtapa = [...jugadores].sort((a,b)=>etPts[b.i]-etPts[a.i] || a.nombre.localeCompare(b.nombre));

    let html=`<div class="panel-header"><div><div class="panel-titulo" style="color:${et.color}">⚽ ${esc(et.label.toUpperCase())}</div>${et.nota ? `<div class="panel-nota">${esc(et.nota)}</div>` : ''}</div><button class="panel-cerrar" onclick="togglePanel('${et.id}')">✕ cerrar</button></div><div class="panel-jugadores">`;

    rankEtapa.forEach(p=>{
      const totalEt=etPts[p.i];
      const ptsClass2=totalEt>=6?'pts-alto':totalEt>=3?'pts-med':'pts-bajo';
      let chips='';
      keys.forEach(k=>{
        const real=resultados[et.id][k];
        const pron=pronosticos[p.i][et.id][k];
        const info=partidos[et.id][k];
        const pts=calcPts(real,pron);
        const chipCls=real ? (pts===reglas.exacto?'chip-p3':pts===reglas.resultado?'chip-p1':'chip-p0') : '';
        const badgeCls=puntosClass(pts);
        chips+=matchCard({info, real, pron, pts, chipCls, badgeCls});
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
  document.querySelectorAll('.sortable').forEach(t=>t.classList.remove('activa'));
  document.querySelectorAll('.celda-etapa').forEach(c=>c.classList.remove('highlight'));
  if(!yaAbierto){
    panel.classList.add('open'); th.classList.add('activa');
    document.querySelectorAll(`[data-et="${etId}"]`).forEach(c=>c.classList.add('highlight'));
    panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}

function toggleUserFase(btn){
  const bloque = btn.closest('.user-fase');
  if(!bloque) return;
  bloque.classList.toggle('open');
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
window.sortTable = sortTable;
window.toggleUserFase = toggleUserFase;

actualizarFlechasOrden();
renderTabla();
renderPaneles();
renderGrafica();
