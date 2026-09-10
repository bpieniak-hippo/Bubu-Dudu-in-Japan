// Logika aplikacji: przełączanie widoków, kalendarz, atrakcje

const MONTH_NAMES = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];
// Dopełniacz — do zapisu "14 września"
const MONTH_NAMES_GEN = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];
const MONTH_SHORT = [
  "sty", "lut", "mar", "kwi", "maj", "cze",
  "lip", "sie", "wrz", "paź", "lis", "gru",
];
const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const WEEKDAYS_LONG = [
  "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela",
];

// Kolejność wydarzeń w obrębie jednego dnia
const TYPE_ORDER = {
  flight: 0, train: 1, hotel: 2, car: 3, ticket: 4, attraction: 5, sumo: 6, planned: 7,
};

// Formatuje Date jako "YYYY-MM-DD" wg lokalnych składowych (bez konwersji na UTC)
function toLocalKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Rozwija EVENTS (w tym zakresy startDate/endDate) do mapy: "YYYY-MM-DD" -> [event, ...]
function buildEventsByDay(events) {
  const map = {};
  events.forEach((ev) => {
    const start = ev.date || ev.startDate;
    const end = ev.date || ev.endDate;
    let d = new Date(start + "T00:00:00");
    const endD = new Date(end + "T00:00:00");
    while (d <= endD) {
      const key = toLocalKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
      d.setDate(d.getDate() + 1);
    }
  });
  return map;
}

// ---------- Dane zapisywane przez użytkownika (localStorage) ----------
// Każdy store to obiekt { [id atrakcji]: wartość }.
const STORE_KEYS = {
  dates: "bubuDudu.attractionDates",
  times: "bubuDudu.attractionTimes",
  visited: "bubuDudu.attractionVisited",
  comments: "bubuDudu.attractionComments",
  session: "bubuDudu.session",
  custom: "bubuDudu.customAttractions",
  weather: "bubuDudu.weather",
  expenses: "bubuDudu.expenses",
  funds: "bubuDudu.funds",
  fx: "bubuDudu.fx",
  packing: "bubuDudu.packing",
  packingOwn: "bubuDudu.packingOwn",
  meta: "bubuDudu.meta",
  // Adres i klucz do bazy wpisuje się w aplikacji, na każdym urządzeniu osobno —
  // dzięki temu nie ma ich w kodzie, który leży publicznie na GitHubie.
  sync: "bubuDudu.sync",
  // Zapisy czekające na wysłanie do bazy, żeby brak zasięgu niczego nie gubił.
  outbox: "bubuDudu.outbox",
};

// Część przeglądarek blokuje localStorage przy otwarciu pliku przez file://,
// więc trzymamy też kopię w pamięci, żeby aplikacja działała w tej samej sesji.
const memoryStore = {};

// Dlaczego to jest ważne: pod file:// zapis nie działa, a dane żyją tylko do
// zamknięcia karty. Bez sygnału użytkownik traci daty i komentarze bez ostrzeżenia.
// "ok" | "blocked" (przeglądarka nie pozwala) | "full" (skończyło się miejsce)
let storageState = "ok";

function setStoreValue(name, id, value) {
  const store = loadStore(name);
  if (value) store[id] = value;
  else delete store[id];
  memoryStore[name] = store;
  try {
    localStorage.setItem(STORE_KEYS[name], JSON.stringify(store));
  } catch (err) {
    // Zdjęcia w base64 potrafią przepełnić limit ~5 MB. To inny problem
    // niż zablokowany localStorage i wymaga innej rady dla użytkownika.
    const full = err && /quota|exceeded/i.test(err.name + err.message);
    storageState = full ? "full" : "blocked";
    renderStorageWarning();
  }
  queueForSync(name, id);
}

function loadStore(name) {
  if (memoryStore[name]) return memoryStore[name];
  try {
    return JSON.parse(localStorage.getItem(STORE_KEYS[name])) || {};
  } catch {
    return {};
  }
}

// Suma znaków we wszystkich kluczach ≈ zajęte bajty (localStorage liczy UTF-16,
// ale limit też jest podawany w tej skali, więc proporcja się zgadza).
function storageSize() {
  return Object.keys(STORE_KEYS).reduce((sum, name) => {
    try {
      return sum + (localStorage.getItem(STORE_KEYS[name]) || "").length;
    } catch {
      return sum + JSON.stringify(memoryStore[name] || {}).length;
    }
  }, 0);
}

function formatBytes(n) {
  return n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} MB`
    : `${Math.round(n / 1024)} kB`;
}

function getUserDates() {
  return loadStore("dates");
}

function setUserDate(id, date) {
  setStoreValue("dates", id, date);
}

// Daty przepisane z arkusza są orientacyjne — wchodzą raz, jako punkt wyjścia,
// a potem zachowują się jak każda inna: da się je przestawić albo skasować.
// Flaga pilnuje, żeby skasowany dzień nie wrócił przy następnym otwarciu apki.
function seedSuggestedDates() {
  if (loadStore("meta").datesSeeded) return;
  const saved = getUserDates();
  flattenAttractions().forEach((item) => {
    if (item.suggestedDate && !saved[item.id]) setUserDate(item.id, item.suggestedDate);
  });
  setStoreValue("meta", "datesSeeded", 1);
}

function getUserTimes() {
  return loadStore("times");
}

function setUserTime(id, time) {
  setStoreValue("times", id, time);
}

function getVisited() {
  return loadStore("visited");
}

function setVisited(id, isVisited) {
  setStoreValue("visited", id, isVisited || "");
}

// ---------- Kopia zapasowa ----------
// Store'y warte przeniesienia na drugi telefon. Pogoda to cache (odtworzy się sama),
// a sesja jest osobista — oba pomijamy.
const BACKUP_STORES = [
  "dates",
  "times",
  "visited",
  "comments",
  "custom",
  "expenses",
  "funds",
  "packing",
  "packingOwn",
];

function probeStorage() {
  try {
    localStorage.setItem("__bubu_probe__", "1");
    localStorage.removeItem("__bubu_probe__");
  } catch {
    storageState = "blocked";
  }
}

function renderStorageWarning() {
  const bar = document.getElementById("storageWarn");
  if (!bar) return;
  bar.classList.toggle("hidden", storageState === "ok");
  if (storageState === "ok") return;
  bar.innerHTML =
    storageState === "full"
      ? `<span>Pamięć pełna — zmiany mogą się nie zapisać. Zrób kopię i usuń zdjęcia z własnych atrakcji.</span>
         <button type="button" class="warn-btn" data-backup="export">Pobierz kopię</button>`
      : `<span>Ta kopia nie zapisuje zmian — pobierz kopię zapasową, zanim zamkniesz kartę.</span>
         <button type="button" class="warn-btn" data-backup="export">Pobierz kopię</button>`;
}

function buildBackup() {
  const data = {};
  BACKUP_STORES.forEach((name) => (data[name] = loadStore(name)));
  const user = getCurrentUser();
  return { v: 1, exportedAt: new Date().toISOString(), user: user ? user.id : null, data };
}

async function exportData() {
  const json = JSON.stringify(buildBackup(), null, 2);
  const name = `bubu-dudu-kopia-${toLocalKey(new Date())}.json`;
  const file = new File([json], name, { type: "application/json" });

  // Na iPhonie arkusz udostępniania jest jedyną wygodną drogą do drugiego telefonu
  // (AirDrop, WhatsApp), a <a download> bywa tam zawodne. Stąd ta kolejność.
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Kopia danych Bubu & Dudu" });
      return;
    } catch {
      // anulowane albo niedostępne — schodzimy do pobrania pliku
    }
  }

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// Scalanie jest bezstratne: nic z lokalnych danych nie znika, a przy sprzeczności
// wygrywa to, co użytkownik ma u siebie. Zwraca podsumowanie do pokazania.
function mergeBackup(backup) {
  if (!backup || backup.v !== 1 || !backup.data) throw new Error("To nie jest kopia z tej aplikacji.");
  const added = { comments: 0, visited: 0, custom: 0, dates: 0, times: 0, expenses: 0, packing: 0, packingOwn: 0 };
  let conflicts = 0;

  const incoming = backup.data;

  Object.entries(incoming.comments || {}).forEach(([id, list]) => {
    if (!Array.isArray(list)) return;
    const mine = loadStore("comments")[id] || [];
    const seen = new Set(mine.map((c) => `${c.user}|${c.ts}`));
    const merged = mine.concat(list.filter((c) => c && !seen.has(`${c.user}|${c.ts}`)));
    if (merged.length === mine.length) return;
    added.comments += merged.length - mine.length;
    merged.sort((a, b) => a.ts - b.ts);
    setStoreValue("comments", id, merged);
  });

  Object.entries(incoming.visited || {}).forEach(([id, value]) => {
    if (!value || getVisited()[id]) return;
    added.visited += 1;
    setVisited(id, true);
  });

  Object.entries(incoming.custom || {}).forEach(([id, item]) => {
    if (!item || getCustomAttractions()[id]) return;
    added.custom += 1;
    setStoreValue("custom", id, item);
  });

  // Wydatki mają losowe id, więc suma po id nie zdubluje niczego dwa razy.
  Object.entries(incoming.expenses || {}).forEach(([id, item]) => {
    if (!item || loadStore("expenses")[id]) return;
    added.expenses += 1;
    setStoreValue("expenses", id, item);
  });

  // Budżet jest jedną wspólną kwotą — przy sprzeczności zostaje lokalna, jak przy datach.
  if (incoming.funds && incoming.funds.shared && !loadStore("funds").shared) {
    setStoreValue("funds", "shared", incoming.funds.shared);
  }

  Object.entries(incoming.dates || {}).forEach(([id, date]) => {
    const mine = getUserDates()[id];
    if (mine === date) return;
    if (mine) conflicts += 1;
    else {
      added.dates += 1;
      setUserDate(id, date);
    }
  });

  // Klucz pakowania ma w sobie właściciela, więc suma nie miesza list Bartka i Pauli.
  // Spakowane u kogokolwiek zostaje spakowane — cofnięcie ptaszka to zawsze świadoma decyzja.
  Object.entries(incoming.packing || {}).forEach(([key, value]) => {
    if (!value || loadStore("packing")[key]) return;
    added.packing += 1;
    setStoreValue("packing", key, value);
  });

  // Dopiski mają losowe id, więc suma po kluczu niczego nie zdubluje.
  Object.entries(incoming.packingOwn || {}).forEach(([key, label]) => {
    if (!label || loadStore("packingOwn")[key]) return;
    added.packingOwn += 1;
    setStoreValue("packingOwn", key, label);
  });

  // Godzina bez daty nic nie znaczy, więc idzie tą samą zasadą: lokalna wygrywa.
  Object.entries(incoming.times || {}).forEach(([id, time]) => {
    if (!time || getUserTimes()[id]) return;
    added.times += 1;
    setUserTime(id, time);
  });

  return { added, conflicts };
}

function importSummaryHtml({ added, conflicts }) {
  const parts = [
    added.comments && `${added.comments} komentarzy`,
    added.dates && `${added.dates} dat`,
    added.times && `${added.times} godzin`,
    added.visited && `${added.visited} odhaczonych atrakcji`,
    added.custom && `${added.custom} własnych atrakcji`,
    added.expenses && `${added.expenses} wydatków`,
    added.packing && `${added.packing} spakowanych rzeczy`,
    added.packingOwn && `${added.packingOwn} dopisków do pakowania`,
  ].filter(Boolean);

  return `
    <div class="account-panel">
      <h2 class="account-title">Kopia wczytana</h2>
      <p class="account-line">${parts.length ? `Dodano: ${parts.join(", ")}.` : "Nie było nic nowego do dodania."}</p>
      ${conflicts ? `<p class="account-line muted">Pominięto ${conflicts} sprzecznych dat — zostały Twoje.</p>` : ""}
    </div>
  `;
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let summary;
    try {
      summary = mergeBackup(JSON.parse(reader.result));
    } catch (err) {
      openModal(`<div class="account-panel"><h2 class="account-title">Nie udało się wczytać</h2>
        <p class="account-line">${escapeHtml(err.message)}</p></div>`);
      return;
    }
    refreshAttractions();
    renderTimeline();
    renderCalendar();
    openModal(importSummaryHtml(summary));
  };
  reader.onerror = () => {
    openModal(`<div class="account-panel"><h2 class="account-title">Nie udało się odczytać pliku</h2></div>`);
  };
  reader.readAsText(file);
}

// ---------- Synchronizacja z bazą (Supabase przez REST) ----------
// Bez bibliotek i bez CDN-a: Supabase wystawia zwykłe końcówki REST, więc wystarczy
// fetch. Dzięki temu build.py dalej skleja jeden plik, który działa spod file://.
//
// localStorage zostaje źródłem prawdy dla ekranu — apka ma działać bez zasięgu,
// a z tym w Japonii bywa różnie. Każdy zapis ląduje w outboxie i jedzie do bazy
// przy najbliższej okazji. Przy sprzeczności wygrywa nowszy zapis, o czym
// rozstrzyga zegar serwera, nie telefonu.
const SYNC_TABLE = "bubu_store";
const SYNC_SEP = "\u0000";

// "off" (brak konfiguracji) | "idle" | "syncing" | "ok" | "error"
let syncState = { status: "off", message: "" };
let syncTimer = null;
// Przy wciąganiu zmian z bazy zapis nie może wrócić do outboxu — inaczej oba
// telefony w kółko odsyłałyby sobie te same wiersze.
let applyingRemote = false;

function syncConfig() {
  const cfg = loadStore("sync");
  return {
    url: (cfg.url || "").replace(/\/+$/, ""),
    key: cfg.key || "",
    lastPull: cfg.lastPull || "",
  };
}

function syncReady() {
  const { url, key } = syncConfig();
  return Boolean(url && key);
}

function syncRequest(path, options = {}) {
  const { url, key } = syncConfig();
  return fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

function queueForSync(name, id) {
  if (applyingRemote || !BACKUP_STORES.includes(name)) return;
  setStoreValue("outbox", name + SYNC_SEP + id, new Date().toISOString());
  if (!syncReady()) return;
  // Odhaczanie listy pakowania to seria szybkich zapisów — czekamy, aż ucichnie,
  // zamiast strzelać osobnym żądaniem do każdego ptaszka.
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncNow(), 1500);
}

// Pierwsze podłączenie: daty i komentarze powstały, zanim synchronizacja istniała,
// więc outbox jest pusty i baza nigdy by ich nie zobaczyła. Wrzucamy wszystko.
function queueEverything() {
  BACKUP_STORES.forEach((name) => {
    Object.keys(loadStore(name)).forEach((id) => queueForSync(name, id));
  });
}

async function syncNow({ manual = false } = {}) {
  if (!syncReady() || syncState.status === "syncing") return;
  clearTimeout(syncTimer);
  setSyncState("syncing", "");
  let pulled = 0;
  try {
    await syncPush();
    pulled = await syncPull();
    setSyncState(
      "ok",
      pulled ? `pobrano ${pulled} ${changeForm(pulled, "zmianę", "zmiany", "zmian")}` : "wszystko aktualne"
    );
  } catch (err) {
    // Brak zasięgu nie może czyścić outboxu — te zapisy pojadą przy następnej próbie.
    // fetch przy zerwanym połączeniu rzuca TypeError z angielskim tekstem, więc
    // podmieniamy go na zdanie, które coś mówi osobie stojącej na dworcu w Kioto.
    setSyncState("error", err instanceof TypeError ? "brak połączenia" : err.message);
  }
  if (manual || pulled) refreshAfterSync();
}

async function syncPush() {
  const keys = Object.keys(loadStore("outbox"));
  if (!keys.length) return 0;

  const rows = keys.map((key) => {
    const sep = key.indexOf(SYNC_SEP);
    const store = key.slice(0, sep);
    const id = key.slice(sep + 1);
    const value = loadStore(store)[id];
    // Skasowana pozycja zostaje w bazie jako pusty wiersz. Bez tego drugi telefon
    // nigdy by się nie dowiedział, że coś zniknęło, i odesłałby to z powrotem.
    return { store, item_key: id, value: value === undefined ? null : value };
  });

  const res = await syncRequest(SYNC_TABLE, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(await syncError(res));

  keys.forEach((key) => setStoreValue("outbox", key, ""));
  return rows.length;
}

async function syncPull() {
  const { lastPull } = syncConfig();
  const since = lastPull ? `&updated_at=gt.${encodeURIComponent(lastPull)}` : "";
  const res = await syncRequest(`${SYNC_TABLE}?select=store,item_key,value,updated_at${since}`);
  if (!res.ok) throw new Error(await syncError(res));

  const rows = await res.json();
  const pending = loadStore("outbox");
  let newest = lastPull;
  let applied = 0;

  applyingRemote = true;
  rows.forEach((row) => {
    if (!BACKUP_STORES.includes(row.store)) return;
    // Jeśli ta sama pozycja czeka u nas na wysyłkę, nasza wersja jest świeższa.
    // Nie ruszamy jej i nie przesuwamy znacznika, żeby wiersz wrócił następnym razem.
    if (pending[row.store + SYNC_SEP + row.item_key]) return;
    if (row.updated_at > newest) newest = row.updated_at;
    applied += 1;
    setStoreValue(row.store, row.item_key, row.value === null ? "" : row.value);
  });
  applyingRemote = false;

  if (newest !== lastPull) setStoreValue("sync", "lastPull", newest);
  return applied;
}

async function syncError(res) {
  const body = await res.text();
  try {
    return JSON.parse(body).message || `${res.status} ${res.statusText}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

