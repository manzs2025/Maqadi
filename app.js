import { CATS, CATALOG, RETIRED, SPRITE } from './catalog.js';

const VERSION = '1.3';
const DATA_VER = 2; // رقم ترحيل البيانات: 2 = قائمة الإكسل وإرجاع الصور الأولى
const K = { cfg: 'maqadi.cfg', data: 'maqadi.data', photos: 'maqadi.photos', me: 'maqadi.me', theme: 'maqadi.theme' };

/* ---------- أدوات صغيرة ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const AR = '٠١٢٣٤٥٦٧٨٩';
const ar = (n) => String(n).replace(/\d/g, (d) => AR[d]);
const norm = (s) => String(s || '').trim()
  .replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
  .replace(/\s+/g, ' ').toLowerCase();
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ممتلئ أو ممنوع */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* تجاهل */ } }
};
const CHECK = (n = 12) => `<svg width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>`;
const PEN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>';
const SHARE = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';

const UP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
const DOWN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

const baseCat = Object.fromEntries(CATS);
let catName = {}, catOrder = {}, CL = [];
const baseById = Object.fromEntries(CATALOG.map((c, i) => [c[0], { name: c[1], cat: c[2], emoji: c[3], order: i }]));

/* ---------- الحالة ---------- */
const MAPS = ['sel', 'got', 'custom', 'names', 'cats', 'hidden', 'catx'];
const blank = () => ({ sel: {}, got: {}, custom: {}, names: {}, cats: {}, hidden: {}, catx: {}, last: null });
function normalize(d) {
  const b = blank();
  d = d || {};
  for (const k of MAPS) b[k] = d[k] && typeof d[k] === 'object' ? d[k] : {};
  b.last = d.last && d.last.n ? d.last : null;
  b.mig = typeof d.mig === 'number' ? d.mig : 0;
  return b;
}

const S = {
  data: normalize(LS.get(K.data, null)),
  photos: LS.get(K.photos, {}) || {},
  ui: { mode: 'pick', cat: 'all', q: '', edit: false, pulse: null },
  sync: 'local', syncErr: '', photoErr: '',
  cfg: LS.get(K.cfg, null),
  me: LS.get(K.me, '') || ''
};
let cloud = null;

function setPath(o, path, v) {
  const ks = path.split('.');
  let t = o;
  for (let i = 0; i < ks.length - 1; i++) {
    if (!t[ks[i]] || typeof t[ks[i]] !== 'object') t[ks[i]] = {};
    t = t[ks[i]];
  }
  const k = ks[ks.length - 1];
  if (v === undefined) delete t[k]; else t[k] = v;
}

// كل تغيير يمر من هنا: يُطبَّق فوراً ثم يُرسل للسحابة (أو يُحفظ محلياً)
function apply(changes) {
  for (const p in changes) setPath(S.data, p, changes[p]);
  if (cloud) cloud.update(changes); else LS.set(K.data, S.data);
  render();
}

function setPhoto(id, dataUrl) {
  if (dataUrl) S.photos[id] = dataUrl; else delete S.photos[id];
  if (cloud) cloud.setPhoto(id, dataUrl || null); else LS.set(K.photos, S.photos);
  render();
}

/* ---------- الأقسام ---------- */
// catx: تعديلات الأقسام المتزامنة. للأقسام الجاهزة {n: اسم جديد, o: ترتيب, h: مخفي}، وللأقسام الجديدة {n, o, t}
function catList() {
  const x = S.data.catx, out = [];
  CATS.forEach(([id, n], i) => {
    const o = x[id] || {};
    if (o.h && id !== 'other') return;
    out.push({ id, name: o.n || n, base: true, o: typeof o.o === 'number' ? o.o : (id === 'other' ? 1000 : i) });
  });
  for (const id of Object.keys(x)) {
    const o = x[id];
    if (baseCat[id] || !o || !o.n || o.h) continue;
    out.push({ id, name: o.n, base: false, o: typeof o.o === 'number' ? o.o : 100 + (o.t || 0) / 1e13 });
  }
  return out.sort((a, b) => a.o - b.o);
}
function refreshCats() {
  CL = catList();
  catName = Object.fromEntries(CL.map((c) => [c.id, c.name]));
  catOrder = Object.fromEntries(CL.map((c, i) => [c.id, i]));
}
const validCat = (c) => (catName[c] ? c : 'other');

