// Dane podróży — Japonia, 14 września – 2 października 2026
// Źródło: plan-japonia.md

const TRIP = {
  title: "Bubu & Dudu zwiedzają Japonię",
  subtitle: "14 września – 2 października 2026",
  coverImage: "assets/cover.jpg",
  startDate: "2026-09-14",
  endDate: "2026-10-02",
};

// Użytkownicy aplikacji — logowanie samą nazwą, bez hasła.
const USERS = [
  { id: "bartek", name: "Bartek", avatar: "assets/avatars/bartek.jpg" },
  { id: "paula", name: "Paula", avatar: "assets/avatars/paula.jpg" },
];

// Wydarzenia z konkretną datą (lub zakresem dat) — kalendarz, „Dzień po dniu” i zakładka Podróż.
// type: flight | train | hotel | car | ticket | attraction | sumo
// Pola opisowe (opcjonalne): address, mapQuery, checkIn, checkOut, phone, booking,
// site, ref, depart, arrive, extra[] — karta pokazuje tylko te, które są wypełnione.
const EVENTS = [
  // Loty
  {
    date: "2026-09-14",
    type: "flight",
    icon: "✈️",
    title: "Warszawa → Tokyo Narita",
    details: "LOT · przylot 06:35",
    carrier: "LOT",
    arrive: "06:35",
    mapQuery: "Narita International Airport",
    extra: ["Narita → Tokyo Station: Narita Express (rezerwacja jeszcze do zrobienia)"],
  },
  {
    date: "2026-09-25",
    type: "flight",
    icon: "✈️",
    title: "Haneda → Naha",
    details: "ANA · 13:05 → 15:40",
    carrier: "ANA",
    depart: "13:05",
    arrive: "15:40",
    mapQuery: "Naha Airport, Okinawa",
  },
  {
    date: "2026-09-30",
    type: "flight",
    icon: "✈️",
    title: "Naha → Haneda",
    details: "ANA · 16:35 → 19:15",
    carrier: "ANA",
    depart: "16:35",
    arrive: "19:15",
    mapQuery: "Haneda Airport, Tokyo",
  },
  {
    date: "2026-10-02",
    type: "flight",
    icon: "✈️",
    title: "Tokyo Narita → Warszawa",
    details: "LOT · wylot 12:00 · Terminal 1",
    carrier: "LOT",
    depart: "12:00",
    mapQuery: "Narita Airport Terminal 1",
    extra: ["Odprawa w Terminalu 1"],
  },

  // Shinkansen
  {
    date: "2026-09-14",
    type: "train",
    icon: "🚄",
    title: "Shinkansen: Tokyo → Kyoto",
    details: "Nozomi 371 · 11:09 → 13:21",
    carrier: "Nozomi 371",
    depart: "11:09",
    arrive: "13:21",
    mapQuery: "Tokyo Station",
    extra: [
      "✅ bilety kupione",
      "Walizki powyżej 160 cm sumy wymiarów wymagają miejsca ze strefą bagażową",
    ],
  },
  {
    date: "2026-09-19",
    type: "train",
    icon: "🚄",
    title: "Shinkansen: Kyoto → Tokyo",
    details: "Nozomi 426 · 15:06 → 17:21",
    carrier: "Nozomi 426",
    depart: "15:06",
    arrive: "17:21",
    mapQuery: "Kyoto Station",
    extra: ["✅ bilety kupione"],
  },

  // Hotele (zakresy)
  {
    startDate: "2026-09-14",
    endDate: "2026-09-19",
    type: "hotel",
    icon: "🏨",
    city: "Kioto",
    title: "Stay SAKURA Kyoto Matsuri",
    details: "Kioto · 5 nocy",
    address: "115 Isematsucho, Shimogyo-ku, Kyoto 600-8254",
    mapQuery: "Stay SAKURA Kyoto Matsuri",
    checkIn: "15:00–21:00",
    checkOut: "11:00",
    phone: "050-2018-7885",
    booking: "https://www.booking.com/hotel/jp/stay-sakura-kyoto-matsuri.pl.html",
    site: "https://en.stay-sakura.com/matsuri",
    extra: ["Pralnia samoobsługowa na monety 100 ¥ (pranie 30–40 min + suszenie 30–40 min)", "Kuchenka w pokoju"],
  },
  {
    startDate: "2026-09-19",
    endDate: "2026-09-25",
    type: "hotel",
    icon: "🏨",
    city: "Tokio",
    title: "Stay SAKURA Tokyo Asakusa Yokozuna",
    details: "Tokio, 1. pobyt · 6 nocy",
    address: "3-30-5 Asakusa, Taito-ku, Tokyo 111-0032",
    mapQuery: "Stay SAKURA Tokyo Asakusa Yokozuna",
    checkIn: "15:00",
    checkOut: "11:00",
    booking: "https://www.booking.com/hotel/jp/stay-sakura-tokyo-asakusa-yokozuna.pl.html",
    extra: [
      "Pralnia samoobsługowa na monety 100 ¥",
      "Ok. 12 min pieszo od stacji Asakusa",
      "Późne wymeldowanie płatne (od 1000 ¥/h), maks. do 13:00",
    ],
  },
  {
    startDate: "2026-09-25",
    endDate: "2026-09-30",
    type: "hotel",
    icon: "🏨",
    city: "Okinawa",
    title: "AQUASENSE Hotel & Resort",
    details: "Okinawa · 5 nocy",
    address: "86-1 Fuchaku Kurosakibaru, Onna-son, Kunigami-gun, Okinawa 904-0413",
    mapQuery: "AQUASENSE Hotel & Resort, Onna",
    checkIn: "16:00",
    checkOut: "11:00",
    booking: "https://www.booking.com/hotel/jp/aquasense-amp-resort.pl.html",
    extra: ["Dojazd autem z lotniska Naha (wynajem na miejscu)"],
  },
  {
    startDate: "2026-09-30",
    endDate: "2026-10-02",
    type: "hotel",
    icon: "🏨",
    city: "Tokio",
    title: "Stay SAKURA Tokyo Asakusa Edo no Mai",
    details: "Tokio, 2. pobyt · 2 noce",
    address: "1-6-3 Senzoku, Taito-ku, Tokyo",
    mapQuery: "Stay SAKURA Tokyo Asakusa Edo no Mai",
    checkIn: "15:00–21:00",
    checkOut: "11:00",
    phone: "050-2018-7882",
    booking: "https://www.booking.com/hotel/jp/stay-sakura-tokyo-edo-no-mai.pl.html",
    site: "https://en.stay-sakura.com/edonomai",
    extra: ["Pralnia samoobsługowa na monety 100 ¥"],
  },

  // Wynajem auta
  {
    startDate: "2026-09-25",
    endDate: "2026-09-30",
    type: "car",
    icon: "🚗",
    title: "Toyota Rent-a-Lease — Okinawa",
    details: "Odbiór i zwrot: Naha Airport",
    address: "Naha Airport, Okinawa",
    mapQuery: "Toyota Rent a Car Naha Airport",
    ref: "99915703500",
    extra: [
      "✅ rezerwacja opłacona",
      "Ubezpieczenie CDW + NOC wliczone w cenę",
      "⚠️ Każdą szkodę, nawet drobną, trzeba zgłosić na policję",
      "Potrzebne międzynarodowe prawo jazdy",
    ],
  },

  // Bilety
  {
    date: "2026-09-21",
    type: "ticket",
    icon: "🎟️",
    title: "Muzeum Ghibli",
    details: "Godz. 12:00 · ✅ kupione",
    address: "1-1-83 Shimorenjaku, Mitaka, Tokyo",
    mapQuery: "Ghibli Museum, Mitaka",
    attractionId: "tokyo1-ghibli",
    extra: ["Wejście tylko o wyznaczonej godzinie — spóźnienie oznacza przepadek biletu"],
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