function setSyncState(status, message) {
  syncState = { status, message };
  const line = document.getElementById("syncStatus");
  if (line) line.textContent = syncStatusText();
}

// Bez odmiany licznik czytałby się jak z automatu ("pobrano 1 zmian").
// `few` to 2–4, ale nie 12–14 — stąd wyjątek na nastki.
function changeForm(n, one, few, many) {
  if (n === 1) return one;
  const rest = n % 10;
  const teens = n % 100 >= 12 && n % 100 <= 14;
  return rest >= 2 && rest <= 4 && !teens ? few : many;
}

function pluralChanges(n) {
  return `${n} ${changeForm(n, "zmiana czeka", "zmiany czekają", "zmian czeka")}`;
}

function syncStatusText() {
  const waiting = Object.keys(loadStore("outbox")).length;
  const tail = waiting ? ` ${pluralChanges(waiting)} na wysyłkę.` : "";
  const map = {
    off: "Nieskonfigurowana — dane zostają tylko na tym urządzeniu.",
    idle: "Gotowa.",
    syncing: "Synchronizuję…",
    ok: `Zsynchronizowane (${syncState.message}).`,
    error: `Nie udało się: ${syncState.message}.`,
  };
  return (map[syncState.status] || "") + tail;
}

function refreshAfterSync() {
  refreshAttractions();
  renderTimeline();
  renderCalendar();
  renderLogistics();
  renderWallet();
}

// ---------- Zalogowany użytkownik ----------
function getCurrentUser() {
  const id = loadStore("session").user;
  return USERS.find((u) => u.id === id) || null;
}

function setCurrentUser(id) {
  setStoreValue("session", "user", id);
}

// ---------- Komentarze ----------
function getComments() {
  return loadStore("comments");
}