/* ---------- ترحيل البيانات (مرة واحدة لكل عائلة) ---------- */
// يجعل الأقسام والأغراض الجاهزة مطابقة لقائمة الإكسل، ويدمج الأغراض المضافة يدوياً
// إذا صار لها مربع جاهز بنفس الاسم، ويحذف الصور الملتقطة للأغراض الجاهزة لتعود أيقوناتها الأولى.
const OLD_CAT_NAMES = { 'ألبان وخبز': 'dairy' };
function migrate() {
  const d = S.data;
  if ((d.mig || 0) >= DATA_VER) return false;
  const baseIds = new Set(CATALOG.map((c) => c[0]));
  const baseByName = {};
  CATALOG.forEach((c) => { baseByName[norm(c[1])] = c[0]; });
  const catByName = {};
  CATS.forEach((c) => { catByName[norm(c[1])] = c[0]; });
  for (const n in OLD_CAT_NAMES) catByName[norm(n)] = OLD_CAT_NAMES[n];

  const sel = {}, got = {}, custom = {}, catx = {}, catMap = {}, dropPhotos = [];
  for (const id of Object.keys(d.catx)) {
    if (baseCat[id]) continue; // تعديلات الأقسام الجاهزة تُلغى لتتبع الإكسل
    const o = d.catx[id];
    if (!o || !o.n) continue;
    const m = catByName[norm(o.n)];
    if (m) catMap[id] = m; else catx[id] = { n: o.n, t: o.t || Date.now() };
  }
  for (const id of baseIds) { if (d.sel[id]) sel[id] = true; if (d.got[id]) got[id] = true; }
  for (const id of Object.keys(d.custom)) {
    const c = d.custom[id];
    if (!c || !c.n) continue;
    const b = baseByName[norm(c.n)];
    if (b) {
      if (d.sel[id]) sel[b] = true;
      if (d.got[id]) got[b] = true;
      dropPhotos.push(id);
      continue;
    }
    custom[id] = Object.assign({}, c, { c: catMap[c.c] || c.c });
    if (d.sel[id]) sel[id] = true;
    if (d.got[id]) got[id] = true;
  }
  for (const id of Object.keys(got)) if (!sel[id]) delete got[id];
  for (const id of baseIds) dropPhotos.push(id);
  for (const id of RETIRED) dropPhotos.push(id);

  apply({ sel, got, custom, catx, names: {}, cats: {}, hidden: {}, mig: DATA_VER });
  for (const id of new Set(dropPhotos)) if (S.photos[id]) setPhoto(id, null);
  return true;
}

/* ---------- الأغراض ---------- */
function allItems() {
  refreshCats();
  const d = S.data, out = [];
  for (const [id, n, c, e] of CATALOG) {
    if (d.hidden[id]) continue;
    out.push({ id, base: true, name: d.names[id] || n, baseName: n, cat: validCat(d.cats[id] || c), baseCat: c, emoji: e, order: baseById[id].order });
  }
  for (const id of Object.keys(d.custom)) {
    const c = d.custom[id];
    if (!c || !c.n) continue;
    out.push({ id, base: false, name: c.n, cat: validCat(c.c), emoji: null, order: 10000 + (c.t || 0) / 1e13, t: c.t || 0 });
  }
  return out;
}
const sortItems = (list) => list.sort((a, b) => (catOrder[a.cat] - catOrder[b.cat]) || (a.order - b.order));
const itemById = (id) => allItems().find((i) => i.id === id);
const lastStamp = (name) => ({ n: name, b: S.me || '', t: Date.now() });

const SPR = Object.fromEntries(SPRITE.ids.map((id, k) => [id, k]));
const SPR_SIZE = `${SPRITE.cols * 100}% ${SPRITE.rows * 100}%`;
function visual(i) {
  if (S.photos[i.id]) return `<img src="${esc(S.photos[i.id])}" alt="">`;
  if (i.base && SPR[i.id] !== undefined) {
    const k = SPR[i.id], x = (k % SPRITE.cols) * 100 / (SPRITE.cols - 1), y = Math.floor(k / SPRITE.cols) * 100 / (SPRITE.rows - 1);
    return `<span class="spr" aria-hidden="true" style="background-size:${SPR_SIZE};background-position:${x.toFixed(4)}% ${y.toFixed(4)}%"></span>`;
  }
  if (i.emoji) return `<span class="em" aria-hidden="true">${i.emoji}</span>`;
  return `<span class="ini" aria-hidden="true">${esc(i.name.charAt(0))}</span>`;
}

/* ---------- العرض ---------- */
function render() {
  renderSync();
  renderTabs();
  if (S.ui.mode === 'pick') { renderChips(); renderGrid(); } else renderShop();
  renderDock();
}

function renderSync() {
  const map = { local: 'محلي', connecting: 'يتصل…', online: 'متزامن', offline: 'بلا اتصال', error: 'خطأ' };
  const long = { local: 'محفوظ على هذا الجوال فقط', connecting: 'جارٍ الاتصال', online: 'متزامن مع جوالات العائلة', offline: 'بدون اتصال، يُرسل لاحقاً', error: 'خطأ في المزامنة' };
  const st = S.photoErr && S.sync === 'online' ? 'error' : S.sync;
  $('#syncPill').className = 'pill ' + st;
  $('#syncTxt').textContent = map[st];
  $('#syncPill').setAttribute('aria-label', 'حالة المزامنة: ' + long[st]);
}

function counts() {
  const items = allItems().filter((i) => S.data.sel[i.id]);
  const got = items.filter((i) => S.data.got[i.id]).length;
  return { items, sel: items.length, got, left: items.length - got };
}

function renderTabs() {
  const pick = S.ui.mode === 'pick';
  $('#tabPick').setAttribute('aria-pressed', String(pick));
  $('#tabShop').setAttribute('aria-pressed', String(!pick));
  const { left } = counts();
  const cnt = $('#shopCnt');
  cnt.hidden = !left;
  cnt.textContent = ar(left);
  $('#pickView').hidden = !pick;
  $('#shopView').hidden = pick;
  $('#editBtn').hidden = !pick;
  $('#editBtn').classList.toggle('on', S.ui.edit);
  $('#editBtn').setAttribute('aria-pressed', String(S.ui.edit));
  $('#editHint').hidden = !(pick && S.ui.edit);
}

