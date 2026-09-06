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
    title: "Warszawa Chopina → Tokyo Narita",
    details: "LOT · przylot 06:35",
    carrier: "LOT",
    arrive: "06:35",
    from: "Lotnisko Chopina, Warszawa (WAW)",
    fromMap: "Lotnisko Chopina w Warszawie",
    to: "Tokyo Narita (NRT)",
    toMap: "Narita International Airport",
    photo: "assets/logistics/narita.jpg",
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
    from: "Tokyo Haneda (HND)",
    fromMap: "Haneda Airport, Tokyo",
    to: "Naha, Okinawa (OKA)",
    toMap: "Naha Airport, Okinawa",
    photo: "assets/logistics/naha-airport.jpg",
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
    from: "Naha, Okinawa (OKA)",
    fromMap: "Naha Airport, Okinawa",
    to: "Tokyo Haneda (HND)",
    toMap: "Haneda Airport, Tokyo",
    photo: "assets/logistics/haneda.jpg",
  },
  {
    date: "2026-10-02",
    type: "flight",
    icon: "✈️",
    title: "Tokyo Narita → Warszawa Chopina",
    details: "LOT · wylot 12:00 · Terminal 1",
    carrier: "LOT",
    depart: "12:00",
    from: "Tokyo Narita (NRT), Terminal 1",
    fromMap: "Narita Airport Terminal 1",
    to: "Lotnisko Chopina, Warszawa (WAW)",
    toMap: "Lotnisko Chopina w Warszawie",
    photo: "assets/logistics/warszawa-chopina.jpg",
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
    from: "Tokyo Station",
    fromMap: "Tokyo Station",
    to: "Kyoto Station",
    toMap: "Kyoto Station",
    photo: "assets/logistics/kyoto-station.jpg",
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
    from: "Kyoto Station",
    fromMap: "Kyoto Station",
    to: "Tokyo Station",
    toMap: "Tokyo Station",
    photo: "assets/logistics/tokyo-station.jpg",
    extra: ["✅ bilety kupione"],
  },

  // Hotele (zakresy)
  {
    startDate: "2026-09-14",
    endDate: "2026-09-19",
    type: "hotel",
    icon: "🏨",
    city: "Kioto",
    lat: 34.9875,
    lon: 135.7514,
    title: "Stay SAKURA Kyoto Matsuri",
    details: "Kioto · 5 nocy",
    address: "115 Isematsucho, Shimogyo-ku, Kyoto 600-8254",
    mapQuery: "Stay SAKURA Kyoto Matsuri",
    checkIn: "15:00–21:00",
    checkOut: "11:00",
    phone: "050-2018-7885",
    booking: "https://www.booking.com/hotel/jp/stay-sakura-kyoto-matsuri.pl.html",
    site: "https://en.stay-sakura.com/matsuri",
    photo: "assets/logistics/kyoto-city.jpg",
    extra: ["Pralnia samoobsługowa na monety 100 ¥ (pranie 30–40 min + suszenie 30–40 min)", "Kuchenka w pokoju"],
  },
  {
    startDate: "2026-09-19",
    endDate: "2026-09-25",
    type: "hotel",
    icon: "🏨",
    city: "Tokio",
    lat: 35.7176,
    lon: 139.7976,
    title: "Stay SAKURA Tokyo Asakusa Yokozuna",
    details: "Tokio, 1. pobyt · 6 nocy",
    address: "3-30-5 Asakusa, Taito-ku, Tokyo 111-0032",
    mapQuery: "Stay SAKURA Tokyo Asakusa Yokozuna",
    checkIn: "15:00",
    checkOut: "11:00",
    booking: "https://www.booking.com/hotel/jp/stay-sakura-tokyo-asakusa-yokozuna.pl.html",
    photo: "assets/logistics/asakusa.jpg",
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
    lat: 26.4543,
    lon: 127.8093,
    title: "AQUASENSE Hotel & Resort",
    details: "Okinawa · 5 nocy",
    address: "86-1 Fuchaku Kurosakibaru, Onna-son, Kunigami-gun, Okinawa 904-0413",
    mapQuery: "AQUASENSE Hotel & Resort, Onna",
    checkIn: "16:00",
    checkOut: "11:00",
    booking: "https://www.booking.com/hotel/jp/aquasense-amp-resort.pl.html",
    photo: "assets/logistics/okinawa-onna.jpg",
    extra: ["Dojazd autem z lotniska Naha (wynajem na miejscu)"],
  },
  {
    startDate: "2026-09-30",
    endDate: "2026-10-02",
    type: "hotel",
    icon: "🏨",
    city: "Tokio",
    lat: 35.7219,
    lon: 139.7907,
    title: "Stay SAKURA Tokyo Asakusa Edo no Mai",
    details: "Tokio, 2. pobyt · 2 noce",
    address: "1-6-3 Senzoku, Taito-ku, Tokyo",
    mapQuery: "Stay SAKURA Tokyo Asakusa Edo no Mai",
    checkIn: "15:00–21:00",
    checkOut: "11:00",
    phone: "050-2018-7882",
    booking: "https://www.booking.com/hotel/jp/stay-sakura-tokyo-edo-no-mai.pl.html",
    site: "https://en.stay-sakura.com/edonomai",
    photo: "assets/logistics/asakusa.jpg",
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
    photo: "assets/logistics/naha-airport.jpg",
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
    photo: "assets/attractions/tokyo1-ghibli.jpg",
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

// Opisy pokazywane po kliknięciu w kartę atrakcji.
// desc — czym to jest, tips — praktyczne wskazówki.
const ATTRACTION_DETAILS = {
  "tokyo-sushi-biyori": {
    desc: "Kameralne sushi w stylu edomae w Zachodnim Shinjuku — omakase z 18 pozycji podawane przez szefa przy ladzie, do tego karta z ponad 15 rodzajami sake. Ok. 300 m od stacji Shinjuku (Tabata Bldg. 5F, 1-12-9 Nishishinjuku).",
    tips: [
      "⚠️ Tylko na rezerwację — dwie tury wieczorem: 17:30 i 20:00",
      "Rezerwacja przez TableCheck, najlepiej z wyprzedzeniem",
      "Omakase ok. 12 500 ¥ od osoby (widełki 10–15 tys. ¥)",
      "Menu układa szef — nie ma wyboru, jest sezon",
    ],
  },
  "kioto-ramen-rennosuke": {
    desc: "Niewielka ramenowa wyróżniona w przewodniku Michelin w kategorii dobrych i niedrogich adresów.",
    tips: [
      "Lokal jest mały — licz się z kolejką",
      "Najspokojniej zaraz po otwarciu",
      "Płatność często wyłącznie gotówką",
    ],
  },
  "kioto-yakiniku-gyurakutei": {
    desc: "Yakiniku, czyli wołowina wagyu grillowana samodzielnie nad żarem przy stoliku.",
    tips: [
      "Rezerwacja przez TableCheck praktycznie obowiązkowa",
      "Wagyu podaje się w małych porcjach — lepiej dozamawiać niż zamówić wszystko naraz",
      "Zapach dymu zostaje na ubraniu",
    ],
  },
  "kioto-nishiki-market": {
    desc: "Kryta uliczka handlowa w centrum Kioto, nazywana kuchnią miasta. Ponad sto stoisk z przekąskami, piklami, słodyczami i nożami.",
    tips: [
      "Najlepiej rano — po południu robi się bardzo tłoczno",
      "Jedzenie zjada się przy stoisku, chodzenie z jedzeniem jest źle widziane",
      "Warto mieć gotówkę",
    ],
  },
  "kioto-nara-deer": {
    desc: "Park w Narze, po którym swobodnie chodzą setki oswojonych jeleni sika. Obok świątynia Todai-ji z monumentalnym posągiem Buddy.",
    tips: [
      "Wafle shika-senbei kupisz u handlarzy w parku",
      "Jelenie bywają natarczywe — mapy i jedzenie schowaj do plecaka",
      "Z Kioto około 45 minut pociągiem",
    ],
  },
  "kioto-gion": {
    desc: "Historyczna dzielnica gejsz: drewniane kamieniczki machiya, herbaciarnie i reprezentacyjna uliczka Hanamikoji.",
    tips: [
      "Najładniej o zmierzchu, gdy zapalają się lampiony",
      "Na części uliczek obowiązuje zakaz fotografowania — są tabliczki",
      "Nie zaczepiaj i nie zatrzymuj maiko idących do pracy",
    ],
  },
  "kioto-kiyomizu-dera": {
    desc: "Świątynia na zboczu wzgórza z drewnianym tarasem zawieszonym nad doliną, wpisana na listę UNESCO. Prowadzą do niej zabytkowe uliczki Ninenzaka i Sannenzaka.",
    tips: [
      "Wstęp na teren świątyni jest płatny",
      "Otwierają wcześnie rano — wtedy jest najspokojniej",
      "Uliczki dojściowe są strome i śliskie w deszczu",
    ],
  },
  "kioto-fushimi-inari": {
    desc: "Sanktuarium boga Inari z tysiącami czerwonych bram torii, które tworzą tunel wspinający się na górę Inari.",
    tips: [
      "Wstęp wolny, teren dostępny całą dobę",
      "Pełna pętla na szczyt to 2–3 godziny marszu",
      "Przed ósmą rano albo po zmroku bramy są niemal puste",
    ],
  },
  "kioto-samurai-museum": {
    desc: "Kolekcja zbroi i mieczy z pokazem, przymierzaniem zbroi i krótką lekcją posługiwania się kataną.",
    tips: [
      "Wejścia w blokach godzinowych — rezerwuj z wyprzedzeniem",
      "Oprowadzanie po angielsku",
      "Ten sam organizator prowadzi ceremonię herbaty — da się połączyć",
    ],
  },
  "kioto-tea-ceremony": {
    desc: "Klasyczna ceremonia parzenia matchy prowadzona po angielsku, z wyjaśnieniem każdego gestu. Opcjonalnie w wypożyczonym kimonie.",
    tips: [
      "Rezerwacja z wyprzedzeniem",
      "Siedzi się na tatami — przyda się wygodne ubranie",
      "Całość trwa zwykle około godziny",
    ],
  },
  "kioto-arashiyama": {
    desc: "Ścieżka wśród wysokich bambusów w dzielnicy Arashiyama. W pobliżu most Togetsukyo i park małp Iwatayama.",
    tips: [
      "Być na miejscu około 8:00 — później ścieżka jest zatłoczona",
      "Wstęp wolny, bez rezerwacji",
      "Z hotelu 50–60 minut",
    ],
  },
  "kioto-amanohashidate": {
    desc: "Piaszczysta mierzeja porośnięta sosnami, zaliczana do trzech najpiękniejszych widoków Japonii, oraz wioska Ine z domami funaya stojącymi nad samą wodą.",
    tips: [
      "Całodniowa wycieczka, około 10 godzin",
      "Widok tradycyjnie ogląda się schylony, tyłem — stąd nazwa mostu do nieba",
      "Rezerwacja niekonieczna",
    ],
  },
  "kioto-kifune-kurama": {
    desc: "Trekking przez górę Kurama: od świątyni Kurama-dera leśną ścieżką do sanktuarium Kifune nad strumieniem.",
    tips: [
      "Przejście zajmuje 2–3 godziny, po drodze schody i korzenie",
      "Wygodne buty obowiązkowe",
      "Latem nad rzeką serwują posiłki na platformach kawadoko",
    ],
  },
  "tokyo1-kamakura": {
    desc: "Nadmorskie miasteczko, dawna stolica siogunatu. Wielki Budda w Kotoku-in, świątynia Hase-dera i szlaki spacerowe po wzgórzach.",
    tips: [
      "Z Tokio około godziny koleją",
      "Da się połączyć z Enoshimą lokalną linią Enoden",
      "Na sensowne zwiedzanie trzeba cały dzień",
    ],
  },
  "tokyo1-enoshima": {
    desc: "Wyspa połączona mostem z lądem: jaskinie, latarnia widokowa i Dzwon Miłości, przy którym pary zostawiają kłódki.",
    tips: [
      "Ta sama linia Enoden co Kamakura",
      "Na wyspie dużo schodów — są płatne ruchome schody pod górę",
      "Przy dobrej pogodzie widać Fudżi",
    ],
  },
  "tokyo1-ghibli": {
    desc: "Muzeum Studia Ghibli w Mitace: makiety pracowni animatora, krótkometrażowy film pokazywany wyłącznie tutaj i Kot Autobus.",
    tips: [
      "Wejście tylko o godzinie wydrukowanej na bilecie",
      "W środku obowiązuje zakaz fotografowania",
      "Bilety macie kupione — 21 września, 12:00",
    ],
  },
  "tokyo2-tower-records": {
    desc: "Wielopiętrowy sklep muzyczny w Shibuyi, jeden z największych na świecie, z kawiarnią i przestrzenią na koncerty.",
    tips: [
      "Japońskie wydania płyt mają często bonusowe utwory",
      "Na górnych piętrach kawiarnia i wydarzenia z artystami",
      "Kilka minut pieszo od słynnego skrzyżowania Shibuya",
    ],
  },
  "tokyo2-dragon-ball-store": {
    desc: "Firmowy sklep Dragon Balla na Tokyo Character Street, w podziemiach Tokyo Station — obok sklepy Ghibli, Pokemon i innych marek.",
    tips: [
      "Wejście od strony Yaesu",
      "Cała uliczka to kilkanaście sklepów z gadżetami",
      "W weekendy potrafi być bardzo ciasno",
    ],
  },
  "tokyo-opt-minakami": {
    desc: "Górski kurort z gorącymi źródłami w prefekturze Gunma, znany też ze spływów po rzece Tone.",
    tips: [
      "Około 1,5 godziny shinkansenem z Tokio",
      "W wielu onsenach tatuaże nadal bywają problemem — warto sprawdzić wcześniej",
      "Do wody wchodzi się bez stroju, po umyciu się pod prysznicem",
    ],
  },
  "tokyo-opt-fuji-kawaguchiko": {
    desc: "Jezioro u stóp Fudżi z najbardziej rozpoznawalnym widokiem na wulkan, tarasem widokowym nad miastem i pagodą Chureito w okolicy.",
    tips: [
      "Fudżi chowa się w chmurach — największe szanse rano",
      "Autobus z Shinjuku jedzie około 2 godzin",
      "Warto sprawdzić prognozę dzień wcześniej",
    ],
  },
  "tokyo-opt-kawagoe": {
    desc: "Miasteczko nazywane Małym Edo: ulica kupieckich składów kurazukuri, drewniana dzwonnica Toki no Kane i uliczka słodyczy.",
    tips: [
      "30–40 minut pociągiem z Ikebukuro",
      "Wszystko do obejścia pieszo w pół dnia",
      "Lokalna specjalność to bataty w każdej postaci",
    ],
  },
  "tokyo-opt-sumo-aki-basho": {
    desc: "Wrześniowy turniej sumo w hali Ryogoku Kokugikan. Piętnaście dni walk, z najważniejszymi pojedynkami późnym popołudniem.",
    tips: [
      "⚠️ Biletów jeszcze nie macie — to najpilniejsza rzecz na liście",
      "Tańsze miejsca są na balkonie, drogie loże masu tuż przy ringu",
      "Bilet obowiązuje na cały dzień — można przyjść wcześniej i wejść taniej na wyższe piętro",
    ],
  },
  "tokyo-opt-sumo-training": {
    desc: "Poranny trening zapaśników w stajni Arashio, oglądany przez okno od strony ulicy — bez biletu i bez rezerwacji.",
    tips: [
      "Dni robocze, mniej więcej 6:00–9:00",
      "Ogląda się z chodnika przez szybę, w ciszy",
      "Treningów nie ma w trakcie turniejów",
    ],
  },
};

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
            lat: 35.0337,
            lon: 135.7392,
            name: "Ramen w Noodle Shop Rennosuke",
            link: "https://guide.michelin.com/pl/en/kyoto-region/kyoto/restaurant/noodle-shop-rennosuke",
            mapQuery: "Noodle Shop Rennosuke, Kyoto",
            photo: "assets/attractions/kioto-ramen-rennosuke.jpg",
            author: "bartek",
          },
          {
            id: "kioto-yakiniku-gyurakutei",
            lat: 35.0038,
            lon: 135.7568,
            name: "Kyoto Yakiniku Gyurakutei (wagyu)",
            link: "https://www.tablecheck.com/en/gyurakutei",
            mapQuery: "Gyurakutei Yakiniku, Kyoto",
            photo: "assets/attractions/kioto-yakiniku-gyurakutei.jpg",
            author: "bartek",
          },
          {
            id: "kioto-nishiki-market",
            lat: 35.005,
            lon: 135.7656,
            name: "Nishiki Market",
            mapQuery: "Nishiki Market, Kyoto",
            photo: "assets/attractions/kioto-nishiki-market.jpg",
            author: "bartek",
          },
        ],
      },
      {
        category: "Atrakcje",
        items: [
          {
            id: "kioto-nara-deer",
            lat: 34.6829,
            lon: 135.8546,
            name: "Nara — jelenie",
            mapQuery: "Nara Park, Nara",
            photo: "assets/attractions/kioto-nara-deer.jpg",
            author: "bartek",
          },
          {
            id: "kioto-gion",
            lat: 35.0047,
            lon: 135.7784,
            name: "Dzielnica Gion",
            mapQuery: "Gion, Kyoto",
            photo: "assets/attractions/kioto-gion.jpg",
            author: "bartek",
          },
          {
            id: "kioto-kiyomizu-dera",
            lat: 34.9943,
            lon: 135.7844,
            name: "Kiyomizu-dera, Ninenzaka i Sannenzaka",
            mapQuery: "Kiyomizu-dera, Kyoto",
            photo: "assets/attractions/kioto-kiyomizu-dera.jpg",
            author: "bartek",
          },
          {
            id: "kioto-fushimi-inari",
            lat: 34.9675,
            lon: 135.7797,
            name: "Fushimi Inari Taisha",
            mapQuery: "Fushimi Inari Taisha, Kyoto",
            photo: "assets/attractions/kioto-fushimi-inari.jpg",
            author: "bartek",
          },
          {
            id: "kioto-samurai-museum",
            lat: 35.0103,
            lon: 135.7687,
            name: "Muzeum Samurajów i Ninja",
            link: "https://mai-ko.com/tour/samurai-experience-kyoto-samurai-museum-tour-and-armor-trial/",
            mapQuery: "Samurai and Ninja Museum Kyoto",
            photo: "assets/attractions/kioto-samurai-museum.jpg",
            author: "bartek",
          },
          {
            id: "kioto-tea-ceremony",
            lat: 35.0015,
            lon: 135.7575,
            name: "Ceremonia picia herbaty",
            link: "https://mai-ko.com/tour/samurai-experience-and-tea-ceremony-experience/",
            mapQuery: "Maikoya Kyoto Tea Ceremony",
            photo: "assets/attractions/kioto-tea-ceremony.jpg",
            author: "paula",
          },
          {
            id: "kioto-arashiyama",
            lat: 35.0167,
            lon: 135.6711,
            name: "Las bambusowy Arashiyama (Sagano Bamboo Forest)",
            date: "15 września",
            note: "być na 8:00, bez rezerwacji",
            mapQuery: "Arashiyama Bamboo Grove, Kyoto",
            photo: "assets/attractions/kioto-arashiyama.jpg",
            author: "paula",
          },
          {
            id: "kioto-amanohashidate",
            lat: 35.568,
            lon: 135.1906,
            name: "Amanohashidate, Ine Funaya i zatoka Ine",
            note: "wycieczka 10h (GetYourGuide), bez rezerwacji",
            mapQuery: "Amanohashidate, Kyoto Prefecture",
            photo: "assets/attractions/kioto-amanohashidate.jpg",
            author: "bartek",
          },
        ],
      },
      {
        category: "Opcjonalne wycieczki",
        items: [
          {
            id: "kioto-kifune-kurama",
            lat: 35.1179,
            lon: 135.7707,
            name: "Kifune/Kurama — trekking górski + świątynia",
            mapQuery: "Kurama-dera, Kyoto",
            photo: "assets/attractions/kioto-kifune-kurama.jpg",
            author: "bartek",
          },
        ],
      },
    ],
  },
  {
    city: "Tokio",
    dates: "19–25 września i 30 września – 2 października",
    groups: [
      {
        category: "Jedzenie",
        items: [
          {
            id: "tokyo-sushi-biyori",
            lat: 35.6904,
            lon: 139.6979,
            name: "Sushi Biyori (omakase, Shinjuku)",
            note: "⚠️ tylko na rezerwację — dwie tury: 17:30 i 20:00",
            link: "https://www.tablecheck.com/en/sushibiyori",
            mapQuery: "Sushi Biyori, Nishi-Shinjuku, Tokyo",
            photo: "assets/attractions/tokyo-sushi-biyori.jpg",
            author: "paula",
          },
        ],
      },
      {
        category: "Atrakcje",
        items: [
          {
            id: "tokyo1-kamakura",
            lat: 35.3193,
            lon: 139.547,
            name: "Kamakura — całodniowa wycieczka",
            mapQuery: "Kamakura, Kanagawa",
            photo: "assets/attractions/tokyo1-kamakura.jpg",
            author: "paula",
          },
          {
            id: "tokyo1-enoshima",
            lat: 35.3001,
            lon: 139.4806,
            name: "Enoshima — Dzwon Miłości (Ryuren no Kane)",
            note: "połączyć z Kamakurą, ta sama linia Enoden",
            mapQuery: "Enoshima, Kanagawa",
            photo: "assets/attractions/tokyo1-enoshima.jpg",
            author: "paula",
          },
          {
            id: "tokyo1-ghibli",
            lat: 35.6962,
            lon: 139.5706,
            name: "Muzeum Ghibli",
            date: "21 września, 12:00",
            note: "✅ kupione",
            mapQuery: "Ghibli Museum, Mitaka",
            photo: "assets/attractions/tokyo1-ghibli.jpg",
            author: "bartek",
          },
          {
            id: "tokyo2-tower-records",
            lat: 35.6619,
            lon: 139.7011,
            name: "Tower Records Shibuya",
            date: "1 października",
            mapQuery: "Tower Records Shibuya, Tokyo",
            photo: "assets/attractions/tokyo2-tower-records.jpg",
            author: "bartek",
          },
        ],
      },
      {
        category: "Zakupy",
        items: [
          {
            id: "tokyo2-dragon-ball-store",
            lat: 35.6823,
            lon: 139.7685,
            name: "Dragon Ball Store — Tokyo Station, Character Street",
            mapQuery: "Tokyo Character Street, Tokyo Station",
            photo: "assets/attractions/tokyo2-dragon-ball-store.jpg",
            author: "bartek",
          },
        ],
      },
      {
        category: "Opcjonalne wycieczki",
        items: [
          {
            id: "tokyo-opt-minakami",
            lat: 36.6786,
            lon: 138.9992,
            name: "Minakami — onsen",
            mapQuery: "Minakami, Gunma",
            photo: "assets/attractions/tokyo-opt-minakami.jpg",
            author: "paula",
          },
          {
            id: "tokyo-opt-fuji-kawaguchiko",
            lat: 35.5131,
            lon: 138.7448,
            name: "Góra Fuji / Kawaguchiko",
            mapQuery: "Lake Kawaguchi, Yamanashi",
            photo: "assets/attractions/tokyo-opt-fuji-kawaguchiko.jpg",
            author: "bartek",
          },
          {
            id: "tokyo-opt-kawagoe",
            lat: 35.9251,
            lon: 139.4857,
            name: "Kawagoe — „Małe Edo”",
            mapQuery: "Kawagoe, Saitama",
            photo: "assets/attractions/tokyo-opt-kawagoe.jpg",
            author: "bartek",
          },
          {
            id: "tokyo-opt-sumo-aki-basho",
            lat: 35.6969,
            lon: 139.7935,
            name: "Sumo — Aki Basho",
            date: "13–27 września, Ryogoku Kokugikan",
            note: "⚠️ bilety jeszcze nie kupione",
            mapQuery: "Ryogoku Kokugikan, Tokyo",
            photo: "assets/attractions/tokyo-opt-sumo-aki-basho.jpg",
            author: "bartek",
          },
          {
            id: "tokyo-opt-sumo-training",
            lat: 35.6868,
            lon: 139.7884,
            name: "Trening sumo (Arashio Stable)",
            note: "za darmo, 6:00–9:00 w dni robocze",
            mapQuery: "Arashio Stable, Tokyo",
            photo: "assets/attractions/tokyo-opt-sumo-training.jpg",
            author: "bartek",
          },
        ],
      },
    ],
  },
];