function addComment(attractionId, text) {
  const user = getCurrentUser();
  const clean = text.trim();
  if (!user || !clean) return false;
  const list = getComments()[attractionId] || [];
  setStoreValue("comments", attractionId, [
    ...list,
    { user: user.id, text: clean, ts: Date.now() },
  ]);
  return true;
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

function formatStamp(ts) {
  return new Date(ts).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function commentsHtml(attractionId) {
  const list = getComments()[attractionId] || [];
  if (!list.length) return `<p class="comment-empty">Brak komentarzy</p>`;
  return list
    .map((c) => {
      const author = USERS.find((u) => u.id === c.user);
      return `
        <div class="comment">
          <img class="comment-avatar" src="${author ? author.avatar : ""}" alt="" />
          <div class="comment-body">
            <p class="comment-meta">${author ? author.name : c.user} · ${formatStamp(c.ts)}</p>
            <p class="comment-text">${escapeHtml(c.text)}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

// ---------- Atrakcje dodane ręcznie ----------
function getCustomAttractions() {
  return loadStore("custom");
}

// ATTRACTIONS + atrakcje dodane ręcznie, dopięte do pasującego miasta i kategorii
function getAttractionBlocks() {
  const blocks = ATTRACTIONS.map((b) => ({
    city: b.city,
    dates: b.dates,
    groups: b.groups.map((g) => ({ category: g.category, items: [...g.items] })),
  }));

  Object.values(getCustomAttractions()).forEach((item) => {
    let block = blocks.find((b) => b.city === item.city);
    if (!block) {
      block = { city: item.city, dates: "dodane ręcznie", groups: [] };
      blocks.push(block);
    }
    let group = block.groups.find((g) => g.category === item.category);
    if (!group) {
      group = { category: item.category, items: [] };
      block.groups.push(group);
    }
    group.items.push(item);
  });

  return blocks;
}

// Miniaturka osoby, która dodała atrakcję — znak wodny na zdjęciu
function authorWatermark(item) {
  const author = USERS.find((u) => u.id === item.author);
  if (!author) return "";
  const label = `Dodane przez: ${author.name}`;
  return `<img class="wm-avatar" src="${author.avatar}" alt="${label}" title="${label}" />`;
}

// Spłaszcza atrakcje do listy pojedynczych pozycji
function flattenAttractions() {
  const flat = [];
  getAttractionBlocks().forEach((cityBlock) => {
    cityBlock.groups.forEach((group) => {
      group.items.forEach((item) => flat.push(item));
    });
  });
  return flat;
}

// Buduje wydarzenia "zaplanowane przez użytkownika" na podstawie dat wybranych w Atrakcjach
function buildPlannedEvents() {
  const userDates = getUserDates();
  const userTimes = getUserTimes();
  const visited = getVisited();
  const flat = flattenAttractions();
  const planned = [];
  flat.forEach((item) => {
    const date = userDates[item.id];
    if (!date) return;
    const time = userTimes[item.id] || "";
    planned.push({
      date,
      time,
      type: "planned",
      icon: visited[item.id] ? "✅" : "📌",
      title: escapeHtml(item.name),
      details: time ? "Zaplanowane na tę godzinę" : "Zaplanowane samodzielnie w zakładce Atrakcje",
      link: item.link,
    });
  });
  return planned;
}

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// ---------- Mapy (kafelki OpenStreetMap, bez bibliotek) ----------
const TILE = 256;
const MAP_MIN_ZOOM = 8;
const MAP_MAX_ZOOM = 17;
const MINI_ZOOM = 14;

function tileUrl(z, x, y) {
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

// Web Mercator: współrzędne → piksele w globalnej siatce dla danego zoomu.
function mercProject(lat, lon, z) {
  const n = TILE * 2 ** z;
  const s = Math.sin((lat * Math.PI) / 180);
  return {
    x: ((lon + 180) / 360) * n,
    y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n,
  };
}

function mercUnproject(x, y, z) {
  const n = TILE * 2 ** z;
  return {
    lon: (x / n) * 360 - 180,
    lat: (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI,
  };
}

function haversineKm(a, b) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Największy zoom, przy którym wszystkie punkty mieszczą się w ramce.
function fitView(points, width, height) {
  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const center = {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lon: (Math.min(...lons) + Math.max(...lons)) / 2,
  };
  if (points.length < 2) return { ...center, z: MINI_ZOOM };

  for (let z = MAP_MAX_ZOOM; z > MAP_MIN_ZOOM; z--) {
    const a = mercProject(Math.max(...lats), Math.min(...lons), z);
    const b = mercProject(Math.min(...lats), Math.max(...lons), z);
    // Margines 48 px, żeby pinezki przy krawędzi nie były ucięte.
    if (b.x - a.x <= width - 48 && b.y - a.y <= height - 48) return { ...center, z };
  }
  return { ...center, z: MAP_MIN_ZOOM };
}

// Kafelki potrzebne, żeby pokryć ramkę w×h wyśrodkowaną na punkcie.
// Pozycje są liczone względem środka ramki, więc HTML nie musi znać jej szerokości.
function tileGrid(lat, lon, z, w, h) {
  const p = mercProject(lat, lon, z);
  const tx = Math.floor(p.x / TILE);
  const ty = Math.floor(p.y / TILE);
  const ox = p.x - tx * TILE;
  const oy = p.y - ty * TILE;
  const n = 2 ** z;
  const out = [];

  for (let i = Math.floor((ox - w / 2) / TILE); i <= Math.floor((ox + w / 2) / TILE); i++) {
    for (let j = Math.floor((oy - h / 2) / TILE); j <= Math.floor((oy + h / 2) / TILE); j++) {
      const y = ty + j;
      // Poza biegunami kafelków nie ma — OSM oddałby 404 i migoczący placeholder.
      if (y < 0 || y >= n) continue;
      out.push({
        z,
        x: ((tx + i) % n + n) % n,
        y,
        left: i * TILE - ox,
        top: j * TILE - oy,
      });
    }
  }
  return out;
}

// Nieinteraktywny podgląd w oknie szczegółów. Sam kontener — kafelki dokłada
// fillMiniMap, bo dopiero po wstawieniu w DOM znamy szerokość ramki.
function miniMapHtml(item) {
  if (item.lat == null || item.lon == null) return "";
  return `
    <div class="map-mini" data-lat="${item.lat}" data-lon="${item.lon}">
      <span class="map-pin solo"></span>
      <span class="map-attrib">© OpenStreetMap</span>
    </div>
  `;
}

// Wołane po wstawieniu okna w DOM — dopiero wtedy znamy szerokość ramki.
function fillMiniMap(el) {
  const w = el.clientWidth;
  if (!w) return;

  tileGrid(Number(el.dataset.lat), Number(el.dataset.lon), MINI_ZOOM, w, el.clientHeight).forEach(
    (t) => {
      const img = document.createElement("img");
      img.className = "map-tile";
      img.loading = "lazy";
      img.alt = "";
      img.src = tileUrl(t.z, t.x, t.y);
      img.style.left = `calc(50% + ${t.left}px)`;
      img.style.top = `calc(50% + ${t.top}px)`;
      // Offline kafelek zostawia po sobie ikonę błędu — lepiej pokazać samo tło.
      img.addEventListener("error", () => img.remove());
      el.prepend(img);
    }
  );
}

// ---------- Mapa miasta ----------
// Promień, w jakim mieszczą się atrakcje "przy hotelu". Tokio rozciąga się od
// Kamakury po Minakami (~150 km) — pełny kadr zszedłby do zoomu 8 i byłby
// nieczytelny, dlatego domyślny widok trzyma się okolicy noclegu.
const MAP_NEAR_KM = 15;

const mapState = { open: false, city: null, scope: "near", lat: 0, lon: 0, z: 13 };

function mapCities() {
  const cities = getAttractionBlocks().map((b) => b.city);
  EVENTS.forEach((e) => {
    if (e.type === "hotel" && e.lat != null && !cities.includes(e.city)) cities.push(e.city);
  });
  return cities;
}

// Atrakcje respektują aktywne filtry i szukajkę — mapa pokazuje to samo, co lista.
function mapPoints(city) {
  const points = [];

  getAttractionBlocks().forEach((block) => {
    if (block.city !== city) return;
    block.groups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.lat == null || item.lon == null) return;
        if (!matchesFilters(item, block.city, group.category)) return;
        points.push({
          lat: item.lat,
          lon: item.lon,
          label: item.name,
          kind: "attraction",
          item,
          city: block.city,
          category: group.category,
        });
      });
    });
  });

  EVENTS.forEach((e) => {
    if (e.type !== "hotel" || e.city !== city || e.lat == null) return;
    points.push({ lat: e.lat, lon: e.lon, label: e.title, kind: "hotel", event: e });
  });

  return points;
}

function mapHome(points) {
  return points.find((p) => p.kind === "hotel") || points[0];
}

function recenterMap(points, width, height) {
  const home = mapHome(points);
  if (!home) return;
  const scoped =
    mapState.scope === "near" ? points.filter((p) => haversineKm(home, p) <= MAP_NEAR_KM) : points;
  const view = fitView(scoped.length ? scoped : [home], width, height);
  mapState.lat = mapState.scope === "near" ? home.lat : view.lat;
  mapState.lon = mapState.scope === "near" ? home.lon : view.lon;
  mapState.z = view.z;
}

function syncMapLayer(layer, points) {
  const w = layer.clientWidth;
  const h = layer.clientHeight;
  if (!w || !h) return;

  layer.textContent = "";
  layer.style.transform = "";

  tileGrid(mapState.lat, mapState.lon, mapState.z, w, h).forEach((t) => {
    const img = document.createElement("img");
    img.className = "map-tile";
    img.alt = "";
    img.src = tileUrl(t.z, t.x, t.y);
    img.style.left = `calc(50% + ${t.left}px)`;
    img.style.top = `calc(50% + ${t.top}px)`;
    img.addEventListener("error", () => img.remove());
    layer.appendChild(img);
  });

  const c = mercProject(mapState.lat, mapState.lon, mapState.z);
  points.forEach((p, i) => {
    const xy = mercProject(p.lat, p.lon, mapState.z);
    const dx = xy.x - c.x;
    const dy = xy.y - c.y;
    // Punkty poza kadrem zostawiamy w DOM tylko wtedy, gdy są blisko krawędzi —
    // przy pełnym regionie inaczej rozjeżdża się warstwa o tysiące pikseli.
    if (Math.abs(dx) > w || Math.abs(dy) > h) return;
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "map-pin" + (p.kind === "hotel" ? " is-hotel" : "");
    pin.dataset.index = String(i);
    pin.title = p.label;
    pin.setAttribute("aria-label", p.label);
    pin.style.left = `calc(50% + ${dx}px)`;
    pin.style.top = `calc(50% + ${dy}px)`;
    layer.appendChild(pin);
  });
}

function openMapPoint(p) {
  if (p.kind === "hotel") openModal(`<div class="modal-content">${logisticsCardHtml(p.event)}</div>`);
  else openDetail(p.item, p.city, p.category);
}

function renderCityMap() {
  const host = document.getElementById("attractionsMap");
  host.classList.toggle("hidden", !mapState.open);
  document.getElementById("attractionsList").classList.toggle("hidden", mapState.open);
  if (!mapState.open) return;

  const cities = mapCities();
  if (!cities.includes(mapState.city)) mapState.city = filterState.city || cities[0];
  const points = mapPoints(mapState.city);

  host.innerHTML = `
    <div class="map-head">
      <div class="chips map-cities">
        ${cities
          .map((c) => {
            const safe = escapeHtml(c);
            return `<button class="chip${c === mapState.city ? " active" : ""}" data-city="${safe}">${safe}</button>`;
          })
          .join("")}
      </div>
      <button class="chip map-scope" type="button">
        ${mapState.scope === "near" ? "📍 Blisko" : "🌏 Cały region"}
      </button>
    </div>
    <div class="map-viewport">
      <div class="map-layer"></div>
      <div class="map-zoom">
        <button type="button" data-zoom="1" aria-label="Przybliż">+</button>
        <button type="button" data-zoom="-1" aria-label="Oddal">−</button>
      </div>
      <span class="map-attrib">© OpenStreetMap</span>
    </div>
    ${
      points.some((p) => p.kind === "attraction")
        ? ""
        : `<p class="map-note">Brak zaplanowanych atrakcji w tym mieście — widać sam nocleg.</p>`
    }
  `;

  const viewport = host.querySelector(".map-viewport");
  const layer = host.querySelector(".map-layer");
  recenterMap(points, viewport.clientWidth, viewport.clientHeight);
  syncMapLayer(layer, points);

  host.querySelector(".map-cities").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    mapState.city = chip.dataset.city;
    renderCityMap();
  });

  host.querySelector(".map-scope").addEventListener("click", () => {
    mapState.scope = mapState.scope === "near" ? "region" : "near";
    renderCityMap();
  });

  host.querySelector(".map-zoom").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-zoom]");
    if (!btn) return;
    const next = mapState.z + Number(btn.dataset.zoom);
    if (next < MAP_MIN_ZOOM || next > MAP_MAX_ZOOM) return;
    mapState.z = next;
    syncMapLayer(layer, points);
  });

  bindMapDrag(viewport, layer, points);
}

// W trakcie przeciągania ruszamy tylko warstwą (transform) — przeliczanie
// kafelków przy każdym pointermove gubiłoby płynność i zasypywało OSM żądaniami.
function bindMapDrag(viewport, layer, points) {
  let start = null;
  let moved = 0;

  viewport.addEventListener("pointerdown", (e) => {
    if (e.target.closest("[data-zoom]")) return;
    start = { x: e.clientX, y: e.clientY };
    moved = 0;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
    layer.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  const finish = (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;

    // Ruch powyżej 8 px to przeciąganie, nie klik — inaczej mapa otwierałaby
    // szczegóły przy każdej próbie przesunięcia kadru.
    if (moved <= 8) {
      layer.style.transform = "";
      const pin = e.target.closest(".map-pin");
      if (pin) openMapPoint(points[Number(pin.dataset.index)]);
      return;
    }

    const c = mercProject(mapState.lat, mapState.lon, mapState.z);
    const next = mercUnproject(c.x - dx, c.y - dy, mapState.z);
    mapState.lat = next.lat;
    mapState.lon = next.lon;
    syncMapLayer(layer, points);
  };

  viewport.addEventListener("pointerup", finish);
  viewport.addEventListener("pointercancel", () => {
    start = null;
    layer.style.transform = "";
  });
}

// ---------- Pogoda (Open-Meteo — darmowe API, bez klucza) ----------
// Prognoza sięga tylko ~16 dni do przodu, a wyjazd trwa 19 dni. Dalsze dni
// dostają "typową pogodę": średnią z tych samych dat z trzech ostatnich lat.
const WEATHER_TTL_MS = 6 * 60 * 60 * 1000;
const WEATHER_YEARS_BACK = 3;

// Kod pogody WMO -> ikona i opis
function weatherLook(code) {
  if (code === 0) return { icon: "☀️", label: "Bezchmurnie" };
  if (code === 1) return { icon: "🌤️", label: "Przeważnie słonecznie" };
  if (code === 2) return { icon: "⛅", label: "Częściowe zachmurzenie" };
  if (code === 3) return { icon: "☁️", label: "Pochmurno" };
  if (code <= 48) return { icon: "🌫️", label: "Mgła" };
  if (code <= 57) return { icon: "🌦️", label: "Mżawka" };
  if (code <= 65) return { icon: "🌧️", label: "Deszcz" };
  if (code <= 67) return { icon: "🌧️", label: "Marznący deszcz" };
  if (code <= 77) return { icon: "❄️", label: "Śnieg" };
  if (code <= 82) return { icon: "🌦️", label: "Przelotny deszcz" };
  if (code <= 86) return { icon: "🌨️", label: "Przelotny śnieg" };
  return { icon: "⛈️", label: "Burza" };
}

// Suma opadów po polsku. Poniżej 0,1 mm to zero — API zwraca tam szum rzędu 0,04 mm.
function formatMm(mm) {
  if (mm == null || mm < 0.1) return null;
  return `${mm >= 10 ? Math.round(mm) : mm.toFixed(1).replace(".", ",")} mm`;
}

// Hotel danego dnia — to jego współrzędne wyznaczają pogodę.
// W dniu przeprowadzki liczy się nowy hotel, bo z poprzedniego wymeldowujemy się rano.
function dayHotel(dateKey) {
  const hotels = EVENTS.filter((ev) => ev.type === "hotel" && ev.lat);
  return (
    hotels.find((ev) => ev.startDate === dateKey) ||
    hotels.find((ev) => ev.startDate <= dateKey && dateKey <= ev.endDate) ||
    null
  );
}

async function fetchJson(url) {
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(json.reason);
  return json;
}

// Prognoza na najbliższe 16 dni, dobowa i godzinowa. Bez start_date/end_date,
// bo API odrzuca zakres wykraczający poza swoje okno — sami wybieramy, co pasuje.
async function fetchForecast(spot) {
  const res = await fetchJson(
    `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum` +
      `&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,weather_code` +
      `&timezone=Asia%2FTokyo&forecast_days=16`
  );

  // Godziny grupowane po dacie — API zwraca jedną płaską listę na cały zakres.
  const hoursByDay = {};
  res.hourly.time.forEach((stamp, i) => {
    if (res.hourly.temperature_2m[i] == null) return;
    const [date, time] = stamp.split("T");
    (hoursByDay[date] = hoursByDay[date] || []).push({
      hour: time.slice(0, 5),
      temp: Math.round(res.hourly.temperature_2m[i]),
      rain: res.hourly.precipitation_probability[i],
      mm: res.hourly.precipitation[i],
      wind: Math.round(res.hourly.wind_speed_10m[i]),
      code: res.hourly.weather_code[i],
    });
  });

  const daily = res.daily;
  const out = {};
  daily.time.forEach((key, i) => {
    // Ostatni dzień okna bywa jeszcze bez danych — inaczej Math.round(null) dałoby 0°.
    if (daily.temperature_2m_max[i] == null) return;
    out[key] = {
      code: daily.weather_code[i],
      max: Math.round(daily.temperature_2m_max[i]),
      min: Math.round(daily.temperature_2m_min[i]),
      rain: daily.precipitation_probability_max[i],
      mm: daily.precipitation_sum[i],
      hours: hoursByDay[key] || [],
      kind: "forecast",
    };
  });
  return out;
}

// Typowa pogoda dla tych dat — średnia z archiwum z poprzednich lat.
async function fetchNormals(spot, days) {
  const tripYear = Number(TRIP.startDate.slice(0, 4));
  const from = days[0].slice(5);
  const to = days[days.length - 1].slice(5);
  const acc = {}; // "MM-DD" -> { max: [], min: [], codes: [], mm: [] }

  const years = Array.from({ length: WEATHER_YEARS_BACK }, (_, i) => tripYear - 1 - i);
  await Promise.all(
    years.map(async (year) => {
      const daily = (
        await fetchJson(
          `https://archive-api.open-meteo.com/v1/archive?latitude=${spot.lat}&longitude=${spot.lon}` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FTokyo` +
            `&start_date=${year}-${from}&end_date=${year}-${to}`
        )
      ).daily;

      daily.time.forEach((date, i) => {
        const md = date.slice(5);
        const bucket = (acc[md] = acc[md] || { max: [], min: [], codes: [], mm: [] });
        if (daily.temperature_2m_max[i] != null) bucket.max.push(daily.temperature_2m_max[i]);
        if (daily.temperature_2m_min[i] != null) bucket.min.push(daily.temperature_2m_min[i]);
        if (daily.weather_code[i] != null) bucket.codes.push(daily.weather_code[i]);
        if (daily.precipitation_sum[i] != null) bucket.mm.push(daily.precipitation_sum[i]);
      });
    })
  );

  const mean = (nums) => nums.reduce((a, b) => a + b, 0) / nums.length;
  const avg = (nums) => Math.round(mean(nums));
  const mostCommon = (nums) =>
    nums.sort(
      (a, b) => nums.filter((n) => n === b).length - nums.filter((n) => n === a).length
    )[0];

  const out = {};
  days.forEach((key) => {
    const bucket = acc[key.slice(5)];
    if (!bucket || !bucket.max.length) return;
    out[key] = {
      code: mostCommon(bucket.codes),
      max: avg(bucket.max),
      min: avg(bucket.min),
      mm: bucket.mm.length ? mean(bucket.mm) : null,
      kind: "normal",
    };
  });
  return out;
}