function renderChips() {
  const items = allItems();
  if (S.ui.cat !== 'all' && S.ui.cat !== 'sel' && !catName[S.ui.cat]) S.ui.cat = 'all';
  const selN = items.filter((i) => S.data.sel[i.id]).length;
  const chips = [['all', 'الكل'], ['sel', 'المطلوبة' + (selN ? ' ' + ar(selN) : '')]].concat(CL.map((c) => [c.id, c.name]));
  $('#chips').innerHTML = chips.map((c) =>
    `<button type="button" data-cat="${c[0]}" aria-pressed="${c[0] === S.ui.cat}">${esc(c[1])}</button>`).join('')
    + (S.ui.edit ? '<button type="button" class="addcat" data-cats="1">+ الأقسام</button>' : '');
}

function tileHTML(i) {
  const on = !!S.data.sel[i.id];
  const fresh = !i.base && !S.photos[i.id] && Date.now() - i.t < 3 * 864e5;
  return `<button type="button" class="tile${on ? ' on' : ''}${S.ui.pulse === i.id ? ' pop' : ''}" data-id="${i.id}" aria-pressed="${on}">
    <span class="vis">${visual(i)}</span>
    <span class="nm">${esc(i.name)}</span>
    ${on ? `<span class="ck">${CHECK(12)}</span>` : ''}
    ${S.ui.edit ? `<span class="ed">${PEN}</span>` : (fresh ? '<span class="badge-new">جديد</span>' : '')}
  </button>`;
}

function renderGrid() {
  const items = allItems();
  const q = norm(S.ui.q);
  let html = '';
  if (q) {
    const list = sortItems(items.filter((i) => norm(i.name).includes(q)));
    if (!items.some((i) => norm(i.name) === q)) {
      const raw = S.ui.q.trim();
      html += `<button type="button" class="tile addtile" data-add="1"><span class="vis"><span class="ini">${esc(raw.charAt(0))}</span></span><span class="nm">أضف «${esc(raw)}»</span></button>`;
    }
    html += list.map(tileHTML).join('');
  } else if (S.ui.cat === 'all') {
    let cur = null;
    for (const i of sortItems(items)) {
      if (i.cat !== cur) { cur = i.cat; html += `<div class="ghead">${esc(catName[cur])}</div>`; }
      html += tileHTML(i);
    }
  } else {
    const list = sortItems(items.filter((i) => (S.ui.cat === 'sel' ? S.data.sel[i.id] : i.cat === S.ui.cat)));
    html = list.length ? list.map(tileHTML).join('')
      : `<div class="empty">${S.ui.cat === 'sel' ? 'ما اخترت شيئاً بعد.<br>اضغط على أي مربع ليُضاف إلى الطلبات.' : 'لا توجد أغراض في هذا القسم.'}</div>`;
  }
  $('#grid').innerHTML = html;
}

function rowHTML(i) {
  const g = !!S.data.got[i.id];
  return `<button type="button" class="row${g ? ' got' : ''}" data-id="${i.id}" aria-pressed="${g}">
    <span class="vis">${visual(i)}</span><span class="rn">${esc(i.name)}</span><span class="rc">${CHECK(15)}</span></button>`;
}

