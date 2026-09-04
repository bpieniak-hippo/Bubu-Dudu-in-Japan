// Dane podróży — Japonia, 14 września – 2 października 2026
// Źródło: plan-japonia.md

const TRIP = {
  title: "Bubu & Dudu zwiedzają Japonię",
  subtitle: "14 września – 2 października 2026",
  coverImage: "assets/cover.jpg",
  startDate: "2026-09-14",
  endDate: "2026-10-02",
};

// Wydarzenia z konkretną datą (lub zakresem dat) — trafiają na kalendarz.
// type: flight | train | hotel | car | ticket | attraction | sumo
const EVENTS = [
  // Loty
  {
    date: "2026-09-14",
    type: "flight",
    icon: "✈️",
    title: "Lot: Warszawa → Tokyo Narita",
    details: "LOT · przylot 06:35",
  },
  {
    date: "2026-09-25",
    type: "flight",
    icon: "✈️",
    title: "Lot: Haneda → Naha",
    details: "ANA · wylot 13:05, przylot 15:40",
  },
  {
    date: "2026-09-30",
    type: "flight",
    icon: "✈️",
    title: "Lot: Naha → Haneda",
    details: "ANA · wylot 16:35, przylot 19:15",
  },
  {
    date: "2026-10-02",
    type: "flight",
    icon: "✈️",
    title: "Lot: Tokyo Narita → Warszawa",
    details: "LOT · wylot 12:00 · Terminal 1",
  },

  // Shinkansen
  {
    date: "2026-09-14",
    type: "train",
    icon: "🚄",
    title: "Shinkansen: Tokyo → Kyoto",
    details: "Nozomi 371 · 11:09 → 13:21",
  },
  {
    date: "2026-09-19",
    type: "train",
    icon: "🚄",
    title: "Shinkansen: Kyoto → Tokyo",
    details: "Nozomi 426 · 15:06 → 17:21",
  },

  // Hotele (zakresy)
  {
    startDate: "2026-09-14",
    endDate: "2026-09-19",
    type: "hotel",
    icon: "🏨",
    city: "Kioto",
    title: "Nocleg: Kioto",
    details: "Stay Sakura Kyoto Matsuri — pralnia samoobsługowa (monety), kuchenka",
    link: "https://www.booking.com/hotel/jp/stay-sakura-kyoto-matsuri.pl.html",
  },
  {
    startDate: "2026-09-19",
    endDate: "2026-09-25",
    type: "hotel",
    icon: "🏨",
    city: "Tokio",
    title: "Nocleg: Tokio (1)",
    details: "Stay Sakura Tokyo Asakusa Yokozuna — pralnia samoobsługowa",
    link: "https://www.booking.com/hotel/jp/stay-sakura-tokyo-asakusa-yokozuna.pl.html",
  },
  {
    startDate: "2026-09-25",
    endDate: "2026-09-30",
    type: "hotel",
    icon: "🏨",
    city: "Okinawa",
    title: "Nocleg: Okinawa",
    details: "Aquasense Amp Resort",
    link: "https://www.booking.com/hotel/jp/aquasense-amp-resort.pl.html",
  },
  {
    startDate: "2026-09-30",
    endDate: "2026-10-02",
    type: "hotel",
    icon: "🏨",
    city: "Tokio",
    title: "Nocleg: Tokio (2)",
    details: "Stay Sakura Tokyo Edo no Mai — pralnia samoobsługowa",
    link: "https://www.booking.com/hotel/jp/stay-sakura-tokyo-edo-no-mai.pl.html",
  },

  // Wynajem auta
  {
    startDate: "2026-09-25",
    endDate: "2026-09-30",
    type: "car",
    icon: "🚗",
    title: "Wynajem auta: Okinawa",
    details: "Toyota Rent-a-Lease, Naha Airport · rezerwacja 99915703500 · CDW+NOC wliczone",
  },

  // Bilety
  {
    date: "2026-09-21",
    type: "ticket",
    icon: "🎟️",
    title: "Muzeum Ghibli",
    details: "Godz. 12:00 · ✅ kupione",
    attractionId: "tokyo1-ghibli",
  },

  // Atrakcje z konkretną datą
  {
    date: "2026-09-15",
    type: "attraction",
    icon: "📍",
    title: "Las bambusowy Arashiyama (Sagano Bamboo Forest)",
    details: "50–60 min od hotelu, być najlepiej na 8:00, bez rezerwacji",
    attractionId: "kioto-arashiyama",
  },
  {
    date: "2026-10-01",
    type: "attraction",
    icon: "📍",
    title: "Tower Records Shibuya",
    details: "Zakupy muzyczne",
    attractionId: "tokyo2-tower-records",
  },

  // Sumo — zakres turnieju
  {
    startDate: "2026-09-13",
    endDate: "2026-09-27",
    type: "sumo",
    icon: "🥋",
    title: "Aki Basho (turniej sumo)",
    details: "Ryogoku Kokugikan · ⚠️ bilety jeszcze nie kupione — pilne",
    attractionId: "tokyo-opt-sumo-aki-basho",
  },
];