async function fetchWeather() {
  // Jedno zapytanie na hotel — pogoda dotyczy miejsca, w którym faktycznie śpimy.
  const byHotel = new Map();
  tripDayKeys().forEach((key) => {
    const hotel = dayHotel(key);
    if (!hotel) return;
    if (!byHotel.has(hotel)) byHotel.set(hotel, []);
    byHotel.get(hotel).push(key);
  });

  const results = {};
  await Promise.all(
    [...byHotel].map(async ([hotel, days]) => {
      const forecast = await fetchForecast(hotel);
      const missing = days.filter((key) => !forecast[key]);
      const normals = missing.length ? await fetchNormals(hotel, missing) : {};
      days.forEach((key) => {
        const entry = forecast[key] || normals[key];
        if (entry) results[key] = { ...entry, city: hotel.city, place: hotel.title };
      });
    })
  );
  return results;
}

function getWeather() {
  return loadStore("weather");
}

// Odświeżamy co 6 h. Bez sieci (np. plik otwarty offline w Japonii)
// zostaje ostatnio zapisana pogoda zamiast pustego miejsca.
async function loadWeather() {
  const cached = getWeather();
  if (cached._ts && Date.now() - cached._ts < WEATHER_TTL_MS) return;

  let fresh;
  try {
    fresh = await fetchWeather();
  } catch {
    return;
  }

  Object.entries(fresh).forEach(([key, value]) => setStoreValue("weather", key, value));
  setStoreValue("weather", "_ts", Date.now());
  renderTimeline();
  renderCalendar();
}

function weatherBadgeHtml(dateKey) {
  const w = getWeather()[dateKey];
  if (!w) return "";
  const look = weatherLook(w.code);
  const isNormal = w.kind === "normal";
  const mm = formatMm(w.mm);
  const rainText = [w.rain != null ? `${w.rain}%` : null, mm].filter(Boolean).join(" · ");
  const title = isNormal
    ? `${look.label} · typowa pogoda dla tej daty (średnia z ${WEATHER_YEARS_BACK} ostatnich lat)` +
      (mm ? ` · opady ${mm}` : "")
    : `${look.label} · prognoza${rainText ? ` · opady ${rainText}` : ""}`;

  return `
    <button type="button" class="day-weather${isNormal ? " is-normal" : ""}" data-weather="${dateKey}" title="${escapeHtml(title)}">
      <span class="wx-icon">${look.icon}</span>
      <span class="wx-temp">${isNormal ? "~" : ""}${w.max}°<span class="wx-min">/${w.min}°</span></span>
      ${rainText ? `<span class="wx-rain">💧 ${rainText}</span>` : ""}
    </button>
  `;
}

// Rozkład godzinowy dnia: temperatura, szansa opadów, wiatr.
function openWeatherDetail(dateKey) {
  const w = getWeather()[dateKey];
  if (!w) return;

  const look = weatherLook(w.code);
  const { dow } = dayLabel(dateKey);
  const hours = w.hours || [];
  const body = hours.length
    ? `<div class="wx-table">
         <div class="wx-row wx-header">
           <span>Godz.</span><span></span><span>Temp.</span><span>💧 Opady</span><span>🍃 Wiatr</span>
         </div>
         ${hours
           .map(
             (h) => `
           <div class="wx-row">
             <span class="wx-h">${h.hour}</span>
             <span>${weatherLook(h.code).icon}</span>
             <span class="wx-h-temp">${h.temp}°</span>
             <span class="wx-h-rain${h.rain >= 40 ? " is-wet" : ""}">${h.rain != null ? `${h.rain}%` : "–"}${
               formatMm(h.mm) ? `<span class="wx-h-mm">${formatMm(h.mm)}</span>` : ""
             }</span>
             <span class="wx-h-wind">${h.wind} km/h</span>
           </div>`
           )
           .join("")}
       </div>`
    : `<p class="wx-note">
         Rozkład godzinowy pojawi się, gdy ten dzień wejdzie w zasięg prognozy
         (Open-Meteo podaje ją na 16 dni do przodu). Na razie widać średnią
         z ${WEATHER_YEARS_BACK} ostatnich lat dla tej daty.
       </p>`;

  openModal(`
    <div class="wx-detail">
      <header class="wx-detail-head">
        <span class="wx-detail-icon">${look.icon}</span>
        <div>
          <p class="wx-detail-title">${dow}, ${formatDayDate(dateKey)}</p>
          <p class="wx-detail-sub">${escapeHtml(w.place || w.city || "")}</p>
        </div>
      </header>
      <p class="wx-detail-summary">
        ${look.label} · ${w.kind === "normal" ? "~" : ""}${w.max}° / ${w.min}°
        ${w.rain != null ? ` · szansa opadów do ${w.rain}%` : ""}
        ${formatMm(w.mm) ? ` · suma opadów ${w.kind === "normal" ? "~" : ""}${formatMm(w.mm)}` : ""}
      </p>
      ${body}
    </div>
  `);
}

// ---------- Widok "Dzień po dniu" ----------

// Wszystkie dni wyjazdu jako klucze "YYYY-MM-DD"
function tripDayKeys() {
  const keys = [];
  let d = new Date(TRIP.startDate + "T00:00:00");
  const end = new Date(TRIP.endDate + "T00:00:00");
  while (d <= end) {
    keys.push(toLocalKey(d));
    d.setDate(d.getDate() + 1);
  }
  return keys;
}

// Hotel, auto i turniej sumo trwają wiele dni — pokazujemy je jako tło dnia,
// a nie jako osobne wydarzenie powtarzane kilkanaście razy.
function isContextEvent(ev) {
  return ev.type === "hotel" || ev.type === "car" || ev.type === "sumo";
}

// Wiersz kontekstu dnia: hotel z adresem, auto z numerem rezerwacji, turniej sumo.
function contextRowHtml(ev, dateKey) {
  const lines = [];
  let phase = ev.details || "";

  if (ev.type === "hotel") {
    if (dateKey === ev.startDate) {
      phase = `Zameldowanie${ev.checkIn ? ` · ${ev.checkIn}` : ""}`;
    } else if (dateKey === ev.endDate) {
      phase = `Wymeldowanie${ev.checkOut ? ` · ${ev.checkOut}` : ""}`;
    } else {
      phase = `Nocleg${ev.city ? ` · ${ev.city}` : ""}`;
    }
    if (ev.phone) lines.push(`☎️ ${ev.phone}`);
  } else if (ev.type === "car") {
    if (dateKey === ev.startDate) phase = "Odbiór auta · Naha Airport";
    else if (dateKey === ev.endDate) phase = "Zwrot auta · Naha Airport";
    else phase = "Auto do dyspozycji";
    if (ev.ref) lines.push(`Nr rezerwacji: ${ev.ref}`);
  }

  if (ev.address) lines.unshift(`📍 ${ev.address}`);

  return `
    <div class="ctx-row">
      <span class="ctx-icon">${ev.icon}</span>
      <div class="ctx-body">
        <p class="ctx-title">${ev.title}</p>
        ${phase ? `<p class="ctx-phase">${phase}</p>` : ""}
        ${lines.map((l) => `<p class="ctx-line">${l}</p>`).join("")}
        <div class="ctx-links">
          ${ev.mapQuery ? `<a href="${mapsUrl(ev.mapQuery)}" target="_blank" rel="noopener">mapa</a>` : ""}
          ${ev.booking ? `<a href="${ev.booking}" target="_blank" rel="noopener">rezerwacja</a>` : ""}
          ${ev.site ? `<a href="${ev.site}" target="_blank" rel="noopener">strona hotelu</a>` : ""}
        </div>
      </div>
    </div>
  `;
}

function dayLabel(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return {
    dow: WEEKDAYS_LONG[(d.getDay() + 6) % 7],
    dayNum: d.getDate(),
    monShort: MONTH_SHORT[d.getMonth()],
  };
}

function formatDayDate(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return `${d.getDate()} ${MONTH_NAMES_GEN[d.getMonth()]}`;
}

function eventCardHtml(ev) {
  const details = ev.details || "";
  const link = ev.link || ev.booking;
  return `
    <div class="event-card">
      <div class="event-icon">${ev.icon}</div>
      <div>
        <p class="event-title">${ev.time ? `<span class="event-time">${ev.time}</span>` : ""}${ev.title}</p>
        <p class="event-details">${details}${
          link ? ` · <a href="${link}" target="_blank" rel="noopener">link</a>` : ""
        }</p>
      </div>
    </div>
  `;
}

// Podpis pod nazwą dnia: który to dzień wyjazdu (poza terminem — sama data)
function daySubtitle(dateKey) {
  const keys = tripDayKeys();
  const i = keys.indexOf(dateKey);
  return i === -1 ? formatDayDate(dateKey) : `${i + 1}. dzień z ${keys.length}`;
}

