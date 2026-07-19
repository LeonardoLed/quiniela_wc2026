
// LÓGICA AUTOMÁTICA — no necesitas editar este archivo para actualizar marcadores.

// ===== Tema claro / oscuro =====
function initTheme(){
  const saved = localStorage.getItem('quiniela-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.body.classList.toggle('theme-dark', theme === 'dark');
  updateThemeButton();
}
function updateThemeButton(){
  const btn = document.getElementById('theme-toggle');
  if(!btn) return;
  const dark = document.body.classList.contains('theme-dark');
  btn.textContent = dark ? '☀️ Tema claro' : '🌙 Tema oscuro';
  btn.setAttribute('aria-pressed', String(dark));
}
function toggleTheme(){
  const dark = !document.body.classList.contains('theme-dark');
  document.body.classList.toggle('theme-dark', dark);
  localStorage.setItem('quiniela-theme', dark ? 'dark' : 'light');
  updateThemeButton();
}

const { reglas, participantes, resultados, pronosticos, partidos } = CONFIG;
const faseAbiertaDefault = CONFIG.faseAbierta || 'd16';

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
const normalizar = (s='') => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function marcadorDe(valor){
  if(!valor) return null;
  return Array.isArray(valor) ? valor : valor.marcador;
}
function pasaDe(valor){
  return valor && !Array.isArray(valor) ? valor.pasa : null;
}
function estadoDe(valor){
  if(!valor || Array.isArray(valor)) return null;
  return valor.estado || null;
}
function estadoPartido(valor){
  if(!valor) return { texto:'POR JUGAR', clase:'pendiente', titulo:'Marcador pendiente' };
  const estado = String(estadoDe(valor) || 'final').toLowerCase();
  if(['parcial','en vivo','vivo','live'].includes(estado)){
    return { texto:'MARCADOR PARCIAL', clase:'parcial', titulo:"Resultado a los 90'" };
  }
  return { texto:'RESULTADO FINAL', clase:'final', titulo:"Resultado a los 90'" };
}

function definicionDe(valor){
  if(!valor || Array.isArray(valor)) return null;
  return valor.definicion || null;
}
function marcadorDefinicion(valor){
  const d = definicionDe(valor);
  if(!d) return null;
  if(Array.isArray(d)) return d;
  return d.marcador || null;
}
function tipoDefinicion(valor){
  const d = definicionDe(valor);
  if(!d) return '';
  if(typeof d === 'string') return d;
  return d.tipo || '';
}
function penalesDe(valor){
  if(!valor || Array.isArray(valor)) return null;
  return Array.isArray(valor.penales) ? valor.penales : null;
}
function definicionHtml(valor){
  const d = definicionDe(valor);
  const penales = penalesDe(valor);
  let html = '';

  if(d){
    const tipo = tipoDefinicion(valor) || 'Definición';
    const marcador = marcadorDefinicion(valor);
    const score = marcador ? `${marcador[0]} <span>:</span> ${marcador[1]}` : '';
    const nota = (d && !Array.isArray(d) && d.nota) ? `<small>${esc(d.nota)}</small>` : '';
    html += `<div class="definicion-box"><span>${esc(tipo)}</span>${score ? `<strong>${score}</strong>` : ''}${nota}</div>`;
  }

  if(penales){
    html += `<div class="penales-box"><span>🥅 Penales</span><strong>${penales[0]} <span>:</span> ${penales[1]}</strong></div>`;
  }

  return html;
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

  const estado = String(estadoDe(real) || 'final').toLowerCase();
  if(['parcial','en vivo','vivo','live'].includes(estado)) return 0;

  const realEmpate = ganadorMarcador(r) === 'E';
  const pronEmpate = ganadorMarcador(p) === 'E';
  let pts = 0;

  // Regla formal vigente:
  // Partido SIN empate real:
  //   +1 por acertar ganador/clasificado.
  //   +2 adicionales por marcador exacto.
  // Partido CON empate real:
  //   +1 por pronosticar empate.
  //   +1 por acertar quién pasa.
  //   +1 por marcador exacto.
  // Máximo por partido: 3 puntos.
  if(realEmpate){
    if(pronEmpate) pts += 1;
    if(clasificado(real) && clasificado(real) === clasificado(pron)) pts += 1;
    if(marcadorExacto(real, pron)) pts += 1;
    return Math.min(pts, 3);
  }

  if(clasificado(real) && clasificado(real) === clasificado(pron)) pts += 1;
  if(marcadorExacto(real, pron)) pts += 2;
  return Math.min(pts, 3);
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
  return pts > 0 ? `+${pts}` : '0';
}
function puntosClass(pts){
  if(pts >= 3) return 'b3';
  if(pts === 2) return 'b2';
  if(pts === 1) return 'b1';
  return 'b0';
}
function matchCard({info, real, pron, pts, chipCls, badgeCls, compact=false}){
  const infoOk = info && info.local && info.local !== 'Por definir';
  if(!infoOk) return `<div class="match-card match-pending"><div class="match-empty">Por definir</div></div>`;
  const estado = estadoPartido(real);
  const mostrarPts = !!real && estado.clase === 'final';
  return `<div class="match-card ${chipCls}">
    ${fechaPartido(info)}
    <div class="match-status ${estado.clase}">${estado.texto}</div>
    <div class="match-teams">
      <div class="match-team">${flagImg(info.flagL)}<span>${esc(info.local)}</span></div>
      <div class="match-vs">VS</div>
      <div class="match-team">${flagImg(info.flagV)}<span>${esc(info.visita)}</span></div>
    </div>
    <div class="match-scores">
      <div class="score-line"><span class="score-label">${estado.titulo}</span><strong>${scoreDisplay(real)}</strong></div>
      <div class="score-line"><span class="score-label">Pron</span><strong>${scoreDisplay(pron)}</strong></div>
    </div>
    ${definicionHtml(real)}
    <div class="match-classifica">
      ${clasificadoHtml(real, info, estado.clase === 'parcial' ? 'Va pasando' : 'Clasificó')}
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
    const res = await fetch(`https://api.github.com/repos/${repoInfo.user}/${repoInfo.repo}/commits?sha=8vos&per_page=1`, {
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
      const chipCls = real ? (pts>=3?'chip-p3':pts===2?'chip-p2':pts===1?'chip-p1':'chip-p0') : '';
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
        const chipCls=real ? (pts>=3?'chip-p3':pts===2?'chip-p2':pts===1?'chip-p1':'chip-p0') : '';
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
window.toggleTheme = toggleTheme;

initTheme();
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
actualizarFlechasOrden();
// ===== Bracket SVG dinámico tipo camino al campeonato =====
function renderBracket(){
  const el = document.getElementById('bracket-grafo');
  if(!el) return;

  const W = 1320;
  const H = 650;
  const R = 19;
  const NS = 'http://www.w3.org/2000/svg';

  const map = {
    d4: {
		  p01: [['d8','p02'], ['d8','p01']], // Francia arriba, Marruecos abajo
		  p02: [['d8','p03'], ['d8','p04']],
		  p03: [['d8','p05'], ['d8','p06']],
		  p04: [['d8','p07'], ['d8','p08']],
	},
    semi: {
      p01: [['d4','p01'], ['d4','p02']],
      p02: [['d4','p03'], ['d4','p04']],
    },
    final: {
      p01: [['semi','p01'], ['semi','p02']],
      p02: [['semi','p01'], ['semi','p02']],
    }
  };

  function statusOf(real){
    if(!real) return 'pendiente';
    const e = String(estadoDe(real) || 'final').toLowerCase();
    if(e === 'parcial' || e === 'en-vivo' || e === 'vivo' || e === 'live') return 'parcial';
    return 'final';
  }
  function teamBase(et,key,side){
    const info = partidos?.[et]?.[key] || {};
    return {
      nombre: side === 'L' ? (info.local || '') : (info.visita || ''),
      flag: side === 'L' ? (info.flagL || '') : (info.flagV || ''),
      side,
      match:`${et}-${key}`
    };
  }
  function winnerSideOf(et,key){
    const real = resultados?.[et]?.[key];
    if(statusOf(real) !== 'final') return null;
    return clasificado(real);
  }
  function loserSideOf(et,key){
    const w = winnerSideOf(et,key);
    if(!w) return null;
    return w === 'L' ? 'V' : 'L';
  }
  function winnerTeam(et,key){
    const w = winnerSideOf(et,key);
    if(!w) return null;
    const info = getParticipants(et,key);
    return w === 'L' ? info[0] : info[1];
  }
  function loserTeam(et,key){
    const l = loserSideOf(et,key);
    if(!l) return null;
    const info = getParticipants(et,key);
    return l === 'L' ? info[0] : info[1];
  }
  function getParticipants(et,key){
    if(et === 'd8') return [teamBase('d8',key,'L'), teamBase('d8',key,'V')];
    if(et === 'final' && key === 'p02'){
      return map.final.p02.map(([a,b]) => loserTeam(a,b) || null);
    }
    const links = map?.[et]?.[key] || [];
    return links.map(([a,b]) => winnerTeam(a,b) || null);
  }
  function nodeTeam(kind, ref, side){
    if(kind === 'team'){
      const [et,key] = ref.split('-');
      return teamBase(et,key,side);
    }
    if(kind === 'winner'){
      const [et,key] = ref.split('-');
      return winnerTeam(et,key);
    }
    if(kind === 'loser'){
      const [et,key] = ref.split('-');
      return loserTeam(et,key);
    }
    return null;
  }
  function originalNodeStatus(ref, side){
    const [et,key] = ref.split('-');
    const real = resultados?.[et]?.[key];
    const st = statusOf(real);
    if(st === 'pendiente') return 'pendiente';
    if(st === 'parcial') return 'parcial';
    const w = clasificado(real);
    if(!w) return 'pendiente';
    return w === side ? 'final' : 'eliminado';
  }
  function advanceNodeStatus(ref, useLoser=false){
    const [et,key] = ref.split('-');
    const real = resultados?.[et]?.[key];
    const st = statusOf(real);
    if(st === 'parcial') return 'parcial';
    if(st === 'final' && (useLoser ? loserTeam(et,key) : winnerTeam(et,key))) return 'final';
    return 'pendiente';
  }

  const nodes = {
    // lado izquierdo: cuatro partidos
    'd8-p01-L':{x:90,y:75,kind:'team',ref:'d8-p01',side:'L'},  'd8-p01-V':{x:90,y:125,kind:'team',ref:'d8-p01',side:'V'},
    'd8-p02-L':{x:90,y:200,kind:'team',ref:'d8-p02',side:'L'}, 'd8-p02-V':{x:90,y:250,kind:'team',ref:'d8-p02',side:'V'},
    'd8-p03-L':{x:90,y:400,kind:'team',ref:'d8-p03',side:'L'}, 'd8-p03-V':{x:90,y:450,kind:'team',ref:'d8-p03',side:'V'},
    'd8-p04-L':{x:90,y:525,kind:'team',ref:'d8-p04',side:'L'}, 'd8-p04-V':{x:90,y:575,kind:'team',ref:'d8-p04',side:'V'},
    'w-d8-p01':{x:230,y:100,kind:'winner',ref:'d8-p01'}, 'w-d8-p02':{x:230,y:225,kind:'winner',ref:'d8-p02'},
    'w-d8-p03':{x:230,y:425,kind:'winner',ref:'d8-p03'}, 'w-d8-p04':{x:230,y:550,kind:'winner',ref:'d8-p04'},
    'w-d4-p01':{x:390,y:162,kind:'winner',ref:'d4-p01'}, 'w-d4-p02':{x:390,y:487,kind:'winner',ref:'d4-p02'},
    'w-semi-p01':{x:545,y:325,kind:'winner',ref:'semi-p01'},
    'loser-semi-p01':{x:595,y:455,kind:'loser',ref:'semi-p01'},

    // lado derecho: cuatro partidos
    'd8-p05-L':{x:1230,y:75,kind:'team',ref:'d8-p05',side:'L'},  'd8-p05-V':{x:1230,y:125,kind:'team',ref:'d8-p05',side:'V'},
    'd8-p06-L':{x:1230,y:200,kind:'team',ref:'d8-p06',side:'L'}, 'd8-p06-V':{x:1230,y:250,kind:'team',ref:'d8-p06',side:'V'},
    'd8-p07-L':{x:1230,y:400,kind:'team',ref:'d8-p07',side:'L'}, 'd8-p07-V':{x:1230,y:450,kind:'team',ref:'d8-p07',side:'V'},
    'd8-p08-L':{x:1230,y:525,kind:'team',ref:'d8-p08',side:'L'}, 'd8-p08-V':{x:1230,y:575,kind:'team',ref:'d8-p08',side:'V'},
    'w-d8-p05':{x:1090,y:100,kind:'winner',ref:'d8-p05'}, 'w-d8-p06':{x:1090,y:225,kind:'winner',ref:'d8-p06'},
    'w-d8-p07':{x:1090,y:425,kind:'winner',ref:'d8-p07'}, 'w-d8-p08':{x:1090,y:550,kind:'winner',ref:'d8-p08'},
    'w-d4-p03':{x:930,y:162,kind:'winner',ref:'d4-p03'}, 'w-d4-p04':{x:930,y:487,kind:'winner',ref:'d4-p04'},
    'w-semi-p02':{x:775,y:325,kind:'winner',ref:'semi-p02'},
    'loser-semi-p02':{x:725,y:455,kind:'loser',ref:'semi-p02'},

    // centro
    'champion':{x:660,y:325,kind:'winner',ref:'final-p01'},
    'third-winner':{x:660,y:455,kind:'winner',ref:'final-p02'},
    'trophy':{x:660,y:325,kind:'trophy'},
    'third-medal':{x:660,y:455,kind:'third-trophy'}
  };

  const links = [
    ['d8-p01-L','w-d8-p01','d8-p01'],['d8-p01-V','w-d8-p01','d8-p01'],
    ['d8-p02-L','w-d8-p02','d8-p02'],['d8-p02-V','w-d8-p02','d8-p02'],
    ['d8-p03-L','w-d8-p03','d8-p03'],['d8-p03-V','w-d8-p03','d8-p03'],
    ['d8-p04-L','w-d8-p04','d8-p04'],['d8-p04-V','w-d8-p04','d8-p04'],
    ['w-d8-p01','w-d4-p01','d4-p01'],['w-d8-p02','w-d4-p01','d4-p01'],
    ['w-d8-p03','w-d4-p02','d4-p02'],['w-d8-p04','w-d4-p02','d4-p02'],
    ['w-d4-p01','w-semi-p01','semi-p01'],['w-d4-p02','w-semi-p01','semi-p01'],
    ['w-semi-p01','champion','final-p01'],
    ['loser-semi-p01','third-winner','final-p02'],

    ['d8-p05-L','w-d8-p05','d8-p05'],['d8-p05-V','w-d8-p05','d8-p05'],
    ['d8-p06-L','w-d8-p06','d8-p06'],['d8-p06-V','w-d8-p06','d8-p06'],
    ['d8-p07-L','w-d8-p07','d8-p07'],['d8-p07-V','w-d8-p07','d8-p07'],
    ['d8-p08-L','w-d8-p08','d8-p08'],['d8-p08-V','w-d8-p08','d8-p08'],
    ['w-d8-p05','w-d4-p03','d4-p03'],['w-d8-p06','w-d4-p03','d4-p03'],
    ['w-d8-p07','w-d4-p04','d4-p04'],['w-d8-p08','w-d4-p04','d4-p04'],
    ['w-d4-p03','w-semi-p02','semi-p02'],['w-d4-p04','w-semi-p02','semi-p02'],
    ['w-semi-p02','champion','final-p01'],
    ['loser-semi-p02','third-winner','final-p02']
  ];

function sameTeam(a,b){
  if(!a || !b) return false;
  const na = normalizar(a.nombre || '');
  const nb = normalizar(b.nombre || '');
  const fa = String(a.flag || '').toLowerCase();
  const fb = String(b.flag || '').toLowerCase();
  return (na && nb && na === nb) || (fa && fb && fa === fb);
}

function teamTournamentStatus(team){
  if(!team) return 'pendiente';

  let hasPlayed = false;
  let isPlaying = false;
  let eliminated = false;

  const rounds = ['d8','d4','semi','final'];

  rounds.forEach(et => {
    Object.keys(resultados?.[et] || {}).forEach(key => {
      const real = resultados?.[et]?.[key];
      const st = statusOf(real);
      const parts = getParticipants(et, key);
      const participa = parts.some(p => sameTeam(p, team));

      if(!participa) return;

      if(st === 'parcial'){
        isPlaying = true;
        return;
      }

      if(st !== 'final') return;

      hasPlayed = true;
      const win = winnerTeam(et, key);

      if(win && !sameTeam(win, team)){
        eliminated = true;
      }
    });
  });

  if(eliminated) return 'eliminado';
  if(isPlaying) return 'parcial';
  if(hasPlayed) return 'final';
  return 'pendiente';
}

function nodeStatus(id){
  const n = nodes[id];
  if(!n) return 'pendiente';

  if(n.kind === 'trophy' || n.kind === 'third-trophy'){
    return 'pendiente';
  }

  // El perdedor de una semifinal sigue activo únicamente
  // en el nodo que lo conduce al partido por tercer lugar.
  if(n.kind === 'loser'){
    return advanceNodeStatus(n.ref, true);
  }

  // Los demás nodos reflejan el estado actual del equipo.
  // Si fue eliminado en una ronda posterior, se apaga también
  // su bandera en el camino previo.
  const team = resolveTeam(id);
  if(team) return teamTournamentStatus(team);

  return 'pendiente';
}

function lineStatus(from, to, matchRef){
  const fromNode = nodes[from];
  const fromTeam = resolveTeam(from);

  if(!fromNode || !fromTeam) return 'pendiente';

  // Ganador de semifinal rumbo a la gran final.
  if(
    fromNode.kind === 'winner' &&
    fromNode.ref.startsWith('semi-') &&
    matchRef === 'final-p01'
  ){
    const [semiEt, semiKey] = fromNode.ref.split('-');
    const semiSt = statusOf(resultados?.[semiEt]?.[semiKey]);
    const finalSt = statusOf(resultados?.final?.p01);

    if(semiSt === 'parcial') return 'parcial';
    if(semiSt !== 'final' || !winnerTeam(semiEt, semiKey)) return 'pendiente';
    if(finalSt === 'pendiente') return 'proxima-final';
    if(finalSt === 'parcial') return 'parcial';

    const ganadorFinal = winnerTeam('final', 'p01');
    return ganadorFinal && sameTeam(fromTeam, ganadorFinal) ? 'final' : 'pendiente';
  }

  // Perdedor de semifinal rumbo al partido por tercer lugar.
  if(
    fromNode.kind === 'loser' &&
    fromNode.ref.startsWith('semi-') &&
    matchRef === 'final-p02'
  ){
    const [semiEt, semiKey] = fromNode.ref.split('-');
    const semiSt = statusOf(resultados?.[semiEt]?.[semiKey]);
    const tercerSt = statusOf(resultados?.final?.p02);

    if(semiSt === 'parcial') return 'parcial';
    if(semiSt !== 'final' || !loserTeam(semiEt, semiKey)) return 'pendiente';
    if(tercerSt === 'pendiente') return 'proximo-tercer';
    if(tercerSt === 'parcial') return 'parcial';

    const ganadorTercero = winnerTeam('final', 'p02');
    return ganadorTercero && sameTeam(fromTeam, ganadorTercero) ? 'final' : 'pendiente';
  }

  // Un equipo eliminado no conserva líneas verdes históricas.
  if(teamTournamentStatus(fromTeam) === 'eliminado') return 'pendiente';

  const [et, key] = matchRef.split('-');
  const realSt = statusOf(resultados?.[et]?.[key]);

  if(realSt === 'parcial') return 'parcial';
  if(realSt !== 'final') return 'pendiente';

  const winner = winnerTeam(et, key);
  return winner && sameTeam(fromTeam, winner) ? 'final' : 'pendiente';
}
	
  function elbow(a,b){
    const n1 = nodes[a], n2 = nodes[b];
    const dir = n2.x >= n1.x ? 1 : -1;
    const sx = n1.x + dir*(R+3), sy = n1.y;
    const ex = n2.x - dir*(R+3), ey = n2.y;
    const mx = sx + (ex-sx) * 0.55;
    return `M ${sx} ${sy} H ${mx} V ${ey} H ${ex}`;
  }
  function flagHref(code){
    if(!code) return '';
    return `https://flagcdn.com/${String(code).toLowerCase().trim()}.svg`;
  }
  function resolveTeam(id){
    const n = nodes[id];
    if(!n || n.kind === 'trophy' || n.kind === 'third-trophy') return null;
    return nodeTeam(n.kind, n.ref, n.side);
  }
  function drawLine([from,to,m]){
    return `<path class="wc-svg-line ${lineStatus(from,to,m)}" d="${elbow(from,to)}"/>`;
  }
  function drawNode(id){
    const n = nodes[id];
    if(n.kind === 'trophy'){
      return `<g class="wc-svg-trophy"><circle cx="${n.x}" cy="${n.y}" r="34"/><text x="${n.x}" y="${n.y+7}" text-anchor="middle">🏆</text></g>`;
    }
    if(n.kind === 'third-trophy'){
      return `<g class="wc-svg-third"><circle cx="${n.x}" cy="${n.y}" r="24"/><text x="${n.x}" y="${n.y+6}" text-anchor="middle">🥉</text></g>`;
    }
    const t = resolveTeam(id);
    const st = nodeStatus(id);
    const clipId = `clip-${id.replace(/[^a-zA-Z0-9_-]/g,'')}`;
    const title = t?.nombre || 'Por definir';
    const img = t?.flag ? `<image href="${flagHref(t.flag)}" x="${n.x-R}" y="${n.y-R}" width="${R*2}" height="${R*2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>` : `<text class="wc-svg-question" x="${n.x}" y="${n.y+5}" text-anchor="middle">?</text>`;
    return `<g class="wc-svg-node ${st}"><title>${esc(title)}</title><clipPath id="${clipId}"><circle cx="${n.x}" cy="${n.y}" r="${R-1}"/></clipPath><circle class="wc-svg-disc" cx="${n.x}" cy="${n.y}" r="${R}"/>${img}</g>`;
  }

  el.innerHTML = `<svg class="wc-svg-bracket" viewBox="0 0 ${W} ${H}" role="img" aria-label="Camino al campeonato generado desde config.js">
    <defs>
      <filter id="wcNodeShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0f172a" flood-opacity=".16"/></filter>
    </defs>
    ${links.map(drawLine).join('')}
    ${Object.keys(nodes).map(drawNode).join('')}
  </svg>`;
}


function safeRender(fn, name){
  try { fn(); }
  catch(err){ console.error('Error renderizando ' + name, err); }
}

function renderAll(){
  safeRender(renderTabla, 'tabla');
  safeRender(renderPaneles, 'paneles');
  safeRender(renderBracket, 'bracket');
  safeRender(renderGrafica, 'grafica');
}

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAll);
} else {
  renderAll();
}
