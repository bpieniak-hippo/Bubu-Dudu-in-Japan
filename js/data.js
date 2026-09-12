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
    to: "Tokyo Narita (NRT), terminal 1",
    toMap: "Narita International Airport Terminal 1",
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
    extra: [
      "✅ bilety kupione",
      "Walizki powyżej 160 cm sumy wymiarów wymagają miejsca ze strefą bagażową",
    ],
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
    desc: "Kolekcja zbroi i mieczy z pokazem, przymierzaniem zbroi i krótką lekcją posługiwania się kataną. Oddział w Asakusie, kilka minut od Senso-ji.",
    tips: [
      "Wejścia w blokach godzinowych — rezerwuj z wyprzedzeniem",
      "Oprowadzanie po angielsku",
      "Blisko hotelu przy pierwszym pobycie w Tokio",
    ],
  },
  "kioto-to-ji": {
    desc: "Świątynia z najwyższą drewnianą pagodą w Japonii (55 m), założona na początku IX wieku. Kwadrans pieszo od hotelu, więc mieści się nawet w dniu przyjazdu.",
    tips: [
      "Dziedziniec i pagodę widać z zewnątrz za darmo — bilet dotyczy sal z rzeźbami",
      "21. dnia miesiąca odbywa się tu targ staroci Kobo-ichi",
      "Pagoda ładnie wychodzi na zdjęciach od strony stawu",
    ],
  },
  "kioto-yasaka": {
    desc: "Świątynia szintoistyczna zamykająca główną ulicę Gion, obwieszona setkami lampionów. Otwarta całą dobę i podświetlana po zmroku.",
    tips: [
      "Wieczorem lampiony robią lepsze wrażenie niż w dzień",
      "Wejście od Shijo-dori prowadzi prosto w Gion",
      "Za świątynią zaczyna się park Maruyama",
    ],
  },
  "kioto-seiryu-e": {
    desc: "Procesja z ośmiometrowym błękitnym smokiem wokół Kiyomizu-dery, z mnichami i muzykantami. Smok to wcielenie bóstwa opiekuńczego świątyni.",
    tips: [
      "Start o 14:00 spod Okuno-in Hall",
      "Trasa jest wąska — miejsce warto zająć wcześniej",
      "To ta sama świątynia co Kiyomizu-dera na liście, można połączyć",
    ],
  },
  "kioto-yokai-festival": {
    desc: "Nocny pochód duchów i demonów w skansenie filmowym Toei Uzumasa, gdzie kręci się japońskie filmy kostiumowe. Przebrani aktorzy i goście idą razem.",
    tips: [
      "Start o 19:30 — to impreza wieczorna",
      "Skansen działa też w dzień jako park filmowy",
      "Dojazd liniami Randen albo JR do Uzumasa",
    ],
  },
  "kioto-tower": {
    desc: "Stalowa wieża naprzeciwko dworca, taras widokowy na 100 m. Widać stąd cały układ miasta i góry domykające kotlinę.",
    tips: [
      "Najlepiej wejść na zachód słońca — miasto widać i w dzień, i w światłach",
      "Kilka minut pieszo od hotelu",
      "Na tarasie stoją darmowe lornetki",
    ],
  },
  "kioto-gyoen": {
    desc: "Rozległy park wokół dawnego pałacu cesarskiego, z alejami żwirowymi i starymi sosnami. Wstęp do samego parku jest darmowy.",
    tips: [
      "Park otwarty cały czas, pałac w środku wymaga osobnego wejścia",
      "Żwirowe alejki są szerokie — dobre miejsce na spokojny spacer",
      "Ok. 30 min od hotelu",
    ],
  },
  "kioto-trening-jadea": {
    desc: "Trening z Jadeą — szczegóły i adres do ustalenia.",
    tips: ["Dopytać o miejsce i godzinę", "Wpisać dzień, gdy termin będzie znany"],
  },
  "kioto-wazuka": {
    desc: "Wioska w górach na południe od Kioto, gdzie od ośmiuset lat uprawia się herbatę. Zbocza pokryte równymi pasami krzewów to jeden z widoków, z których słynie region Uji.",
    tips: [
      "Dojazd komunikacją jest przesiadkowy — łatwiej z wycieczką albo autem",
      "Część gospodarstw prowadzi degustacje po wcześniejszym umówieniu",
      "Pola najładniej wyglądają w pełnym słońcu",
    ],
  },
  "tokyo-shibuya-sky": {
    desc: "Otwarty taras na dachu Shibuya Scramble Square, 230 m nad słynnym skrzyżowaniem. Z góry widać całą siatkę Tokio, a przy dobrej pogodzie Fuji.",
    tips: [
      "Bilety czasowe — na zachód słońca schodzą najszybciej",
      "Na otwartym tarasie nie wolno mieć luźnych rzeczy w rękach, są szafki",
      "Wieje mocniej niż na dole — przyda się warstwa na wierzch",
    ],
  },
  "tokyo-yanaka-nezu": {
    desc: "Dzielnice, które przetrwały wojnę i trzęsienie ziemi — niskie drewniane domy, targowa uliczka Yanaka Ginza i świątynia Nezu z tunelem czerwonych bram torii.",
    tips: [
      "Yanaka Ginza żyje po południu, rano część kramów jest zamknięta",
      "Tunel torii przy Nezu-jinja jest mniejszy niż Fushimi, ale bez tłumów",
      "Dzielnica słynie z kotów — stąd nazwa „Yanaka no neko”",
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
            suggestedDate: "2026-09-16",
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
            suggestedDate: "2026-09-15",
            mapQuery: "Fushimi Inari Taisha, Kyoto",
            photo: "assets/attractions/kioto-fushimi-inari.jpg",
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
          {
            id: "kioto-to-ji",
            lat: 34.9811,
            lon: 135.7475,
            name: "To-ji",
            suggestedDate: "2026-09-14",
            note: "ok. 12 min pieszo na południe od hotelu",
            mapQuery: "To-ji Temple, Kyoto",
            photo: "assets/attractions/kioto-to-ji.jpg",
            author: "paula",
          },
          {
            id: "kioto-yasaka",
            lat: 35.0036,
            lon: 135.7785,
            name: "Yasaka-jinja",
            note: "w dzielnicy Gion",
            mapQuery: "Yasaka Shrine, Kyoto",
            photo: "assets/attractions/kioto-yasaka.jpg",
            author: "paula",
          },
          {
            id: "kioto-seiryu-e",
            lat: 34.9943,
            lon: 135.7844,
            name: "Seiryū-e — procesja ze smokiem (Kiyomizu-dera)",
            suggestedDate: "2026-09-15",
            note: "start 14:00 spod Okuno-in Hall",
            link: "https://en.japantravel.com/kyoto/seiryu-e-dragon-festival/8412",
            mapQuery: "Kiyomizu-dera, Kyoto",
            photo: "assets/attractions/kioto-seiryu-e.jpg",
            author: "paula",
          },
          {
            id: "kioto-yokai-festival",
            lat: 35.0148,
            lon: 135.7072,
            name: "YOKAI Festival 2026 (Toei Uzumasa Eigamura)",
            note: "od 19:30",
            link: "https://en.eigamura.com/feature/yokai2026/",
            mapQuery: "Toei Kyoto Studio Park",
            photo: "assets/attractions/kioto-yokai-festival.jpg",
            author: "paula",
          },
          {
            id: "kioto-tower",
            lat: 34.9876,
            lon: 135.7592,
            name: "Kyoto Tower — punkt widokowy",
            note: "niedaleko hotelu, najlepiej na zachód słońca",
            mapQuery: "Kyoto Tower",
            photo: "assets/attractions/kioto-tower.jpg",
            author: "paula",
          },
          {
            id: "kioto-gyoen",
            lat: 35.0254,
            lon: 135.7622,
            name: "Kyoto Gyoen — ogród cesarski",
            note: "ok. 30 min od hotelu",
            mapQuery: "Kyoto Gyoen National Garden",
            photo: "assets/attractions/kioto-gyoen.jpg",
            author: "paula",
          },
          {
            id: "kioto-trening-jadea",
            name: "Trening z Jadea",
            note: "adres do ustalenia",
            author: "paula",
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
          {
            id: "kioto-wazuka",
            lat: 34.7669,
            lon: 135.916,
            name: "Wazuka — pola herbaty",
            mapQuery: "Wazuka, Kyoto Prefecture",
            photo: "assets/attractions/kioto-wazuka.jpg",
            author: "paula",
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
            // Id zostaje z prefiksem "kioto-", żeby nie zgubić komentarzy i dat
            // wpisanych, zanim muzeum przeniosło się na listę tokijską.
            id: "kioto-samurai-museum",
            lat: 35.7118,
            lon: 139.7966,
            name: "Muzeum Samurajów i Ninja (Asakusa)",
            link: "https://mai-ko.com/samurai-museum-tokyo/",
            mapQuery: "Samurai Ninja Museum Tokyo, Asakusa",
            photo: "assets/attractions/kioto-samurai-museum.jpg",
            author: "bartek",
          },
          {
            id: "tokyo-shibuya-sky",
            lat: 35.658,
            lon: 139.7016,
            name: "Shibuya Sky",
            mapQuery: "Shibuya Sky, Tokyo",
            photo: "assets/attractions/tokyo-shibuya-sky.jpg",
            author: "paula",
          },
          {
            id: "tokyo-yanaka-nezu",
            lat: 35.7273,
            lon: 139.766,
            name: "Yanaka i Nezu — stare dzielnice",
            mapQuery: "Yanaka Ginza, Tokyo",
            photo: "assets/attractions/tokyo-yanaka-nezu.jpg",
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
      { id: "esim", label: "Karty e-SIM", note: "kupić przed wylotem, aktywować po wylądowaniu" },
      { id: "suica", label: "Karta Suica / Pasmo", note: "można dodać do Apple Wallet" },
      { id: "towel", label: "Ręcznik do rąk", note: "w toaletach zwykle nie ma suszarek" },
      { id: "trashbag", label: "Woreczek na śmieci", note: "koszy na ulicach prawie nie ma" },
      { id: "backup", label: "Kopia danych aplikacji na obu telefonach" },
    ],
  },
];

// Rozmówki. `say` to wymowa zapisana po polsku, a nie transkrypcja naukowa —
// czytane wprost brzmi wystarczająco blisko, żeby zostać zrozumianym. Japońskie
// "u" na końcu -masu prawie zanika, stąd "-mas". Sylabę zapisujemy tak, jak się
// ją mówi: し = "si", ち = "ci", わ jako partykuła = "ła".
const PHRASES = [
  {
    group: "🙂 Podstawy",
    items: [
      { pl: "Dzień dobry", jp: "こんにちは", say: "kon-ni-ci-ła" },
      { pl: "Dziękuję", jp: "ありがとうございます", say: "arigatoo gozaimas" },
      { pl: "Przepraszam / halo, słucham pana", jp: "すみません", say: "sumimasen" },
      { pl: "Tak", jp: "はい", say: "hai" },
      { pl: "Nie", jp: "いいえ", say: "iie" },
      { pl: "Proszę (podając coś)", jp: "どうぞ", say: "doozo" },
      { pl: "Nie rozumiem", jp: "わかりません", say: "łakarimasen" },
      { pl: "Czy mówi pan po angielsku?", jp: "英語を話せますか？", say: "eigo o hanasemas ka" },
      { pl: "Proszę powoli", jp: "ゆっくりお願いします", say: "jukkuri onegai-simas" },
      { pl: "Do widzenia", jp: "さようなら", say: "sajoonara" },
    ],
  },
  {
    group: "🍜 W restauracji",
    items: [
      { pl: "Dwie osoby", jp: "二人です", say: "futari des" },
      { pl: "Poproszę to (wskazując)", jp: "これをください", say: "kore o kudasai" },
      { pl: "Jest menu po angielsku?", jp: "英語のメニューはありますか？", say: "eigo no menjuu ła arimas ka" },
      { pl: "Poproszę wodę", jp: "お水をください", say: "omizu o kudasai" },
      { pl: "Bez mięsa proszę", jp: "肉なしでお願いします", say: "niku nasi de onegai-simas" },
      { pl: "Mam alergię na jajka", jp: "卵アレルギーです", say: "tamago arerugii des" },
      { pl: "Pyszne!", jp: "おいしいです", say: "oiszii des" },
      { pl: "Poproszę rachunek", jp: "お会計をお願いします", say: "okaikei o onegai-simas" },
      { pl: "Dziękuję za posiłek", jp: "ごちそうさまでした", say: "gocisoosama desita" },
    ],
  },
  {
    group: "🛍️ Zakupy i pieniądze",
    items: [
      { pl: "Ile to kosztuje?", jp: "いくらですか？", say: "ikura des ka" },
      { pl: "Czy mogę zapłacić kartą?", jp: "カードで払えますか？", say: "kaado de haraemas ka" },
      { pl: "Tylko oglądam", jp: "見ているだけです", say: "mite iru dake des" },
      { pl: "Poproszę torebkę", jp: "袋をください", say: "fukuro o kudasai" },
      { pl: "Poproszę paragon", jp: "レシートをください", say: "resziito o kudasai" },
      { pl: "Czy mogę kupić bez podatku?", jp: "免税できますか？", say: "menzei dekimas ka" },
    ],
  },
  {
    group: "🚉 W drodze",
    items: [
      { pl: "Gdzie jest dworzec?", jp: "駅はどこですか？", say: "eki ła doko des ka" },
      { pl: "Gdzie jest toaleta?", jp: "トイレはどこですか？", say: "toire ła doko des ka" },
      { pl: "Czy ten pociąg jedzie do Kioto?", jp: "この電車は京都に行きますか？", say: "kono densia ła kjooto ni ikimas ka" },
      { pl: "Z którego peronu?", jp: "何番線ですか？", say: "nanbansen des ka" },
      { pl: "Zgubiłem się", jp: "道に迷いました", say: "mici ni majoimasita" },
      { pl: "Proszę pod ten adres (pokazując)", jp: "この住所までお願いします", say: "kono dziuusio made onegai-simas" },
    ],
  },
  {
    group: "🚑 Gdy coś pójdzie źle",
    items: [
      { pl: "Pomocy!", jp: "助けて！", say: "taskete" },
      { pl: "Źle się czuję", jp: "気分が悪いです", say: "kibun ga łarui des" },
      { pl: "Potrzebuję lekarza", jp: "医者が必要です", say: "isia ga hicujoo des" },
      { pl: "Gdzie jest szpital?", jp: "病院はどこですか？", say: "bjooin ła doko des ka" },
      { pl: "Zgubiłem paszport", jp: "パスポートをなくしました", say: "paspooto o nakusimasita" },
      { pl: "Proszę wezwać policję", jp: "警察を呼んでください", say: "keisacu o jonde kudasai" },
    ],
  },
];