// Wnętrze karty dnia — używane i w osi czasu, i w oknie dnia z kalendarza
function dayCardHtml(dateKey, dayEvents) {
  // W obrębie tego samego typu decyduje godzina; bez godziny wydarzenie idzie na koniec.
  const sorted = dayEvents
    .slice()
    .sort(
      (a, b) =>
        TYPE_ORDER[a.type] - TYPE_ORDER[b.type] ||
        (a.time || "99:99").localeCompare(b.time || "99:99")
    );
  const context = sorted.filter(isContextEvent);
  const main = sorted.filter((ev) => !isContextEvent(ev));
  const { dow, dayNum, monShort } = dayLabel(dateKey);

  return `
    <header class="day-head">
      <div class="day-date-box">
        <span class="day-num-big">${dayNum}</span>
        <span class="day-mon">${monShort}</span>
      </div>
      <div class="day-head-text">
        <p class="day-dow">${dow}</p>
        <p class="day-sub">${daySubtitle(dateKey)}</p>
      </div>
      ${weatherBadgeHtml(dateKey)}
    </header>
    ${
      context.length
        ? `<div class="day-context">${context
            .map((ev) => contextRowHtml(ev, dateKey))
            .join("")}</div>`
        : ""
    }
    <div class="day-events">${
      main.length
        ? `<p class="day-section">W planie</p>` + main.map(eventCardHtml).join("")
        : `<p class="day-empty">Dzień wolny 🐾</p>`
    }</div>
  `;
}

function renderTimeline() {
  const container = document.getElementById("timelineDays");
  container.innerHTML = "";

  const eventsByDay = buildEventsByDay([...EVENTS, ...buildPlannedEvents()]);
  const todayKey = toLocalKey(new Date());

  tripDayKeys().forEach((key) => {
    const card = document.createElement("article");
    card.className = "day-card" + (key === todayKey ? " today" : "");
    card.dataset.date = key;
    card.innerHTML = dayCardHtml(key, eventsByDay[key] || []);
    container.appendChild(card);
  });
}

// ---------- Widok "Podróż" ----------
const LOGISTICS_SECTIONS = [
  { type: "flight", title: "✈️ Loty", chip: "✈️ Loty" },
  { type: "train", title: "🚄 Shinkansen", chip: "🚄 Pociągi" },
  { type: "hotel", title: "🏨 Noclegi", chip: "🏨 Noclegi" },
  { type: "car", title: "🚗 Wynajem auta", chip: "🚗 Auto" },
  { type: "ticket", title: "🎟️ Wykupione bilety", chip: "🎟️ Bilety" },
];

let logisticsFilter = "all";

function logisticsCardHtml(ev) {
  const range = ev.date
    ? formatDayDate(ev.date)
    : `${formatDayDate(ev.startDate)} – ${formatDayDate(ev.endDate)}`;

  const rows = [
    ["Adres", ev.address],
    ["Skąd", ev.from],
    ["Dokąd", ev.to],
    ["Zameldowanie", ev.checkIn],
    ["Wymeldowanie", ev.checkOut],
    ["Przewoźnik", ev.carrier],
    ["Wylot", ev.depart],
    ["Przylot", ev.arrive],
    ["Telefon", ev.phone],
    ["Nr rezerwacji", ev.ref],
  ].filter(([, v]) => v);

  // Ze zdjęciem tytuł leży na zdjęciu, bez zdjęcia zostaje zwykły nagłówek z ikoną.
  const head = ev.photo
    ? `<div class="trip-photo">
         <img src="${ev.photo}" alt="" loading="lazy" />
         <div class="trip-photo-text">
           <span class="trip-badge">${ev.icon} ${range}</span>
           <p class="trip-title">${ev.title}</p>
         </div>
       </div>`
    : `<header class="trip-head">
         <span class="trip-icon">${ev.icon}</span>
         <div>
           <p class="trip-title">${ev.title}</p>
           <p class="trip-range">${range}</p>
         </div>
       </header>`;

  return `
    <article class="trip-card">
      ${head}
      <div class="trip-body">
        ${
          rows.length
            ? `<dl class="trip-rows">${rows
                .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
                .join("")}</dl>`
            : ""
        }
        ${
          ev.extra && ev.extra.length
            ? `<ul class="trip-extra">${ev.extra.map((e) => `<li>${e}</li>`).join("")}</ul>`
            : ""
        }
        <div class="trip-links">
          ${ev.fromMap ? `<a href="${mapsUrl(ev.fromMap)}" target="_blank" rel="noopener">📍 skąd</a>` : ""}
          ${ev.toMap ? `<a href="${mapsUrl(ev.toMap)}" target="_blank" rel="noopener">📍 dokąd</a>` : ""}
          ${!ev.fromMap && ev.mapQuery ? `<a href="${mapsUrl(ev.mapQuery)}" target="_blank" rel="noopener">📍 mapa</a>` : ""}
          ${ev.booking ? `<a href="${ev.booking}" target="_blank" rel="noopener">🛏️ rezerwacja</a>` : ""}
          ${ev.site ? `<a href="${ev.site}" target="_blank" rel="noopener">🌐 strona</a>` : ""}
          ${ev.link ? `<a href="${ev.link}" target="_blank" rel="noopener">🔗 link</a>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderLogisticsChips() {
  const container = document.getElementById("logisticsChips");
  // Przewinięcie paska ginie przy podmianie innerHTML — kliknięty chip uciekłby poza ekran.
  const scroll = container.scrollLeft;
  const chip = (type, label) =>
    `<button class="chip${logisticsFilter === type ? " active" : ""}" data-type="${type}">${label}</button>`;

  // Pakowanie to osobny panel, nie sekcja z EVENTS — dlatego jest poza "Wszystko".
  container.innerHTML =
    chip("all", "Wszystko") +
    LOGISTICS_SECTIONS.map((s) => chip(s.type, s.chip)).join("") +
    chip("packing", "🎒 Pakowanie");
  container.scrollLeft = scroll;

  if (container.dataset.bound) return;
  container.dataset.bound = "1";
  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    logisticsFilter = chip.dataset.type;
    renderLogisticsChips();
    renderLogistics();
    document.getElementById("view-logistics").scrollIntoView({ block: "start" });
  });
}

// ---------- Pakowanie ----------
// Klucz `${owner}:${id}` — Bartek i Paula pakują osobne walizki, więc ptaszek
// jednego nie może odhaczać drugiemu. "wspolne" to trzecia, dzielona lista.
let packingOwner = "";

function packingKey(owner, id) {
  return `${owner}:${id}`;
}

function packingGroups(owner) {
  return PACKING.filter((g) => Boolean(g.shared) === (owner === "wspolne"));
}

// Rzeczy dopisane ręcznie. Ten sam schemat klucza co przy ptaszkach, więc
// dopisek Pauli nie pojawi się na liście Bartka, a "wspolne:" widzą oboje.
function getPackingOwn(owner) {
  const prefix = `${owner}:`;
  return Object.entries(loadStore("packingOwn"))
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, label]) => ({ id: key.slice(prefix.length), label }));
}

function packingStats(owner) {
  const store = loadStore("packing");
  const items = packingGroups(owner)
    .flatMap((g) => g.items)
    .concat(getPackingOwn(owner));
  const done = items.filter((it) => store[packingKey(owner, it.id)]).length;
  return { done, total: items.length };
}

function packingOwners() {
  return USERS.map((u) => ({ id: u.id, label: `🧍 ${u.name}` })).concat({
    id: "wspolne",
    label: "👫 Wspólne",
  });
}

function packingItemHtml(owner, item, own) {
  const key = packingKey(owner, item.id);
  const checked = loadStore("packing")[key];
  return `
    <div class="packing-item${checked ? " done" : ""}">
      <label class="packing-check">
        <input type="checkbox" data-packing-item="${key}"${checked ? " checked" : ""} />
        <span class="packing-label">${escapeHtml(item.label)}${
          item.note ? `<span class="packing-note">${escapeHtml(item.note)}</span>` : ""
        }</span>
      </label>
      ${own ? `<button type="button" class="packing-del" data-packing-del="${key}" aria-label="Usuń rzecz">✕</button>` : ""}
    </div>
  `;
}

function packingHtml() {
  const owner = packingOwner;
  const { done, total } = packingStats(owner);

  const tabs = packingOwners()
    .map(
      (o) =>
        `<button type="button" class="packing-tab${o.id === owner ? " active" : ""}" data-packing-owner="${o.id}">${o.label}</button>`
    )
    .join("");

  const groups = packingGroups(owner)
    .map(
      (g) => `
        <section class="packing-group">
          <h2 class="trip-section-title">${g.group}<span class="trip-count">${g.items.length}</span></h2>
          ${g.items.map((it) => packingItemHtml(owner, it, false)).join("")}
        </section>
      `
    )
    .join("");

  const own = getPackingOwn(owner);
  const ownTitle = owner === "wspolne" ? "🧺 Nasze dopiski" : "🧺 Moje dopiski";

  return `
    <div class="packing-panel">
      <div class="packing-tabs">${tabs}</div>
      <div class="progress packing-progress">
        <p class="progress-label">${done}/${total} spakowane</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${total ? (done / total) * 100 : 0}%"></div></div>
      </div>
      ${groups}
      <section class="packing-group">
        <h2 class="trip-section-title">${ownTitle}<span class="trip-count packing-own-count">${own.length}</span></h2>
        <div class="packing-own">${own.map((it) => packingItemHtml(owner, it, true)).join("")}</div>
        <form class="packing-add">
          <input type="text" name="label" placeholder="Co jeszcze zabrać?" maxlength="60" autocomplete="off" />
          <button type="submit">Dodaj</button>
        </form>
      </section>
    </div>
  `;
}

