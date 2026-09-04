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
  visited: "bubuDudu.attractionVisited",
  comments: "bubuDudu.attractionComments",
  session: "bubuDudu.session",
  custom: "bubuDudu.customAttractions",
};

// Część przeglądarek blokuje localStorage przy otwarciu pliku przez file://,
// więc trzymamy też kopię w pamięci, żeby aplikacja działała w tej samej sesji.
const memoryStore = {};

function loadStore(name) {
  if (memoryStore[name]) return memoryStore[name];
  try {
    return JSON.parse(localStorage.getItem(STORE_KEYS[name])) || {};
  } catch {
    return {};
  }
}

function setStoreValue(name, id, value) {
  const store = loadStore(name);
  if (value) store[id] = value;
  else delete store[id];
  memoryStore[name] = store;
  try {
    localStorage.setItem(STORE_KEYS[name], JSON.stringify(store));
  } catch {
    // zostaje kopia w pamięci
  }
}

function getUserDates() {
  return loadStore("dates");
}

function setUserDate(id, date) {
  setStoreValue("dates", id, date);
}

function getVisited() {
  return loadStore("visited");
}

function setVisited(id, isVisited) {
  setStoreValue("visited", id, isVisited || "");
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
  const visited = getVisited();
  const flat = flattenAttractions();
  const planned = [];
  flat.forEach((item) => {
    const date = userDates[item.id];
    if (!date) return;
    planned.push({
      date,
      type: "planned",
      icon: visited[item.id] ? "✅" : "📌",
      title: escapeHtml(item.name),
      details: "Zaplanowane samodzielnie w zakładce Atrakcje",
      link: item.link,
    });
  });
  return planned;
}

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
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
        <p class="event-title">${ev.title}</p>
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
  const sorted = dayEvents
    .slice()
    .sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
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
  { type: "flight", title: "✈️ Loty" },
  { type: "train", title: "🚄 Shinkansen" },
  { type: "hotel", title: "🏨 Noclegi" },
  { type: "car", title: "🚗 Wynajem auta" },
  { type: "ticket", title: "🎟️ Wykupione bilety" },
];

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

  return `
    <article class="trip-card">
      ${ev.photo ? `<div class="trip-photo"><img src="${ev.photo}" alt="" loading="lazy" /></div>` : ""}
      <header class="trip-head">
        <span class="trip-icon">${ev.icon}</span>
        <div>
          <p class="trip-title">${ev.title}</p>
          <p class="trip-range">${range}</p>
        </div>
      </header>
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
    </article>
  `;
}

function renderLogistics() {
  const container = document.getElementById("logisticsList");
  container.innerHTML = LOGISTICS_SECTIONS.map((section) => {
    const items = EVENTS.filter((ev) => ev.type === section.type);
    if (!items.length) return "";
    return `
      <section class="trip-section">
        <h2 class="trip-section-title">${section.title}</h2>
        ${items.map(logisticsCardHtml).join("")}
      </section>
    `;
  }).join("");
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
    cell.className = "day-cell" + (dayEvents.length ? " has-events" : "");
    cell.dataset.date = key;

    const num = document.createElement("div");
    num.className = "day-num";
    num.textContent = day;
    cell.appendChild(num);

    if (dayEvents.length) {
      const icons = document.createElement("div");
      icons.className = "day-icons";
      const uniqueIcons = [...new Set(dayEvents.map((e) => e.icon))];
      icons.textContent = uniqueIcons.join("");
      cell.appendChild(icons);

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

        const dateControl = item.date
          ? ""
          : `<label class="date-picker">🗓️ <input type="date" data-id="${item.id}" value="${savedDate}" /></label>`;

        card.innerHTML = `
          ${
            item.photo
              ? `<div class="thumb">
                   <img src="${item.photo}" alt="${escapeHtml(item.name)}" loading="lazy" />
                   ${authorWatermark(item)}
                 </div>`
              : ""
          }
          <p class="name">${escapeHtml(item.name)}</p>
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
        if (input) {
          input.addEventListener("change", () => {
            setUserDate(item.id, input.value);
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

  // Klik w plakietkę wraca na ekran startowy, żeby zmienić użytkownika.
  document.getElementById("userBadge").addEventListener("click", () => {
    document.body.classList.remove("app-started");
    document.getElementById("nav").classList.add("hidden");
    switchView("cover");
    renderUserBadge();
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

  renderLoginPanel();
  renderFilterChips();
  renderLogistics();
  renderTimeline();
  renderCalendar();
  renderAttractions();
  renderProgress();
}

document.addEventListener("DOMContentLoaded", init);