// Atrakcje pogrupowane wg miasta/pobytu i kategorii — zakładka "Atrakcje"
// id        — unikalny identyfikator (localStorage, nazwa pliku zdjęcia)
// date      — data USTALONA WCZEŚNIEJ (z planu) — jeśli jest, użytkownik jej NIE zmienia
// mapQuery  — fraza do wyszukania lokalizacji w Google Maps
// photo     — ścieżka do lokalnego zdjęcia (assets/attractions/<id>.jpg)
const ATTRACTIONS = [
  {
    city: "Kioto",
    dates: "14–19 września",
    groups: [
      {
        category: "Jedzenie",
        items: [
          {
            id: "kioto-ramen-rennosuke",
            name: "Ramen w Noodle Shop Rennosuke",
            link: "https://guide.michelin.com/pl/en/kyoto-region/kyoto/restaurant/noodle-shop-rennosuke",
            mapQuery: "Noodle Shop Rennosuke, Kyoto",
            photo: "assets/attractions/kioto-ramen-rennosuke.jpg",
          },
          {
            id: "kioto-yakiniku-gyurakutei",
            name: "Kyoto Yakiniku Gyurakutei (wagyu)",
            link: "https://www.tablecheck.com/en/gyurakutei",
            mapQuery: "Gyurakutei Yakiniku, Kyoto",
            photo: "assets/attractions/kioto-yakiniku-gyurakutei.jpg",
          },
          {
            id: "kioto-nishiki-market",
            name: "Nishiki Market",
            mapQuery: "Nishiki Market, Kyoto",
            photo: "assets/attractions/kioto-nishiki-market.jpg",
          },
        ],
      },
      {
        category: "Atrakcje",
        items: [
          {
            id: "kioto-nara-deer",
            name: "Nara — jelenie",
            mapQuery: "Nara Park, Nara",
            photo: "assets/attractions/kioto-nara-deer.jpg",
          },
          {
            id: "kioto-gion",
            name: "Dzielnica Gion",
            mapQuery: "Gion, Kyoto",
            photo: "assets/attractions/kioto-gion.jpg",
          },
          {
            id: "kioto-kiyomizu-dera",
            name: "Kiyomizu-dera, Ninenzaka i Sannenzaka",
            mapQuery: "Kiyomizu-dera, Kyoto",
            photo: "assets/attractions/kioto-kiyomizu-dera.jpg",
          },
          {
            id: "kioto-fushimi-inari",
            name: "Fushimi Inari Taisha",
            mapQuery: "Fushimi Inari Taisha, Kyoto",
            photo: "assets/attractions/kioto-fushimi-inari.jpg",
          },
          {
            id: "kioto-samurai-museum",
            name: "Muzeum Samurajów i Ninja",
            link: "https://mai-ko.com/tour/samurai-experience-kyoto-samurai-museum-tour-and-armor-trial/",
            mapQuery: "Samurai and Ninja Museum Kyoto",
            photo: "assets/attractions/kioto-samurai-museum.jpg",
          },
          {
            id: "kioto-tea-ceremony",
            name: "Ceremonia picia herbaty",
            link: "https://mai-ko.com/tour/samurai-experience-and-tea-ceremony-experience/",
            mapQuery: "Maikoya Kyoto Tea Ceremony",
            photo: "assets/attractions/kioto-tea-ceremony.jpg",
          },
          {
            id: "kioto-arashiyama",
            name: "Las bambusowy Arashiyama (Sagano Bamboo Forest)",
            date: "15 września",
            note: "być na 8:00, bez rezerwacji",
            mapQuery: "Arashiyama Bamboo Grove, Kyoto",
            photo: "assets/attractions/kioto-arashiyama.jpg",
          },
          {
            id: "kioto-amanohashidate",
            name: "Amanohashidate, Ine Funaya i zatoka Ine",
            note: "wycieczka 10h (GetYourGuide), bez rezerwacji",
            mapQuery: "Amanohashidate, Kyoto Prefecture",
            photo: "assets/attractions/kioto-amanohashidate.jpg",
          },
        ],
      },
      {
        category: "Opcjonalne wycieczki",
        items: [
          {
            id: "kioto-kifune-kurama",
            name: "Kifune/Kurama — trekking górski + świątynia",
            mapQuery: "Kurama-dera, Kyoto",
            photo: "assets/attractions/kioto-kifune-kurama.jpg",
          },
        ],
      },
    ],
  },
  {
    city: "Tokio (1. pobyt)",
    dates: "19–25 września",
    groups: [
      {
        category: "Atrakcje",
        items: [
          {
            id: "tokyo1-kamakura",
            name: "Kamakura — całodniowa wycieczka",
            mapQuery: "Kamakura, Kanagawa",
            photo: "assets/attractions/tokyo1-kamakura.jpg",
          },
          {
            id: "tokyo1-enoshima",
            name: "Enoshima — Dzwon Miłości (Ryuren no Kane)",
            note: "połączyć z Kamakurą, ta sama linia Enoden",
            mapQuery: "Enoshima, Kanagawa",
            photo: "assets/attractions/tokyo1-enoshima.jpg",
          },
          {
            id: "tokyo1-ghibli",
            name: "Muzeum Ghibli",
            date: "21 września, 12:00",
            note: "✅ kupione",
            mapQuery: "Ghibli Museum, Mitaka",
            photo: "assets/attractions/tokyo1-ghibli.jpg",
          },
        ],
      },
    ],
  },
  {
    city: "Okinawa",
    dates: "25–30 września",
    groups: [
      {
        category: "Logistyka",
        items: [
          {
            id: "okinawa-car-rental",
            name: "Wynajem auta — Toyota Rent-a-Lease, Naha Airport",
            note: "rezerwacja 99915703500, CDW+NOC wliczone",
            mapQuery: "Naha Airport, Okinawa",
            photo: "assets/attractions/okinawa-car-rental.jpg",
          },
        ],
      },
    ],
  },
  {
    city: "Tokio (2. pobyt)",
    dates: "30 września – 2 października",
    groups: [
      {
        category: "Atrakcje",
        items: [
          {
            id: "tokyo2-tower-records",
            name: "Tower Records Shibuya",
            date: "1 października",
            mapQuery: "Tower Records Shibuya, Tokyo",
            photo: "assets/attractions/tokyo2-tower-records.jpg",
          },
        ],
      },
      {
        category: "Zakupy",
        items: [
          {
            id: "tokyo2-dragon-ball-store",
            name: "Dragon Ball Store — Tokyo Station, Character Street",
            mapQuery: "Tokyo Character Street, Tokyo Station",
            photo: "assets/attractions/tokyo2-dragon-ball-store.jpg",
          },
        ],
      },
    ],
  },
  {
    city: "Tokio — opcjonalne",
    dates: "cały pobyt",
    groups: [
      {
        category: "Opcjonalne atrakcje",
        items: [
          {
            id: "tokyo-opt-minakami",
            name: "Minakami — onsen",
            mapQuery: "Minakami, Gunma",
            photo: "assets/attractions/tokyo-opt-minakami.jpg",
          },
          {
            id: "tokyo-opt-fuji-kawaguchiko",
            name: "Góra Fuji / Kawaguchiko",
            mapQuery: "Lake Kawaguchi, Yamanashi",
            photo: "assets/attractions/tokyo-opt-fuji-kawaguchiko.jpg",
          },
          {
            id: "tokyo-opt-kawagoe",
            name: "Kawagoe — „Małe Edo”",
            mapQuery: "Kawagoe, Saitama",
            photo: "assets/attractions/tokyo-opt-kawagoe.jpg",
          },
          {
            id: "tokyo-opt-sumo-aki-basho",
            name: "Sumo — Aki Basho",
            date: "13–27 września, Ryogoku Kokugikan",
            note: "⚠️ bilety jeszcze nie kupione",
            mapQuery: "Ryogoku Kokugikan, Tokyo",
            photo: "assets/attractions/tokyo-opt-sumo-aki-basho.jpg",
          },
          {
            id: "tokyo-opt-sumo-training",
            name: "Trening sumo (Arashio Stable)",
            note: "za darmo, 6:00–9:00 w dni robocze",
            mapQuery: "Arashio Stable, Tokyo",
            photo: "assets/attractions/tokyo-opt-sumo-training.jpg",
          },
        ],
      },
    ],
  },
];