function renderPacking(container) {
  if (!packingOwner) {
    const user = getCurrentUser();
    packingOwner = user ? user.id : "wspolne";
  }
  container.innerHTML = packingHtml();

  const form = container.querySelector(".packing-add");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const label = input.value.trim();
    if (!label) return;
    const id = `own${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
    setStoreValue("packingOwn", packingKey(packingOwner, id), label);
    // Dopisanie w miejscu zamiast re-renderu — pole zostaje aktywne i można
    // wyrzucić z głowy kilka rzeczy pod rząd, bez klikania w nie za każdym razem.
    container
      .querySelector(".packing-own")
      .insertAdjacentHTML("beforeend", packingItemHtml(packingOwner, { id, label }, true));
    input.value = "";
    input.focus();
    refreshPackingCounts();
  });
}

// Licznik i pasek żyją poza odhaczoną pozycją, więc po każdej zmianie trzeba je
// odświeżyć osobno — całego panelu nie ruszamy, żeby nie zgubić fokusu i miejsca.
function refreshPackingCounts() {
  const panel = document.querySelector(".packing-panel");
  if (!panel) return;
  const { done, total } = packingStats(packingOwner);
  panel.querySelector(".progress-label").textContent = `${done}/${total} spakowane`;
  panel.querySelector(".progress-fill").style.width = `${total ? (done / total) * 100 : 0}%`;
  panel.querySelector(".packing-own-count").textContent =
    panel.querySelectorAll(".packing-own .packing-item").length;
}

function renderLogistics() {
  const container = document.getElementById("logisticsList");

  if (logisticsFilter === "packing") {
    renderPacking(container);
    return;
  }

  const sections =
    logisticsFilter === "all"
      ? LOGISTICS_SECTIONS
      : LOGISTICS_SECTIONS.filter((s) => s.type === logisticsFilter);

  container.innerHTML = sections
    .map((section) => {
      const items = EVENTS.filter((ev) => ev.type === section.type);
      if (!items.length) return "";
      return `
        <section class="trip-section">
          <h2 class="trip-section-title">${section.title}<span class="trip-count">${items.length}</span></h2>
          ${items.map(logisticsCardHtml).join("")}
        </section>
      `;
    })
    .join("");
}

// ---------- Portfel ----------
// Kurs orientacyjny na wypadek pierwszego uruchomienia bez sieci. Lepiej pokazać
// przybliżoną złotówkę z adnotacją niż samo "12 500 ¥", które nic nie mówi.
const FX_FALLBACK = 0.027;
const FX_TTL_MS = 24 * 60 * 60 * 1000;

const EXPENSE_CATEGORIES = ["Jedzenie", "Transport", "Wstępy", "Zakupy", "Nocleg", "Inne"];

function getFxRate() {
  const fx = loadStore("fx");
  return {
    rate: typeof fx.rate === "number" ? fx.rate : FX_FALLBACK,
    fresh: typeof fx.rate === "number" && Date.now() - (fx.ts || 0) < FX_TTL_MS,
    known: typeof fx.rate === "number",
  };
}

// Frankfurter odpada — pod file:// (origin "null") oddaje 301 bez nagłówka CORS.
async function fetchFxRate() {
  const fx = loadStore("fx");
  if (typeof fx.rate === "number" && Date.now() - (fx.ts || 0) < FX_TTL_MS) return;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/JPY");
    const json = await res.json();
    const rate = json && json.rates && json.rates.PLN;
    if (typeof rate !== "number") return;
    setStoreValue("fx", "rate", rate);
    setStoreValue("fx", "ts", Date.now());
    renderWallet();
  } catch {
    // Brak sieci — zostaje ostatni znany kurs albo FX_FALLBACK.
  }
}

function getExpenses() {
  return Object.entries(loadStore("expenses"))
    .map(([id, e]) => ({ ...e, id }))
    .sort((a, b) => b.ts - a.ts);
}

function toYen(amount, currency) {
  return currency === "JPY" ? amount : amount / getFxRate().rate;
}

function expenseYen(e) {
  return toYen(e.amount, e.currency);
}

// Budżet jest wspólny — jeden zapis pod stałym kluczem, bez podziału na osoby.
function getFunds() {
  const saved = loadStore("funds").shared || {};
  return {
    card: Number(saved.card) || 0,
    cardCur: saved.cardCur === "JPY" ? "JPY" : "PLN",
    cash: Number(saved.cash) || 0,
    cashCur: saved.cashCur === "PLN" ? "PLN" : "JPY",
  };
}

function setFund(field, value) {
  setStoreValue("funds", "shared", { ...getFunds(), [field]: value });
}

function fundsYen(f) {
  return toYen(f.card, f.cardCur) + toYen(f.cash, f.cashCur);
}

function fundsSumHtml(f, rate) {
  const yen = fundsYen(f);
  return `Razem <strong>${formatMoney(yen, "JPY")}</strong> · ${formatMoney(yen * rate, "PLN")}`;
}

// Ustawianie budżetu schowane w oknie — na co dzień liczy się tylko "ile zostało".
function openFundsForm() {
  const f = getFunds();
  const { rate } = getFxRate();

  const row = (field, icon, label) => `
    <label class="funds-row">
      <span>${icon} ${label}</span>
      <input type="number" inputmode="decimal" step="0.01" min="0"
             data-fund="${field}" value="${f[field] || ""}" placeholder="0" />
      <select data-fund="${field}Cur">
        <option value="JPY"${f[`${field}Cur`] === "JPY" ? " selected" : ""}>¥</option>
        <option value="PLN"${f[`${field}Cur`] === "PLN" ? " selected" : ""}>zł</option>
      </select>
    </label>
  `;

  openModal(`
    <div class="account-panel">
      <h2 class="account-title">Wspólny budżet</h2>
      <p class="account-line muted">Ile macie na wyjazd. Wydatki odejmują się od tej kwoty.</p>
      <div class="funds-box">
        ${row("card", "💳", "Na karcie")}
        ${row("cash", "💵", "Gotówka")}
        <p class="funds-sum">${fundsSumHtml(f, rate)}</p>
      </div>
      <button type="button" class="btn-account" data-wallet="close">Gotowe</button>
    </div>
  `);

  bindFunds(document.getElementById("modalBody"));
}

// Bez pełnego re-renderu — podmiana innerHTML zabrałaby fokus z pola w trakcie pisania.
function bindFunds(container) {
  const box = container.querySelector(".funds-box");
  if (!box) return;

  const update = (e) => {
    const field = e.target.dataset.fund;
    if (!field) return;
    setFund(field, e.target.tagName === "SELECT" ? e.target.value : Number(e.target.value) || 0);
    box.querySelector(".funds-sum").innerHTML = fundsSumHtml(getFunds(), getFxRate().rate);
  };

  box.addEventListener("input", update);
  box.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") update(e);
  });
}

function formatMoney(value, currency) {
  const rounded = currency === "JPY" ? Math.round(value) : Math.round(value * 100) / 100;
  return `${rounded.toLocaleString("pl-PL")} ${currency === "JPY" ? "¥" : "zł"}`;
}

function renderWallet() {
  document.getElementById("walletPanel").innerHTML = walletHtml();
}

function expenseFormHtml(dayKeys) {
  const today = toLocalKey(new Date());
  const preselect = dayKeys.includes(today) ? today : dayKeys[0];
  return `
    <div class="account-panel">
      <h2 class="account-title">Nowy wydatek</h2>
      <form class="add-form" id="expenseForm">
        <label>Kwota
          <input name="amount" type="number" inputmode="decimal" step="0.01" min="0" required />
        </label>
        <label>Waluta
          <select name="currency"><option value="JPY">¥ jeny</option><option value="PLN">zł złote</option></select>
        </label>
        <label>Na co
          <input name="label" type="text" maxlength="60" placeholder="np. omakase" required />
        </label>
        <label>Kategoria
          <select name="category">${EXPENSE_CATEGORIES.map((c) => `<option>${c}</option>`).join("")}</select>
        </label>
        <label>Czym płacone
          <select name="method">
            <option value="card">💳 Karta</option>
            <option value="cash">💵 Gotówka</option>
          </select>
        </label>
        <label>Dzień
          <select name="dateKey">
            ${dayKeys
              .map(
                (k) =>
                  `<option value="${k}"${k === preselect ? " selected" : ""}>${formatDayDate(k)}</option>`
              )
              .join("")}
          </select>
        </label>
        <button class="btn-account" type="submit">Zapisz wydatek</button>
      </form>
    </div>
  `;
}

function openExpenseForm() {
  const dayKeys = tripDayKeys();
  openModal(expenseFormHtml(dayKeys));

  document.getElementById("expenseForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const amount = Number(f.get("amount"));
    if (!amount) return;
    const id = `x${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
    setStoreValue("expenses", id, {
      ts: Date.now(),
      amount,
      currency: f.get("currency"),
      label: String(f.get("label")).slice(0, 60),
      category: f.get("category"),
      method: f.get("method"),
      dateKey: f.get("dateKey"),
    });
    closeDetail();
    renderWallet();
  });
}

function walletHtml() {
  const list = getExpenses();
  const { rate, known, fresh } = getFxRate();
  const spent = list.reduce((sum, e) => sum + expenseYen(e), 0);
  const funds = getFunds();
  const budget = fundsYen(funds);
  const left = budget - spent;

  // Karta i gotówka to dwa osobne zapasy — po wydaniu ostatniego jena w kieszeni
  // saldo na karcie w niczym nie pomoże przy automacie z biletami.
  const spentCash = list
    .filter((e) => e.method === "cash")
    .reduce((s, e) => s + expenseYen(e), 0);
  const byMethod = [
    { icon: "💳", label: "Karta", yen: toYen(funds.card, funds.cardCur) - (spent - spentCash) },
    { icon: "💵", label: "Gotówka", yen: toYen(funds.cash, funds.cashCur) - spentCash },
  ];

  // Bez budżetu nie ma od czego odejmować — pokazujemy same wydatki i zachętę.
  const heroLabel = budget ? "Zostało" : "Wydane";
  const heroYen = budget ? left : spent;

  const byCategory = EXPENSE_CATEGORIES.map((cat) => ({
    cat,
    yen: list.filter((e) => e.category === cat).reduce((s, e) => s + expenseYen(e), 0),
  }))
    .filter((c) => c.yen > 0)
    .sort((a, b) => b.yen - a.yen);

  const rateNote = known ? (fresh ? "" : " · kurs z pamięci") : " · kurs orientacyjny";

  return `
    <section class="trip-section">
      <div class="wallet-total${budget && left < 0 ? " over" : ""}">
        <p class="wallet-hero-label">${heroLabel}</p>
        <p class="wallet-yen">${formatMoney(heroYen, "JPY")}</p>
        <p class="wallet-pln">${formatMoney(heroYen * rate, "PLN")}</p>
        <p class="wallet-rate">1 ¥ = ${rate.toFixed(4).replace(".", ",")} zł${rateNote}</p>
        ${
          budget
            ? `<div class="wallet-split">${byMethod
                .map(
                  (m) => `
                    <div class="wallet-split-item${m.yen < 0 ? " over" : ""}">
                      <p class="wallet-split-label">${m.icon} ${m.label}</p>
                      <p class="wallet-split-yen">${formatMoney(m.yen, "JPY")}</p>
                    </div>
                  `
                )
                .join("")}</div>`
            : ""
        }
      </div>

      ${
        budget
          ? `
            <div class="progress wallet-progress">
              <p class="progress-label">Wydane ${formatMoney(spent, "JPY")} z ${formatMoney(budget, "JPY")}</p>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${Math.min(100, Math.round((spent / budget) * 100))}%"></div>
              </div>
            </div>
          `
          : `<p class="wallet-hint">Nie macie jeszcze ustawionego budżetu — dodaj go niżej, żeby widzieć, ile zostało.</p>`
      }

      <button class="btn-account wallet-add" type="button" data-wallet="add">+ Dodaj wydatek</button>

      <h2 class="trip-section-title">Na co poszło<span class="trip-count">${list.length}</span></h2>

      ${
        byCategory.length
          ? `<dl class="trip-rows wallet-cats">${byCategory
              .map(
                (c) =>
                  `<dt>${c.cat}</dt><dd>${formatMoney(c.yen, "JPY")} · ${formatMoney(c.yen * rate, "PLN")}</dd>`
              )
              .join("")}</dl>`
          : ""
      }

      ${
        list.length
          ? list
              .map(
                (e) => `
                  <article class="wallet-row">
                    <div>
                      <p class="wallet-label">${escapeHtml(e.label)}</p>
                      <p class="wallet-meta">${e.method === "cash" ? "💵" : "💳"} ${formatDayDate(
                        e.dateKey
                      )} · ${escapeHtml(e.category)}</p>
                    </div>
                    <div class="wallet-amount">
                      <p>${formatMoney(e.amount, e.currency)}</p>
                      <button type="button" class="wallet-del" data-wallet="del" data-id="${e.id}" aria-label="Usuń wydatek">✕</button>
                    </div>
                  </article>
                `
              )
              .join("")
          : `<p class="day-empty">Jeszcze nic nie wydaliście 🐾</p>`
      }

      <button class="wallet-budget" type="button" data-wallet="funds">⚙️ Wspólny budżet: ${formatMoney(budget, "JPY")}</button>
    </section>
  `;
}

function renderMonth(year, month, eventsByDay) {
  const monthEl = document.createElement("div");
  monthEl.className = "month";

  const h2 = document.createElement("h2");
  h2.textContent = `${MONTH_NAMES[month]} ${year}`;
  monthEl.appendChild(h2);

  const grid = document.createElement("div");
  grid.className = "month-grid";

  WEEKDAYS.forEach((w) => {
    const el = document.createElement("div");
    el.className = "weekday";
    el.textContent = w;
    grid.appendChild(el);
  });

  const firstDay = new Date(year, month, 1);
  // poniedziałek = 0 ... niedziela = 6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement("div");
    el.className = "day-cell empty";
    grid.appendChild(el);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = eventsByDay[key] || [];

    const cell = document.createElement("div");
    cell.className =
      "day-cell" +
      (dayEvents.length ? " has-events" : "") +
      (key === toLocalKey(new Date()) ? " today" : "");
    cell.dataset.date = key;

    const num = document.createElement("div");
    num.className = "day-num";
    num.textContent = day;
    cell.appendChild(num);

    const weather = getWeather()[key];
    if (weather) {
      const wx = document.createElement("div");
      wx.className = "cell-weather";
      wx.textContent = `${weatherLook(weather.code).icon} ${weather.max}°`;
      cell.appendChild(wx);
    }

    // Tylko przejazdy — reszta planu zagłuszałaby pogodę, a jest po kliknięciu w dzień.
    // Auto pokazujemy w dniu odbioru i zwrotu, nie przez cały czas wynajmu.
    const travelIcons = [
      ...new Set(
        dayEvents
          .filter((ev) =>
            ev.type === "car"
              ? key === ev.startDate || key === ev.endDate
              : ev.type === "flight" || ev.type === "train"
          )
          .map((ev) => ev.icon)
      ),
    ];
    if (travelIcons.length) {
      const icons = document.createElement("div");
      icons.className = "day-icons";
      icons.textContent = travelIcons.join("");
      cell.appendChild(icons);
    }

    if (dayEvents.length) {
      cell.addEventListener("click", () => showDayDetails(key, dayEvents, cell));
    }

    grid.appendChild(cell);
  }

  monthEl.appendChild(grid);
  return monthEl;
}