function renderShop() {
  const { items, sel, got, left } = counts();
  const v = $('#shopView');
  if (!sel) {
    v.innerHTML = `<div class="prog"><b>القائمة فاضية</b><span style="line-height:1.8">ارجع إلى «أختار الطلبات» واضغط على الأغراض التي تحتاجها.</span></div>`;
    return;
  }
  const pct = Math.round((got * 100) / sel);
  let html = `<div class="prog"><div class="l"><b>اشتريت ${ar(got)} من ${ar(sel)}</b><span>${ar(pct)}٪</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
  if (!left) html += '<div class="hint done">اكتملت المقاضي. اضغط «إنهاء» لتفريغ القائمة.</div>';
  let cur = null;
  for (const i of sortItems(items.filter((i) => !S.data.got[i.id]))) {
    if (i.cat !== cur) { cur = i.cat; html += `<div class="shead">${esc(catName[cur])}</div>`; }
    html += rowHTML(i);
  }
  if (got) {
    html += `<div class="shead">في العربة (${ar(got)})</div>`;
    html += sortItems(items.filter((i) => S.data.got[i.id])).map(rowHTML).join('');
  }
  v.innerHTML = html;
}

function renderDock() {
  const { sel, got, left } = counts();
  const pick = S.ui.mode === 'pick';
  const last = S.data.last;
  let n, title, sub, extra = '';
  if (pick) {
    n = sel;
    title = sel ? 'غرض في قائمة الطلبات' : 'القائمة فاضية';
    sub = last ? `آخر إضافة: ${last.n}${last.b ? ' · ' + last.b : ''}` : 'اضغط على المربعات لإضافتها';
  } else {
    n = left;
    title = left ? 'باقي في القائمة' : (sel ? 'كل الأغراض في العربة' : 'القائمة فاضية');
    sub = got ? `في العربة ${ar(got)}` : 'اضغط الغرض عند وضعه في العربة';
    if (got) extra = '<button type="button" class="fin" id="finBtn">إنهاء</button>';
  }
  $('#dock').innerHTML = `<span class="n">${n ? ar(n) : CHECK(16)}</span>
    <div class="t"><b>${esc(title)}</b><span>${esc(sub)}</span></div>
    ${extra}<button type="button" id="shareBtn" aria-label="مشاركة القائمة">${SHARE}</button>`;
}

/* ---------- الأفعال ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}
function buzz() { try { navigator.vibrate && navigator.vibrate(12); } catch (e) { /* لا يدعم */ } }
function pulse(id) { S.ui.pulse = id; setTimeout(() => { if (S.ui.pulse === id) S.ui.pulse = null; }, 400); }

function tapPick(id) {
  if (S.ui.edit) { openEdit(id); return; }
  const it = itemById(id);
  if (!it) return;
  pulse(id);
  buzz();
  if (S.data.sel[id]) apply({ ['sel.' + id]: undefined, ['got.' + id]: undefined });
  else apply({ ['sel.' + id]: true, last: lastStamp(it.name) });
}

function tapShop(id) {
  buzz();
  apply({ ['got.' + id]: S.data.got[id] ? undefined : true });
}

function addFromInput() {
  const raw = $('#q').value.trim().replace(/\s+/g, ' ');
  if (!raw) { $('#q').focus(); return; }
  if (raw.length > 40) { toast('الاسم طويل، اختصره قليلاً'); return; }
  const key = norm(raw);
  const ex = allItems().find((i) => norm(i.name) === key);
  if (ex) {
    pulse(ex.id);
    if (!S.data.sel[ex.id]) apply({ ['sel.' + ex.id]: true, last: lastStamp(ex.name) });
    toast(`«${ex.name}» في قائمة الطلبات`);
  } else {
    const hiddenBase = CATALOG.find((c) => S.data.hidden[c[0]] && norm(S.data.names[c[0]] || c[1]) === key);
    if (hiddenBase) {
      const id = hiddenBase[0];
      pulse(id);
      apply({ ['hidden.' + id]: undefined, ['sel.' + id]: true, last: lastStamp(raw) });
    } else {
      const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      const cat = catName[S.ui.cat] ? S.ui.cat : 'other';
      pulse(id);
      apply({ ['custom.' + id]: { n: raw, c: cat, t: Date.now() }, ['sel.' + id]: true, last: lastStamp(raw) });
      toast(`أُضيف «${raw}» وصار له مربع دائم`);
    }
  }
  buzz();
  $('#q').value = '';
  S.ui.q = '';
  render();
}

function shareText() {
  const items = sortItems(allItems().filter((i) => S.data.sel[i.id] && !S.data.got[i.id]));
  if (!items.length) return null;
  let out = 'مقاضي البيت 🛒\n', cur = null;
  for (const i of items) {
    if (i.cat !== cur) { cur = i.cat; out += `\n*${catName[cur]}*\n`; }
    out += `- ${i.name}\n`;
  }
  return out.trim();
}

async function copyText(t) {
  if (window.AndroidBridge) { window.AndroidBridge.copy(t); return true; }
  try { await navigator.clipboard.writeText(t); return true; } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (er) { ok = false; }
    ta.remove();
    return ok;
  }
}

async function shareOut(text, title) {
  if (window.AndroidBridge) { window.AndroidBridge.share(text); return; }
  if (navigator.share) { try { await navigator.share({ text, title }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  if (await copyText(text)) toast('نُسخ النص، ألصقه حيث تريد');
}

function share() {
  const t = shareText();
  if (!t) { toast('لا يوجد شيء باقٍ في القائمة'); return; }
  shareOut(t, 'مقاضي البيت');
}

/* ---------- الصور ---------- */
function shrink(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = 160, c = document.createElement('canvas');
      c.width = c.height = s;
      const k = Math.max(s / img.width, s / img.height);
      const w = img.width * k, h = img.height * k;
      const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, s, s);
      x.drawImage(img, (s - w) / 2, (s - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('img')); };
    img.src = url;
  });
}
function pickPhoto() {
  return new Promise((resolve) => {
    const inp = $('#photoIn');
    inp.value = '';
    inp.onchange = async () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      try { resolve(await shrink(f)); } catch (e) { toast('تعذّرت قراءة الصورة'); }
    };
    inp.click();
  });
}

/* ---------- النوافذ السفلية ---------- */
let sheetOpen = false;
function sheet(html, mount) {
  $('#sheet').innerHTML = '<div class="grab"></div>' + html;
  $('#scrim').hidden = false;
  sheetOpen = true;
  if (mount) mount($('#sheet'));
}
function closeSheet() {
  $('#scrim').hidden = true;
  $('#sheet').innerHTML = '';
  sheetOpen = false;
}
// زر يحتاج ضغطتين للتأكيد
function twoTap(btn, label, fn) {
  let armed = false;
  btn.addEventListener('click', () => {
    if (armed) { fn(); return; }
    armed = true;
    const old = btn.textContent;
    btn.textContent = label;
    setTimeout(() => { armed = false; if (btn.isConnected) btn.textContent = old; }, 3000);
  });
}

function openEdit(id) {
  const it = itemById(id);
  if (!it) return;
  let photo; // undefined = بدون تغيير، null = إزالة، نص = صورة جديدة
  const hasPhoto = () => (photo === undefined ? !!S.photos[id] : !!photo);
  sheet(`<h2>تعديل المربع</h2>
    <div class="phrow"><span class="vis" id="eVis">${visual(it)}</span>
      <div class="btns" style="flex:1"><button type="button" class="btn ghost" id="ePick"></button><button type="button" class="btn ghost" id="eNoPh">إزالة الصورة</button></div></div>
    <div class="field"><label for="eName">الاسم</label><input id="eName" maxlength="40" value="${esc(it.name)}"></div>
    <div class="field"><label for="eCat">القسم</label><select id="eCat">${CL.map((c) => `<option value="${c.id}"${c.id === it.cat ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
    <div class="err" id="eErr"></div>
    <div class="btns"><button type="button" class="btn green" id="eSave">حفظ</button><button type="button" class="btn danger" id="eDel">${it.base ? 'إخفاء المربع' : 'حذف المربع'}</button></div>`,
  (root) => {
    const refresh = () => {
      $('#ePick', root).textContent = hasPhoto() ? 'تغيير الصورة' : 'إضافة صورة';
      $('#eNoPh', root).hidden = !hasPhoto();
      const tmp = Object.assign({}, it);
      const saved = S.photos[id];
      if (photo !== undefined) { if (photo) S.photos[id] = photo; else delete S.photos[id]; }
      $('#eVis', root).innerHTML = visual(tmp);
      if (saved) S.photos[id] = saved; else delete S.photos[id];
    };
    refresh();
    $('#ePick', root).onclick = async () => { const d = await pickPhoto(); if (d) { photo = d; refresh(); } };
    $('#eNoPh', root).onclick = () => { photo = null; refresh(); };
    $('#eSave', root).onclick = () => {
      const name = $('#eName', root).value.trim().replace(/\s+/g, ' ');
      const cat = $('#eCat', root).value;
      if (!name) { $('#eErr', root).textContent = 'اكتب اسم الغرض'; return; }
      const dup = allItems().find((i) => i.id !== id && norm(i.name) === norm(name));
      if (dup) { $('#eErr', root).textContent = 'يوجد غرض بهذا الاسم'; return; }
      const ch = {};
      if (it.base) {
        if (name !== (S.data.names[id] || it.baseName)) ch['names.' + id] = name === it.baseName ? undefined : name;
        if (cat !== it.cat) ch['cats.' + id] = cat === it.baseCat ? undefined : cat;
      } else {
        if (name !== it.name) ch['custom.' + id + '.n'] = name;
        if (cat !== it.cat) ch['custom.' + id + '.c'] = cat;
      }
      if (Object.keys(ch).length) apply(ch);
      if (photo !== undefined) setPhoto(id, photo);
      closeSheet();
      toast('حُفظ التعديل');
    };
    twoTap($('#eDel', root), 'اضغط مرة أخرى للتأكيد', () => {
      if (it.base) apply({ ['hidden.' + id]: true, ['sel.' + id]: undefined, ['got.' + id]: undefined });
      else apply({ ['custom.' + id]: undefined, ['sel.' + id]: undefined, ['got.' + id]: undefined });
      if (S.photos[id]) setPhoto(id, null);
      closeSheet();
      toast(it.base ? 'أُخفي المربع، تستطيع إظهاره من الإعدادات' : 'حُذف المربع');
    });
  });
}

function openFinish() {
  const { got, left } = counts();
  sheet(`<h2>إنهاء التسوق؟</h2>
    <p>سيُحذف ${ar(got)} غرض مشترى من القائمة${left ? `، ويبقى ${ar(left)} غرض لم يُشترَ للمرة القادمة` : ''}.</p>
    <div class="btns"><button type="button" class="btn green" id="fOk">إنهاء</button><button type="button" class="btn ghost" id="fNo">رجوع</button></div>`,
  (root) => {
    $('#fNo', root).onclick = closeSheet;
    $('#fOk', root).onclick = () => {
      const ch = {};
      for (const id of Object.keys(S.data.got)) { ch['sel.' + id] = undefined; ch['got.' + id] = undefined; }
      if (!left) S.ui.mode = 'pick';
      apply(ch);
      closeSheet();
      toast('انتهى التسوق، الله يعطيك العافية');
    };
  });
}

/* ---------- الأقسام: إضافة وتعديل ---------- */
function openCats() {
  const items = allItems();
  const cnt = {};
  for (const i of items) cnt[i.cat] = (cnt[i.cat] || 0) + 1;
  const rows = CL.map((c, i) => `<div class="catrow" data-cid="${c.id}">
      <label class="sr" for="cn_${c.id}">اسم القسم</label>
      <input id="cn_${c.id}" maxlength="24" value="${esc(c.name)}">
      <span class="cn">${ar(cnt[c.id] || 0)}</span>
      <button type="button" data-up aria-label="تحريك للأعلى"${i === 0 ? ' disabled' : ''}>${UP}</button>
      <button type="button" data-down aria-label="تحريك للأسفل"${i === CL.length - 1 ? ' disabled' : ''}>${DOWN}</button>
      ${c.id === 'other' ? '' : '<button type="button" class="del" data-del>حذف</button>'}
    </div>`).join('');
  sheet(`<h2>الأقسام</h2>
    <p>غيّر الاسم واضغط خارج الخانة ليُحفظ، ورتّب بالأسهم. عند حذف قسم تنتقل أغراضه إلى «${esc(catName.other)}».</p>
    <div class="catlist">${rows}</div>
    <form class="addrow" id="ncForm" autocomplete="off">
      <label class="sr" for="ncName">قسم جديد</label>
      <input id="ncName" maxlength="24" placeholder="اسم قسم جديد">
      <button class="btn" type="submit">أضف</button></form>
    <div class="err" id="cErr"></div>
    <button type="button" class="btn ghost" id="cClose">تم</button>`,
  (root) => {
    const err = (m) => { $('#cErr', root).textContent = m; };
    const taken = (name, except) => CL.some((c) => c.id !== except && norm(c.name) === norm(name));
    const order = (ids) => { const ch = {}; ids.forEach((id, i) => { ch['catx.' + id + '.o'] = i; }); return ch; };
    $('#cClose', root).onclick = closeSheet;
    root.querySelectorAll('.catrow').forEach((row) => {
      const id = row.dataset.cid;
      const c = CL.find((x) => x.id === id);
      const inp = $('input', row);
      inp.onchange = () => {
        const name = inp.value.trim().replace(/\s+/g, ' ');
        if (!name) { inp.value = c.name; err('اسم القسم لا يكون فارغاً'); return; }
        if (taken(name, id)) { inp.value = c.name; err('يوجد قسم بهذا الاسم'); return; }
        err('');
        if (name === c.name) return;
        const def = baseCat[id];
        apply({ ['catx.' + id + '.n']: def && name === def ? undefined : name });
        toast('حُفظ اسم القسم');
      };
      inp.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } };
      const move = (d) => {
        const ids = CL.map((x) => x.id), i = ids.indexOf(id), j = i + d;
        if (j < 0 || j >= ids.length) return;
        [ids[i], ids[j]] = [ids[j], ids[i]];
        apply(order(ids));
        openCats();
      };
      $('[data-up]', row).onclick = () => move(-1);
      $('[data-down]', row).onclick = () => move(1);
      const del = $('[data-del]', row);
      if (del) twoTap(del, 'تأكيد', () => {
        if (S.ui.cat === id) S.ui.cat = 'all';
        apply(baseCat[id] ? { ['catx.' + id + '.h']: true } : { ['catx.' + id]: undefined });
        openCats();
        toast('حُذف القسم');
      });
    });
    $('#ncForm', root).onsubmit = (e) => {
      e.preventDefault();
      const name = $('#ncName', root).value.trim().replace(/\s+/g, ' ');
      if (!name) { $('#ncName', root).focus(); return; }
      if (taken(name)) { err('يوجد قسم بهذا الاسم'); return; }
      const id = 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      const ids = CL.map((x) => x.id);
      const oi = ids.indexOf('other');
      ids.splice(oi < 0 ? ids.length : oi, 0, id);
      apply(Object.assign(order(ids), { ['catx.' + id]: { n: name, t: Date.now(), o: ids.indexOf(id) } }));
      openCats();
      toast(`أُضيف قسم «${name}»`);
    };
  });
}