// Checklista pakowania. Grupy `shared: true` to jedna wspólna lista dla obojga
// (jeden zestaw rzeczy na dwie osoby), reszta jest osobna — Bartek i Paula
// odhaczają u siebie, bo każde pakuje własną walizkę.
const PACKING = [
  {
    group: "📄 Dokumenty",
    items: [
      { id: "passport", label: "Paszport", note: "ważny min. 6 miesięcy po powrocie" },
      { id: "idp", label: "Międzynarodowe prawo jazdy", note: "wymagane do auta na Okinawie" },
      { id: "driving-licence", label: "Krajowe prawo jazdy", note: "bez niego międzynarodowe jest nieważne" },
      { id: "insurance", label: "Ubezpieczenie podróżne" },
      { id: "boarding", label: "Karty pokładowe i rezerwacje" },
      { id: "cards", label: "Karty płatnicze" },
      { id: "visit-japan", label: "Visit Japan Web — kody QR" },
    ],
  },
  {
    group: "🔌 Elektronika",
    items: [
      { id: "phone", label: "Telefon i ładowarka" },
      { id: "powerbank", label: "Powerbank", note: "tylko w bagażu podręcznym" },
      { id: "cables", label: "Kable i ładowarka USB-C" },
      { id: "headphones", label: "Słuchawki" },
      { id: "camera", label: "Aparat i karta pamięci" },
    ],
  },
  {
    group: "👕 Ubrania",
    items: [
      { id: "light", label: "Lekkie ubrania", note: "wrzesień w Japonii to 28° i wilgoć" },
      { id: "longsleeve", label: "Coś z długim rękawem", note: "klimatyzacja i świątynie" },
      { id: "hoodie", label: "Bluza", note: "wieczory w Minakami są chłodne" },
      { id: "shoes", label: "Wygodne buty na cały dzień" },
      { id: "socks", label: "Skarpetki bez dziur", note: "buty zdejmuje się w świątyniach" },
      { id: "swim", label: "Strój kąpielowy", note: "Okinawa" },
      { id: "rain", label: "Peleryna albo mała parasolka", note: "wrzesień to jeszcze sezon tajfunowy" },
    ],
  },
  {
    group: "🧴 Kosmetyki i leki",
    items: [
      { id: "cosmetics", label: "Kosmetyki" },
      { id: "meds", label: "Leki na receptę", note: "w oryginalnych opakowaniach" },
      { id: "sunscreen", label: "Krem z filtrem" },
      { id: "blisters", label: "Plastry na odciski", note: "20 000 kroków dziennie to norma" },
    ],
  },
  {
    group: "🧰 Wspólne — sprzęt",
    shared: true,
    items: [
      { id: "adapter", label: "Przejściówka typ A", note: "Japonia ma 100 V i płaskie wtyki" },
      { id: "powerstrip", label: "Listwa zasilająca", note: "jedno gniazdo obsłuży wszystko" },
      { id: "firstaid", label: "Apteczka" },
      { id: "mosquito", label: "Środek na komary" },
      { id: "foldbag", label: "Składana torba na zakupy" },
      { id: "scale", label: "Waga bagażowa", note: "limity na lot krajowy są niższe" },
    ],
  },
  {
    group: "🇯🇵 Wspólne — na miejscu",
    shared: true,
    items: [
      { id: "yen", label: "Gotówka w jenach", note: "mniejsze lokale nie biorą kart" },
      { id: "suica", label: "Karta Suica / Pasmo", note: "można dodać do Apple Wallet" },
      { id: "towel", label: "Ręcznik do rąk", note: "w toaletach zwykle nie ma suszarek" },
      { id: "trashbag", label: "Woreczek na śmieci", note: "koszy na ulicach prawie nie ma" },
      { id: "backup", label: "Kopia danych aplikacji na obu telefonach" },
    ],
  },
];