// Plan dnia w oknie na środku ekranu — panel na dole kalendarza wymagał scrollowania.
function showDayDetails(dateKey, events, cellEl) {
  document.querySelectorAll(".day-cell.selected").forEach((c) => c.classList.remove("selected"));
  cellEl.classList.add("selected");
  openModal(`<article class="day-card">${dayCardHtml(dateKey, events)}</article>`);
}

function renderCalendar() {
  const container = document.getElementById("calendarMonths");
  container.innerHTML = "";
  const eventsByDay = buildEventsByDay([...EVENTS, ...buildPlannedEvents()]);
  container.appendChild(renderMonth(2026, 8, eventsByDay)); // wrzesień
  container.appendChild(renderMonth(2026, 9, eventsByDay)); // październik
}

// ---------- Szukajka i filtry ----------
let filterState = { q: "", city: "", category: "", status: "all" };

// "Małe Edo" ma trafić w zapytanie "male": NFD nie rozkłada ł, więc podmieniamy ręcznie.
function normalizeText(s) {
  return String(s)
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesFilters(item, city, category) {
  if (filterState.city && filterState.city !== city) return false;
  if (filterState.category && filterState.category !== category) return false;

  if (filterState.q) {
    const haystack = normalizeText(
      `${item.name} ${item.note || ""} ${item.desc || ""} ${city} ${category}`
    );
    if (!haystack.includes(normalizeText(filterState.q))) return false;
  }

  const hasDate = Boolean(item.date || getUserDates()[item.id]);
  if (filterState.status === "planned" && !hasDate) return false;
  if (filterState.status === "nodate" && hasDate) return false;
  if (filterState.status === "visited" && !getVisited()[item.id]) return false;

  return true;
}

function renderChipRow(containerId, values, key) {
  const container = document.getElementById(containerId);
  const active = filterState[key];
  container.innerHTML =
    `<button class="chip${active ? "" : " active"}" data-value="">Wszystkie</button>` +
    values
      .map((v) => {
        const safe = escapeHtml(v);
        return `<button class="chip${active === v ? " active" : ""}" data-value="${safe}">${safe}</button>`;
      })
      .join("");

  // Listener podpinamy raz — renderChipRow biegnie ponownie po dodaniu atrakcji.
  if (container.dataset.bound) return;
  container.dataset.bound = "1";

  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filterState[key] = chip.dataset.value;
    container.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    renderAttractions();
  });
}

function renderFilterChips() {
  const blocks = getAttractionBlocks();
  renderChipRow("cityChips", blocks.map((b) => b.city), "city");

  const categories = [...new Set(blocks.flatMap((b) => b.groups.map((g) => g.category)))];
  renderChipRow("categoryChips", categories, "category");

  const statusChips = document.getElementById("statusChips");
  if (statusChips.dataset.bound) return;
  statusChips.dataset.bound = "1";
  statusChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filterState.status = chip.dataset.status;
    statusChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    renderAttractions();
  });
}

function renderProgress() {
  const total = flattenAttractions().length;
  const done = flattenAttractions().filter((item) => getVisited()[item.id]).length;
  document.getElementById("progressLabel").textContent = `${done}/${total} zwiedzone`;
  document.getElementById("progressFill").style.width = `${(done / total) * 100}%`;
}