/* ---------- المظهر ---------- */
const darkMQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
function systemDark() {
  try { if (window.AndroidBridge && AndroidBridge.isNight) return !!AndroidBridge.isNight(); } catch (e) { /* قديم */ }
  return !!(darkMQ && darkMQ.matches);
}
function applyTheme() {
  const pref = LS.get(K.theme, 'light');
  const dark = pref === 'dark' || (pref === 'auto' && systemDark());
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#111613' : '#F4F6F1');
  try { if (window.AndroidBridge && AndroidBridge.setDark) AndroidBridge.setDark(dark); } catch (e) { /* قديم */ }
}
if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener('change', applyTheme);
window.onSystemTheme = applyTheme;

/* ---------- المزامنة ---------- */
const b64e = (s) => btoa(unescape(encodeURIComponent(s)));
const b64d = (s) => decodeURIComponent(escape(atob(s)));
function joinCode(cfg) {
  const f = cfg.fb;
  return 'MQD1.' + b64e(JSON.stringify({ k: f.apiKey, d: f.authDomain || '', p: f.projectId, a: f.appId, f: cfg.fam }));
}
function parseJoin(text) {
  const t = String(text || '').replace(/\s+/g, '');
  const m = t.match(/MQD1\.([A-Za-z0-9+/=]+)/);
  if (!m) return null;
  try {
    const o = JSON.parse(b64d(m[1]));
    if (!o.k || !o.p || !o.a || !o.f) return null;
    return { fb: { apiKey: o.k, authDomain: o.d || `${o.p}.firebaseapp.com`, projectId: o.p, appId: o.a }, fam: o.f };
  } catch (e) { return null; }
}
function parseFirebase(text) {
  const o = {};
  const re = /(apiKey|authDomain|projectId|storageBucket|messagingSenderId|appId)["']?\s*:\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(String(text || '')))) o[m[1]] = m[2];
  if (!o.apiKey || !o.projectId || !o.appId) return null;
  if (!o.authDomain) o.authDomain = `${o.projectId}.firebaseapp.com`;
  return { apiKey: o.apiKey, authDomain: o.authDomain, projectId: o.projectId, appId: o.appId };
}
function newFamilyId() {
  const abc = 'abcdefghjkmnpqrstuvwxyz23456789', a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return Array.from(a, (x) => abc[x % abc.length]).join('');
}

function syncError(e) {
  console.error(e);
  S.sync = 'error';
  S.syncErr = (e && (e.code || e.message)) || 'unknown';
  renderSync();
}

async function startCloud(cfg) {
  S.sync = 'connecting';
  renderSync();
  try {
    const fb = await import('./firebase.js');
    const app = fb.initializeApp(cfg.fb);
    let db;
    try { db = fb.initializeFirestore(app, { localCache: fb.persistentLocalCache({ tabManager: fb.persistentMultipleTabManager() }) }); }
    catch (e) { db = fb.initializeFirestore(app, {}); }
    const ref = fb.doc(db, 'families', cfg.fam);
    const photosCol = fb.collection(db, 'families', cfg.fam, 'photos');

    cloud = {
      update(ch) {
        const o = {};
        for (const k in ch) o[k] = ch[k] === undefined ? fb.deleteField() : ch[k];
        o.ts = fb.serverTimestamp();
        fb.updateDoc(ref, o).catch(syncError);
      },
      setPhoto(id, d) {
        const p = fb.doc(photosCol, id);
        (d ? fb.setDoc(p, { d }) : fb.deleteDoc(p)).catch(syncError);
      }
    };

    // أول تشغيل بعد الربط: ندمج ما كان محفوظاً على هذا الجوال دون مسح ما في السحابة
    const local = normalize(LS.get(K.data, null));
    const seed = { v: 1, ts: fb.serverTimestamp() };
    for (const k of MAPS) if (Object.keys(local[k]).length) seed[k] = local[k];
    fb.setDoc(ref, seed, { merge: true }).catch(syncError);
    LS.del(K.data);
    const localPhotos = LS.get(K.photos, {}) || {};
    for (const id in localPhotos) cloud.setPhoto(id, localPhotos[id]);
    LS.del(K.photos);

    let dataReady = false, photosReady = false, migrated = false;
    const tryMigrate = () => {
      if (migrated || !dataReady || !photosReady) return;
      migrated = true;
      if (migrate()) toast('تم تحديث قائمة الأغراض');
    };
    fb.onSnapshot(ref, { includeMetadataChanges: true }, (snap) => {
      S.data = normalize(snap.data());
      S.sync = snap.metadata.fromCache ? 'offline' : 'online';
      if (!snap.metadata.fromCache && snap.exists && snap.exists()) dataReady = true;
      render();
      tryMigrate();
    }, syncError);
    fb.onSnapshot(photosCol, { includeMetadataChanges: true }, (qs) => {
      const p = {};
      qs.forEach((x) => { const d = x.data(); if (d && d.d) p[x.id] = d.d; });
      S.photos = p;
      S.photoErr = '';
      if (!(qs.metadata && qs.metadata.fromCache)) photosReady = true;
      render();
      tryMigrate();
    }, (e) => { console.error(e); S.photoErr = (e && (e.code || e.message)) || 'photos'; S.syncErr = 'الصور: ' + S.photoErr; renderSync(); });
  } catch (e) { syncError(e); }
}

function openSettings() {
  const c = S.cfg;
  const hiddenCats = CATS.filter((x) => x[0] !== 'other' && S.data.catx[x[0]] && S.data.catx[x[0]].h).map((x) => x[0]);
  const hiddenN = Object.keys(S.data.hidden).length + hiddenCats.length;
  const th = LS.get(K.theme, 'light');
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const standalone = navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
  const errMsg = (S.sync === 'error' || S.photoErr)
    ? `<p class="err">تعذّرت المزامنة (${esc(S.syncErr)}). تأكد من الإنترنت ومن قواعد Firestore المذكورة في الدليل.</p>` : '';
  sheet(`<h2>الإعدادات</h2>
    <div class="card"><h3>اسم هذا الجوال</h3><p>يظهر للطرف الثاني بجانب آخر غرض أضفته.</p>
      <div class="field"><label for="sMe" class="sr">اسم الجوال</label><input id="sMe" maxlength="24" placeholder="مثال: جوال منصور" value="${esc(S.me)}"></div></div>
    <div class="card"><h3>المظهر</h3><p>خاص بهذا الجوال. «تلقائي» يتبع وضع الجوال.</p>
      <div class="seg three" role="group" aria-label="المظهر">
        <button type="button" data-th="light" aria-pressed="${th === 'light'}">فاتح</button>
        <button type="button" data-th="dark" aria-pressed="${th === 'dark'}">غامق</button>
        <button type="button" data-th="auto" aria-pressed="${th === 'auto'}">تلقائي</button></div></div>
    <div class="card"><h3>المزامنة بين الجوالات</h3>
      ${c ? `${errMsg}<p>هذا الجوال مربوط بقائمة العائلة. لربط جوال آخر أرسل له «رمز الربط» وألصقه عنده في الإعدادات.</p>
        <div class="field"><label for="sCode">رمز الربط</label><textarea id="sCode" readonly>${esc(joinCode(c))}</textarea></div>
        <div class="btns"><button type="button" class="btn green" id="sShareCode">إرسال الرمز</button><button type="button" class="btn ghost" id="sCopy">نسخ</button></div>
        <button type="button" class="btn danger" id="sUnlink">فصل هذا الجوال عن المزامنة</button>`
      : `<p>القائمة الآن محفوظة على هذا الجوال فقط.</p>
        <div class="field"><label for="sJoin">عندك رمز ربط من الجوال الآخر؟ ألصقه هنا</label><textarea id="sJoin" placeholder="MQD1.…"></textarea></div>
        <button type="button" class="btn green" id="sJoinBtn">ربط</button>
        <details><summary>أول جوال؟ إعداد المزامنة من Firebase</summary>
          <div class="field" style="margin-top:10px"><label for="sFb">ألصق إعدادات Firebase (firebaseConfig) كما هي</label><textarea id="sFb" placeholder="apiKey: &quot;…&quot;, projectId: &quot;…&quot;, appId: &quot;…&quot;"></textarea></div>
          <button type="button" class="btn" id="sFbBtn" style="width:100%">إنشاء قائمة العائلة</button></details>
        <div class="err" id="sErr"></div>`}
    </div>
    <div class="card"><h3>القائمة</h3>
      <button type="button" class="btn ghost" id="sCats">إضافة وتعديل الأقسام</button>
      <div class="btns"><button type="button" class="btn ghost" id="sUnhide"${hiddenN ? '' : ' disabled'}>إظهار المخفي (${ar(hiddenN)})</button><button type="button" class="btn danger" id="sClear">تفريغ الطلبات</button></div></div>
    ${ios && !standalone ? '<div class="card"><h3>تثبيت على الآيفون</h3><p>من Safari اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».</p></div>' : ''}
    <p class="about">مقاضي البيت · الإصدار ${VERSION}<br>تطوير: منصور مستور الزهراني<br><a href="mailto:man.zs2020@gmail.com">man.zs2020@gmail.com</a></p>
    <button type="button" class="btn ghost" id="sClose">إغلاق</button>`,
  (root) => {
    $('#sClose', root).onclick = closeSheet;
    $('#sMe', root).oninput = (e) => { S.me = e.target.value.trim(); LS.set(K.me, S.me); };
    $('#sUnhide', root).onclick = () => {
      const ch = { hidden: {} };
      for (const id of hiddenCats) ch['catx.' + id + '.h'] = undefined;
      apply(ch); closeSheet(); toast('ظهر المخفي');
    };
    $('#sCats', root).onclick = openCats;
    root.querySelectorAll('[data-th]').forEach((b) => {
      b.onclick = () => {
        LS.set(K.theme, b.dataset.th);
        applyTheme();
        root.querySelectorAll('[data-th]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      };
    });
    twoTap($('#sClear', root), 'اضغط مرة أخرى للتأكيد', () => { apply({ sel: {}, got: {} }); closeSheet(); toast('فُرّغت الطلبات'); });
    if (c) {
      const code = joinCode(c);
      $('#sShareCode', root).onclick = () => shareOut(`رمز ربط تطبيق مقاضي البيت:\n${code}`, 'رمز الربط');
      $('#sCopy', root).onclick = async () => toast((await copyText(code)) ? 'نُسخ رمز الربط' : 'انسخ الرمز يدوياً');
      twoTap($('#sUnlink', root), 'اضغط مرة أخرى للتأكيد', () => {
        LS.set(K.data, S.data);
        LS.set(K.photos, S.photos);
        LS.del(K.cfg);
        location.reload();
      });
    } else {
      const err = (m) => { $('#sErr', root).textContent = m; };
      $('#sJoinBtn', root).onclick = () => {
        const cfg = parseJoin($('#sJoin', root).value);
        if (!cfg) { err('الرمز غير صحيح. انسخه كاملاً من الجوال الآخر.'); return; }
        LS.set(K.cfg, cfg);
        location.reload();
      };
      $('#sFbBtn', root).onclick = () => {
        const fbc = parseFirebase($('#sFb', root).value);
        if (!fbc) { err('لم أجد apiKey و projectId و appId في النص الملصق.'); return; }
        LS.set(K.cfg, { fb: fbc, fam: newFamilyId() });
        location.reload();
      };
    }
  });
}

/* ---------- الربط بالواجهة ---------- */
function bind() {
  $('#tabPick').onclick = () => { S.ui.mode = 'pick'; render(); $('#main').scrollTop = 0; };
  $('#tabShop').onclick = () => { S.ui.mode = 'shop'; S.ui.edit = false; render(); $('#main').scrollTop = 0; };
  $('#editBtn').onclick = () => { S.ui.edit = !S.ui.edit; render(); };
  $('#setBtn').onclick = openSettings;
  $('#syncPill').onclick = openSettings;
  $('#addForm').onsubmit = (e) => { e.preventDefault(); addFromInput(); };
  $('#q').oninput = (e) => { S.ui.q = e.target.value; renderGrid(); };
  $('#chips').onclick = (e) => {
    if (e.target.closest('[data-cats]')) { openCats(); return; }
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    S.ui.cat = b.dataset.cat;
    renderChips(); renderGrid();
    $('#main').scrollTop = 0;
  };
  $('#grid').onclick = (e) => {
    if (e.target.closest('[data-add]')) { addFromInput(); return; }
    const t = e.target.closest('[data-id]');
    if (t) tapPick(t.dataset.id);
  };
  $('#shopView').onclick = (e) => { const t = e.target.closest('[data-id]'); if (t) tapShop(t.dataset.id); };
  $('#dock').onclick = (e) => {
    if (e.target.closest('#shareBtn')) share();
    else if (e.target.closest('#finBtn')) openFinish();
  };
  $('#scrim').onclick = (e) => { if (e.target.id === 'scrim') closeSheet(); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheetOpen) closeSheet(); });

  // زر الرجوع في أندرويد: يغلق النافذة ثم يلغي التعديل ثم يرجع للطلبات
  window.onBack = () => {
    if (sheetOpen) { closeSheet(); return true; }
    if (S.ui.edit) { S.ui.edit = false; render(); return true; }
    if (S.ui.q) { $('#q').value = ''; S.ui.q = ''; renderGrid(); return true; }
    if (S.ui.mode === 'shop') { S.ui.mode = 'pick'; render(); return true; }
    return false;
  };
}

applyTheme();
bind();
if (!S.cfg) migrate();
render();
if (S.cfg) startCloud(S.cfg);
if ('serviceWorker' in navigator && !window.AndroidBridge && location.protocol === 'https:') {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(() => {});
  // عند وصول نسخة جديدة من التطبيق: إعادة تحميل تلقائية مرة واحدة (إن لم تكن نافذة مفتوحة)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !sheetOpen && !window.__reloaded) { window.__reloaded = true; location.reload(); }
  });
}