// ---------- Szczegóły atrakcji ----------
function openModal(html) {
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("detailModal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  // Dopiero po zdjęciu .hidden kontener ma niezerową szerokość.
  document.querySelectorAll("#modalBody .map-mini").forEach(fillMiniMap);
}

function closeDetail() {
  document.getElementById("detailModal").classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function openDetail(item, city, category) {
  const info = ATTRACTION_DETAILS[item.id] || {};
  const author = USERS.find((u) => u.id === item.author);
  const desc = info.desc || item.desc;

  openModal(`
    ${
      item.photo
        ? `<div class="modal-photo-wrap"><img class="modal-photo" src="${item.photo}" alt="" /></div>`
        : ""
    }
    <div class="modal-content">
      <p class="modal-eyebrow">${escapeHtml(city)} · ${escapeHtml(category)}</p>
      <h2 class="modal-title" id="modalTitle">${escapeHtml(item.name)}</h2>
      ${item.date ? `<p class="modal-date">🗓️ ${escapeHtml(item.date)}</p>` : ""}
      <p class="modal-desc">${
        desc
          ? escapeHtml(desc)
          : "Opisu jeszcze nie ma — dopiszcie w komentarzu, co warto wiedzieć."
      }</p>
      ${
        info.tips && info.tips.length
          ? `<ul class="modal-tips">${info.tips.map((t) => `<li>${t}</li>`).join("")}</ul>`
          : ""
      }
      ${item.note ? `<p class="modal-note">ℹ️ ${escapeHtml(item.note)}</p>` : ""}
      ${
        author
          ? `<p class="modal-author"><img src="${author.avatar}" alt="" />Dodane przez: ${author.name}</p>`
          : ""
      }
      <div class="modal-links">
        ${item.mapQuery ? `<a href="${mapsUrl(item.mapQuery)}" target="_blank" rel="noopener">📍 mapa</a>` : ""}
        ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener">🔗 rezerwacja</a>` : ""}
        ${item.custom ? `<button class="modal-delete" type="button">🗑️ Usuń atrakcję</button>` : ""}
      </div>
      ${miniMapHtml(item)}
      <div class="comments">
        <div class="comment-list">${commentsHtml(item.id)}</div>
        <div class="comment-form">
          <input class="comment-input" type="text" placeholder="Komentarz…" />
          <button class="comment-send" type="button">Dodaj</button>
        </div>
      </div>
    </div>
  `);

  const body = document.getElementById("modalBody");
  const commentList = body.querySelector(".comment-list");
  const commentInput = body.querySelector(".comment-input");
  const submitComment = () => {
    if (!addComment(item.id, commentInput.value)) return;
    commentInput.value = "";
    commentList.innerHTML = commentsHtml(item.id);
    // Karta na liście ma własną kopię komentarzy — odświeżamy tylko ją.
    const cardList = document.querySelector(`.attraction-card[data-id="${item.id}"] .comment-list`);
    if (cardList) cardList.innerHTML = commentsHtml(item.id);
  };
  body.querySelector(".comment-send").addEventListener("click", submitComment);
  commentInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitComment();
  });

  const del = document.querySelector(".modal-delete");
  if (del) {
    del.addEventListener("click", () => {
      if (!confirm(`Usunąć atrakcję „${item.name}”?`)) return;
      setStoreValue("custom", item.id, "");
      closeDetail();
      refreshAttractions();
    });
  }
}

// ---------- Ręczne dodawanie atrakcji ----------
// Skalujemy zdjęcie w canvasie — pełne zdjęcie z telefonu przepełniłoby localStorage.
function readPhoto(file) {
  return new Promise((resolve) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onerror = () => resolve("");
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve("");
      img.onload = () => {
        const scale = Math.min(1, 720 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function refreshAttractions() {
  renderFilterChips();
  renderAttractions();
  renderProgress();
  renderCalendar();
  renderTimeline();
}

function openAddForm() {
  const user = getCurrentUser();
  const blocks = getAttractionBlocks();
  const cities = blocks.map((b) => b.city);
  const categories = [...new Set(blocks.flatMap((b) => b.groups.map((g) => g.category)))];
  const options = (values) =>
    values.map((v) => `<option value="${escapeHtml(v)}"></option>`).join("");

  openModal(`
    <div class="modal-content">
      <h2 class="modal-title" id="modalTitle">Nowa atrakcja</h2>
      <form class="add-form" id="addForm">
        <label>Nazwa
          <input name="name" type="text" maxlength="90" required />
        </label>
        <label>Miasto
          <input name="city" type="text" list="cityOptions" maxlength="40" required />
          <datalist id="cityOptions">${options(cities)}</datalist>
        </label>
        <label>Kategoria
          <input name="category" type="text" list="categoryOptions" maxlength="40" required />
          <datalist id="categoryOptions">${options(categories)}</datalist>
        </label>
        <label>Opis (opcjonalnie)
          <textarea name="desc" rows="3" maxlength="400"></textarea>
        </label>
        <label>Zdjęcie (opcjonalnie)
          <input name="photo" type="file" accept="image/*" />
        </label>
        <button class="add-submit" type="submit">Dodaj atrakcję</button>
        <p class="add-error hidden" id="addError"></p>
      </form>
    </div>
  `);

  const form = document.getElementById("addForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const error = document.getElementById("addError");
    if (!user) {
      error.textContent = "Najpierw wybierz, kto zwiedza.";
      error.classList.remove("hidden");
      return;
    }

    const submit = form.querySelector(".add-submit");
    submit.disabled = true;
    submit.textContent = "Zapisuję…";

    // form.elements, bo form.name to nazwa formularza, nie pole o nazwie "name"
    const fields = form.elements;
    const name = fields.name.value.trim();
    const city = fields.city.value.trim();
    const item = {
      id: `custom-${Date.now()}`,
      name,
      city,
      category: fields.category.value.trim(),
      desc: fields.desc.value.trim(),
      photo: await readPhoto(fields.photo.files[0]),
      mapQuery: `${name} ${city}`,
      author: user.id,
      custom: true,
    };

    setStoreValue("custom", item.id, item);
    closeDetail();
    refreshAttractions();
  });
}

function renderAttractions() {
  const container = document.getElementById("attractionsList");
  container.innerHTML = "";

  getAttractionBlocks().forEach((cityBlock) => {
    const block = document.createElement("div");
    block.className = "city-block";

    const header = document.createElement("div");
    header.className = "city-header";
    header.innerHTML = `<h2>${escapeHtml(cityBlock.city)}</h2><span>${escapeHtml(cityBlock.dates)}</span>`;
    block.appendChild(header);

    let cityCount = 0;

    cityBlock.groups.forEach((group) => {
      const visible = group.items.filter((item) =>
        matchesFilters(item, cityBlock.city, group.category)
      );
      if (!visible.length) return;
      cityCount += visible.length;

      const catBlock = document.createElement("div");
      catBlock.className = "category-block";

      const title = document.createElement("p");
      title.className = "category-title";
      title.textContent = group.category;
      catBlock.appendChild(title);

      const cards = document.createElement("div");
      cards.className = "attraction-cards";

      visible.forEach((item) => {
        const card = document.createElement("div");
        const isVisited = Boolean(getVisited()[item.id]);
        card.className = "attraction-card" + (isVisited ? " visited" : "");
        card.dataset.id = item.id;
        const meta = [item.date, item.note].filter(Boolean).join(" · ");
        const savedDate = getUserDates()[item.id] || "";
        const savedTime = getUserTimes()[item.id] || "";

        // Zakres ograniczony do dni wyjazdu — poza nimi i tak nie ma nas w Japonii.
        // Godzina bez daty nie ma sensu, więc pole czeka zablokowane, aż dzień będzie wybrany.
        const dateControl = item.date
          ? ""
          : `<div class="plan-row">
               <label class="date-picker">🗓️ <input type="date" data-id="${item.id}" value="${savedDate}" min="${TRIP.startDate}" max="${TRIP.endDate}" /></label>
               <label class="time-picker">🕘 <input type="time" value="${savedTime}"${savedDate ? "" : " disabled"} /></label>
             </div>`;

        card.innerHTML = `
          ${
            item.photo
              ? `<div class="thumb">
                   <img src="${item.photo}" alt="${escapeHtml(item.name)}" loading="lazy" />
                   ${authorWatermark(item)}
                 </div>`
              : ""
          }
          <p class="name">${item.photo ? "" : authorWatermark(item)}${escapeHtml(item.name)}</p>
          ${meta ? `<p class="meta">${escapeHtml(meta)}</p>` : ""}
          <div class="card-links">
            ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener">rezerwacja →</a>` : ""}
            ${item.mapQuery ? `<a href="${mapsUrl(item.mapQuery)}" target="_blank" rel="noopener">📍 mapa</a>` : ""}
          </div>
          ${dateControl}
          <label class="visit-check">
            <input type="checkbox" ${isVisited ? "checked" : ""} /> Zwiedzone
          </label>
          <div class="comments">
            <div class="comment-list">${commentsHtml(item.id)}</div>
            <div class="comment-form">
              <input class="comment-input" type="text" placeholder="Komentarz…" />
              <button class="comment-send" type="button">Dodaj</button>
            </div>
          </div>
        `;

        const img = card.querySelector(".thumb img");
        if (img) {
          img.addEventListener("error", () => {
            card.querySelector(".thumb").remove();
            card.classList.add("no-photo");
          });
        }

        const input = card.querySelector("input[type=date]");
        const timeInput = card.querySelector("input[type=time]");
        if (input) {
          input.addEventListener("change", () => {
            // Datę spoza wyjazdu da się jeszcze wpisać z klawiatury — cofamy ją.
            if (!input.validity.valid) {
              input.value = getUserDates()[item.id] || "";
              return;
            }
            setUserDate(item.id, input.value);
            // Skasowany dzień zabiera ze sobą godzinę — inaczej zostałaby sierota w store.
            timeInput.disabled = !input.value;
            if (!input.value) {
              timeInput.value = "";
              setUserTime(item.id, "");
            }
            renderCalendar();
            renderTimeline();
          });

          timeInput.addEventListener("change", () => {
            setUserTime(item.id, timeInput.value);
            renderCalendar();
            renderTimeline();
          });
        }

        // Bez re-renderu listy — inaczej karta znikałaby spod palca przy aktywnym filtrze.
        card.querySelector(".visit-check input").addEventListener("change", (e) => {
          setVisited(item.id, e.target.checked);
          card.classList.toggle("visited", e.target.checked);
          renderProgress();
          renderCalendar();
          renderTimeline();
        });

        // Klik w kartę otwiera szczegóły, ale nie wtedy, gdy celem był link lub kontrolka.
        card.addEventListener("click", (e) => {
          if (e.target.closest("a, input, button, label")) return;
          openDetail(item, cityBlock.city, group.category);
        });

        // Odświeżamy tylko listę komentarzy tej karty — pełny re-render zabrałby fokus.
        const commentList = card.querySelector(".comment-list");
        const commentInput = card.querySelector(".comment-input");
        const submitComment = () => {
          if (!addComment(item.id, commentInput.value)) return;
          commentInput.value = "";
          commentList.innerHTML = commentsHtml(item.id);
        };
        card.querySelector(".comment-send").addEventListener("click", submitComment);
        commentInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") submitComment();
        });

        cards.appendChild(card);
      });

      catBlock.appendChild(cards);
      block.appendChild(catBlock);
    });

    if (cityCount) container.appendChild(block);
  });

  if (!container.children.length) {
    container.innerHTML = `<p class="empty-msg">Nic nie pasuje 🐼</p>`;
  }

  renderCityMap();
}

// ---------- Logowanie ----------
function renderUserBadge() {
  const badge = document.getElementById("userBadge");
  const user = getCurrentUser();
  if (!user || !document.body.classList.contains("app-started")) {
    badge.classList.add("hidden");
    return;
  }
  badge.innerHTML = `<img src="${user.avatar}" alt="" /><span>${user.name}</span>`;
  badge.classList.remove("hidden");
}

function selectUser(id) {
  setCurrentUser(id);
  document.querySelectorAll(".login-user").forEach((b) => {
    b.classList.toggle("active", b.dataset.id === id);
  });
  document.getElementById("startBtn").disabled = false;
  renderUserBadge();
  // Po przelogowaniu lista pakowania ma pokazywać walizkę tego, kto właśnie wszedł.
  packingOwner = id;
  renderLogistics();
}

// Panel pod plakietką w nawigacji — jedyne miejsce na sprawy konta i danych,
// bo pasek nawigacji nie ma już miejsca na kolejny przycisk.
function openAccountPanel() {
  const user = getCurrentUser();
  const cfg = syncConfig();
  const used = storageSize();
  const limit = 5 * 1024 * 1024;
  const pct = Math.min(100, Math.round((used / limit) * 100));

  openModal(`
    <div class="account-panel">
      <h2 class="account-title">Konto i dane</h2>

      <p class="account-line">Zalogowany: <strong>${escapeHtml(user ? user.name : "nikt")}</strong></p>
      <div class="account-users">
        ${USERS.map(
          (u) => `<button type="button" class="login-user${user && user.id === u.id ? " active" : ""}"
                    data-switch="${u.id}"><img src="${u.avatar}" alt="" /><span>${escapeHtml(u.name)}</span></button>`
        ).join("")}
      </div>

      <h3 class="account-sub">Kopia zapasowa</h3>
      <p class="account-line muted">
        Plik z datami, komentarzami i własnymi atrakcjami. Wyślij go drugiej osobie,
        żeby scalić plany — nic się przy tym nie nadpisze.
      </p>
      <div class="account-actions">
        <button type="button" class="btn-account" data-backup="export">⬇️ Pobierz kopię</button>
        <button type="button" class="btn-account" data-backup="import">⬆️ Wczytaj kopię</button>
      </div>
      <input type="file" id="backupFile" accept="application/json,.json" class="hidden" />

      <h3 class="account-sub">Synchronizacja</h3>
      <p class="account-line muted">
        Wspólna baza, żeby daty, wydatki i pakowanie widzieć na obu telefonach.
        Adres i klucz wklejasz raz na każdym urządzeniu — nie ma ich w kodzie apki.
      </p>
      <div class="sync-fields">
        <input type="url" id="syncUrl" placeholder="https://twojprojekt.supabase.co"
               value="${escapeHtml(cfg.url)}" autocomplete="off" spellcheck="false" />
        <input type="password" id="syncKey" placeholder="klucz anon"
               value="${escapeHtml(cfg.key)}" autocomplete="off" spellcheck="false" />
      </div>
      <div class="account-actions">
        <button type="button" class="btn-account" data-sync="save">💾 Zapisz</button>
        <button type="button" class="btn-account" data-sync="now"${syncReady() ? "" : " disabled"}>🔄 Synchronizuj</button>
      </div>
      <p class="account-line muted" id="syncStatus">${escapeHtml(syncStatusText())}</p>

      <h3 class="account-sub">Pamięć</h3>
      <div class="storage-bar"><div class="storage-fill" style="width:${pct}%"></div></div>
      <p class="account-line muted">${formatBytes(used)} z około 5 MB${
        pct >= 80 ? " — zrób kopię, zanim zabraknie miejsca" : ""
      }</p>
      ${
        storageState !== "ok"
          ? `<p class="account-line warn">${
              storageState === "full"
                ? "Zapis nie działa: pamięć jest pełna."
                : "Ta kopia nie zapisuje zmian na stałe — pobierz kopię przed zamknięciem karty."
            }</p>`
          : ""
      }
    </div>
  `);
}

function renderLoginPanel() {
  const panel = document.getElementById("loginPanel");
  panel.innerHTML = USERS.map(
    (u) => `
      <button class="login-user" type="button" data-id="${u.id}">
        <img src="${u.avatar}" alt="" />
        <span>${u.name}</span>
      </button>
    `
  ).join("");

  panel.addEventListener("click", (e) => {
    const btn = e.target.closest(".login-user");
    if (btn) selectUser(btn.dataset.id);
  });

  const saved = getCurrentUser();
  if (saved) selectUser(saved.id);
}

let scrolledToToday = false;

function scrollToToday() {
  if (scrolledToToday) return;
  scrolledToToday = true;
  const target =
    document.querySelector(".day-card.today") || document.querySelector(".day-card");
  if (target) target.scrollIntoView({ block: "start" });
}

function switchView(view) {
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  document.getElementById(`view-${view}`).classList.remove("hidden");

  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.nav-btn[data-view="${view}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  if (view === "timeline") scrollToToday();
}

function init() {
  document.getElementById("tripTitle").textContent = TRIP.title;
  document.getElementById("tripSubtitle").textContent = TRIP.subtitle;

  document.getElementById("startBtn").addEventListener("click", () => {
    if (!getCurrentUser()) return;
    document.body.classList.add("app-started");
    document.getElementById("nav").classList.remove("hidden");
    switchView("calendar");
    renderUserBadge();
  });

  document.getElementById("userBadge").addEventListener("click", openAccountPanel);

  document.getElementById("mapToggleBtn").addEventListener("click", (e) => {
    mapState.open = !mapState.open;
    e.currentTarget.classList.toggle("active", mapState.open);
    renderCityMap();
  });


  // Kopia zapasowa jest obsługiwana i z panelu konta, i z paska ostrzeżenia.
  document.addEventListener("click", (e) => {
    const action = e.target.closest("[data-backup]");
    if (action) {
      if (action.dataset.backup === "export") exportData();
      else document.getElementById("backupFile").click();
      return;
    }
    const sync = e.target.closest("[data-sync]");
    if (sync) {
      if (sync.dataset.sync === "save") {
        setStoreValue("sync", "url", document.getElementById("syncUrl").value.trim());
        setStoreValue("sync", "key", document.getElementById("syncKey").value.trim());
        if (!syncReady()) {
          setSyncState("off", "");
          return;
        }
        setSyncState("idle", "");
        queueEverything();
      }
      syncNow({ manual: true });
      return;
    }
    const swap = e.target.closest("[data-switch]");
    if (swap) {
      selectUser(swap.dataset.switch);
      closeDetail();
      refreshAttractions();
      return;
    }
    const packDel = e.target.closest("[data-packing-del]");
    if (packDel) {
      if (confirm("Usunąć tę rzecz z listy?")) {
        const key = packDel.dataset.packingDel;
        setStoreValue("packingOwn", key, "");
        setStoreValue("packing", key, "");
        packDel.closest(".packing-item").remove();
        refreshPackingCounts();
      }
      return;
    }
    const tab = e.target.closest("[data-packing-owner]");
    if (tab) {
      packingOwner = tab.dataset.packingOwner;
      renderLogistics();
      return;
    }
    const wallet = e.target.closest("[data-wallet]");
    if (wallet) {
      const what = wallet.dataset.wallet;
      if (what === "add") openExpenseForm();
      else if (what === "funds") openFundsForm();
      else if (what === "close") {
        closeDetail();
        renderWallet();
      } else if (confirm("Usunąć ten wydatek?")) {
        setStoreValue("expenses", wallet.dataset.id, "");
        renderWallet();
      }
    }
  });

  document.addEventListener("change", (e) => {
    const box = e.target.closest("[data-packing-item]");
    if (box) {
      setStoreValue("packing", box.dataset.packingItem, box.checked ? 1 : "");
      // Bez pełnego re-renderu — lista skoczyłaby pod palcem przy odhaczaniu.
      box.closest(".packing-item").classList.toggle("done", box.checked);
      refreshPackingCounts();
      return;
    }
    if (e.target.id !== "backupFile" || !e.target.files.length) return;
    importData(e.target.files[0]);
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  document.getElementById("modalClose").addEventListener("click", closeDetail);
  document.querySelector(".modal-backdrop").addEventListener("click", closeDetail);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    filterState.q = e.target.value;
    renderAttractions();
  });

  document.getElementById("addAttractionBtn").addEventListener("click", openAddForm);

  // Plakietka pogody jest i na osi czasu, i w oknie dnia — jeden delegowany listener.
  document.addEventListener("click", (e) => {
    const badge = e.target.closest("[data-weather]");
    if (badge) openWeatherDetail(badge.dataset.weather);
  });

  probeStorage();
  renderStorageWarning();
  seedSuggestedDates();
  if (syncReady()) {
    setSyncState("idle", "");
    syncNow();
  }
  renderLoginPanel();
  renderFilterChips();
  renderLogisticsChips();
  renderLogistics();
  renderWallet();
  renderTimeline();
  renderCalendar();
  renderAttractions();
  renderProgress();
  loadWeather();
  fetchFxRate();
}

document.addEventListener("DOMContentLoaded", init);
