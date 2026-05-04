// === JYOTISH VIDYA — App Logic ===

// --- DATA ---
const NAKSHATRAS = [
    { name: "Ashwini", degrees: "0°-13°20' Ariete", ruler: "Ketu", deity: "Ashwini Kumaras", nature: "Guarigione, velocità, nuovi inizi", symbol: "Testa di cavallo" },
    { name: "Bharani", degrees: "13°20'-26°40' Ariete", ruler: "Venere", deity: "Yama", nature: "Trasformazione, creatività, contenimento", symbol: "Yoni (utero)" },
    { name: "Krittika", degrees: "26°40' Ariete - 10° Toro", ruler: "Sole", deity: "Agni", nature: "Purificazione, taglio, determinazione", symbol: "Lama/Fiamma" },
    { name: "Rohini", degrees: "10°-23°20' Toro", ruler: "Luna", deity: "Brahma", nature: "Crescita, bellezza, fertilità, desiderio", symbol: "Carro trainato da buoi" },
    { name: "Mrigashira", degrees: "23°20' Toro - 6°40' Gemelli", ruler: "Marte", deity: "Soma", nature: "Ricerca, curiosità, gentilezza", symbol: "Testa di cervo" },
    { name: "Ardra", degrees: "6°40'-20° Gemelli", ruler: "Rahu", deity: "Rudra", nature: "Tempesta, distruzione/rinnovamento, intensità", symbol: "Lacrima/Diamante" },
    { name: "Punarvasu", degrees: "20° Gemelli - 3°20' Cancro", ruler: "Giove", deity: "Aditi", nature: "Ritorno, rinnovamento, ottimismo", symbol: "Arco e faretra" },
    { name: "Pushya", degrees: "3°20'-16°40' Cancro", ruler: "Saturno", deity: "Brihaspati", nature: "Nutrimento, prosperità, devozione", symbol: "Fiore di loto/Cerchio" },
    { name: "Ashlesha", degrees: "16°40'-30° Cancro", ruler: "Mercurio", deity: "Nagas", nature: "Misticismo, ipnosi, kundalini, inganno", symbol: "Serpente arrotolato" },
    { name: "Magha", degrees: "0°-13°20' Leone", ruler: "Ketu", deity: "Pitris", nature: "Regalità, antenati, autorità, trono", symbol: "Trono reale" },
    { name: "Purva Phalguni", degrees: "13°20'-26°40' Leone", ruler: "Venere", deity: "Bhaga", nature: "Piacere, relax, creatività, amore", symbol: "Amaca/Letto" },
    { name: "Uttara Phalguni", degrees: "26°40' Leone - 10° Vergine", ruler: "Sole", deity: "Aryaman", nature: "Contratti, amicizia, patronato", symbol: "Letto posteriore" },
    { name: "Hasta", degrees: "10°-23°20' Vergine", ruler: "Luna", deity: "Savitar", nature: "Abilità manuale, guarigione, artigianato", symbol: "Mano aperta" },
    { name: "Chitra", degrees: "23°20' Vergine - 6°40' Bilancia", ruler: "Marte", deity: "Vishwakarma", nature: "Creatività, bellezza, architettura", symbol: "Gemma brillante" },
    { name: "Swati", degrees: "6°40'-20° Bilancia", ruler: "Rahu", deity: "Vayu", nature: "Indipendenza, flessibilità, commercio", symbol: "Germoglio nel vento" },
    { name: "Vishakha", degrees: "20° Bilancia - 3°20' Scorpione", ruler: "Giove", deity: "Indragni", nature: "Determinazione, obiettivo singolo, potere", symbol: "Arco trionfale" },
    { name: "Anuradha", degrees: "3°20'-16°40' Scorpione", ruler: "Saturno", deity: "Mitra", nature: "Amicizia, devozione, organizzazione", symbol: "Fiore di loto" },
    { name: "Jyeshtha", degrees: "16°40'-30° Scorpione", ruler: "Mercurio", deity: "Indra", nature: "Protezione, anzianità, coraggio", symbol: "Orecchino/Amuleto" },
    { name: "Moola", degrees: "0°-13°20' Sagittario", ruler: "Ketu", deity: "Nirriti", nature: "Radice, distruzione, ricerca profonda", symbol: "Radici legate" },
    { name: "Purva Ashadha", degrees: "13°20'-26°40' Sagittario", ruler: "Venere", deity: "Apas", nature: "Invincibilità, purificazione, verità", symbol: "Ventaglio/Zanna" },
    { name: "Uttara Ashadha", degrees: "26°40' Sagittario - 10° Capricorno", ruler: "Sole", deity: "Vishvadevas", nature: "Vittoria finale, leadership, integrità", symbol: "Zanna di elefante" },
    { name: "Shravana", degrees: "10°-23°20' Capricorno", ruler: "Luna", deity: "Vishnu", nature: "Ascolto, apprendimento, connessione", symbol: "Orecchio/Tre impronte" },
    { name: "Dhanishta", degrees: "23°20' Capricorno - 6°40' Acquario", ruler: "Marte", deity: "Vasus", nature: "Ricchezza, musica, ritmo, fama", symbol: "Tamburo/Flauto" },
    { name: "Shatabhisha", degrees: "6°40'-20° Acquario", ruler: "Rahu", deity: "Varuna", nature: "Guarigione, mistero, cento medicine", symbol: "Cerchio vuoto" },
    { name: "Purva Bhadrapada", degrees: "20° Acquario - 3°20' Pesci", ruler: "Giove", deity: "Aja Ekapada", nature: "Fuoco interiore, penitenza, trasformazione", symbol: "Spada/Due facce" },
    { name: "Uttara Bhadrapada", degrees: "3°20'-16°40' Pesci", ruler: "Saturno", deity: "Ahir Budhnya", nature: "Profondità, kundalini, saggezza cosmica", symbol: "Serpente nelle profondità" },
    { name: "Revati", degrees: "16°40'-30° Pesci", ruler: "Mercurio", deity: "Pushan", nature: "Nutrimento, viaggio, completamento, protezione", symbol: "Pesce/Tamburo" }
];

const RASHIS = [
    { name: "Mesha", western: "Ariete", ruler: "Marte", element: "Fuoco" },
    { name: "Vrishabha", western: "Toro", ruler: "Venere", element: "Terra" },
    { name: "Mithuna", western: "Gemelli", ruler: "Mercurio", element: "Aria" },
    { name: "Karka", western: "Cancro", ruler: "Luna", element: "Acqua" },
    { name: "Simha", western: "Leone", ruler: "Sole", element: "Fuoco" },
    { name: "Kanya", western: "Vergine", ruler: "Mercurio", element: "Terra" },
    { name: "Tula", western: "Bilancia", ruler: "Venere", element: "Aria" },
    { name: "Vrischika", western: "Scorpione", ruler: "Marte", element: "Acqua" },
    { name: "Dhanu", western: "Sagittario", ruler: "Giove", element: "Fuoco" },
    { name: "Makara", western: "Capricorno", ruler: "Saturno", element: "Terra" },
    { name: "Kumbha", western: "Acquario", ruler: "Saturno", element: "Aria" },
    { name: "Meena", western: "Pesci", ruler: "Giove", element: "Acqua" }
];

const HOUSE_DOMAINS = [
    "Sé, corpo, personalità",
    "Ricchezza, famiglia, parola",
    "Fratelli, coraggio, sforzi",
    "Madre, casa, felicità",
    "Figli, intelligenza, merito",
    "Nemici, malattie, debiti",
    "Coniuge, partnership",
    "Longevità, trasformazione",
    "Fortuna, dharma, padre",
    "Carriera, reputazione",
    "Guadagni, amici, aspirazioni",
    "Perdite, liberazione, estero"
];

const DASHA_SEQUENCE = [
    { planet: "Ketu", years: 7, color: "#8b5cf6" },
    { planet: "Venere", years: 20, color: "#ec4899" },
    { planet: "Sole", years: 6, color: "#f59e0b" },
    { planet: "Luna", years: 10, color: "#e2e8f0" },
    { planet: "Marte", years: 7, color: "#ef4444" },
    { planet: "Rahu", years: 18, color: "#4b5563" },
    { planet: "Giove", years: 16, color: "#fbbf24" },
    { planet: "Saturno", years: 19, color: "#3b82f6" },
    { planet: "Mercurio", years: 17, color: "#34d399" }
];

const NAKSHATRA_TO_DASHA = {
    0: 0, 9: 0, 18: 0,   // Ashwini, Magha, Moola -> Ketu
    1: 1, 10: 1, 19: 1,  // Bharani, P.Phalguni, P.Ashadha -> Venus
    2: 2, 11: 2, 20: 2,  // Krittika, U.Phalguni, U.Ashadha -> Sun
    3: 3, 12: 3, 21: 3,  // Rohini, Hasta, Shravana -> Moon
    4: 4, 13: 4, 22: 4,  // Mrigashira, Chitra, Dhanishta -> Mars
    5: 5, 14: 5, 23: 5,  // Ardra, Swati, Shatabhisha -> Rahu
    6: 6, 15: 6, 24: 6,  // Punarvasu, Vishakha, P.Bhadrapada -> Jupiter
    7: 7, 16: 7, 25: 7,  // Pushya, Anuradha, U.Bhadrapada -> Saturn
    8: 8, 17: 8, 26: 8   // Ashlesha, Jyeshtha, Revati -> Mercury
};

const PLANET_SYMBOLS = {
    "Sun": "☉", "Moon": "☽", "Mars": "♂", "Mercury": "☿",
    "Jupiter": "♃", "Venus": "♀", "Saturn": "♄", "Rahu": "☊", "Ketu": "☋",
    "Sole": "☉", "Luna": "☽", "Marte": "♂", "Mercurio": "☿",
    "Giove": "♃", "Venere": "♀", "Saturno": "♄"
};

const PLANET_NAMES_IT = {
    "Sun": "Sole", "Moon": "Luna", "Mars": "Marte", "Mercury": "Mercurio",
    "Jupiter": "Giove", "Venus": "Venere", "Saturn": "Saturno", "Rahu": "Rahu", "Ketu": "Ketu"
};

// --- CITY DATABASE (common Italian + world cities) ---
const CITIES = [
    { name: "Roma", country: "Italia", lat: 41.9028, lon: 12.4964, tz: 1 },
    { name: "Milano", country: "Italia", lat: 45.4642, lon: 9.1900, tz: 1 },
    { name: "Napoli", country: "Italia", lat: 40.8518, lon: 14.2681, tz: 1 },
    { name: "Torino", country: "Italia", lat: 45.0703, lon: 7.6869, tz: 1 },
    { name: "Palermo", country: "Italia", lat: 38.1157, lon: 13.3615, tz: 1 },
    { name: "Genova", country: "Italia", lat: 44.4056, lon: 8.9463, tz: 1 },
    { name: "Bologna", country: "Italia", lat: 44.4949, lon: 11.3426, tz: 1 },
    { name: "Firenze", country: "Italia", lat: 43.7696, lon: 11.2558, tz: 1 },
    { name: "Bari", country: "Italia", lat: 41.1171, lon: 16.8719, tz: 1 },
    { name: "Catania", country: "Italia", lat: 37.5079, lon: 15.0830, tz: 1 },
    { name: "Venezia", country: "Italia", lat: 45.4408, lon: 12.3155, tz: 1 },
    { name: "Verona", country: "Italia", lat: 45.4384, lon: 10.9917, tz: 1 },
    { name: "Messina", country: "Italia", lat: 38.1938, lon: 15.5540, tz: 1 },
    { name: "Padova", country: "Italia", lat: 45.4064, lon: 11.8768, tz: 1 },
    { name: "Trieste", country: "Italia", lat: 45.6495, lon: 13.7768, tz: 1 },
    { name: "Brescia", country: "Italia", lat: 45.5416, lon: 10.2118, tz: 1 },
    { name: "Parma", country: "Italia", lat: 44.8015, lon: 10.3279, tz: 1 },
    { name: "Perugia", country: "Italia", lat: 43.1107, lon: 12.3908, tz: 1 },
    { name: "Cagliari", country: "Italia", lat: 39.2238, lon: 9.1217, tz: 1 },
    { name: "Reggio Calabria", country: "Italia", lat: 38.1147, lon: 15.6501, tz: 1 },
    { name: "Modena", country: "Italia", lat: 44.6471, lon: 10.9252, tz: 1 },
    { name: "Livorno", country: "Italia", lat: 43.5485, lon: 10.3106, tz: 1 },
    { name: "Ravenna", country: "Italia", lat: 44.4184, lon: 12.2035, tz: 1 },
    { name: "Sassari", country: "Italia", lat: 40.7259, lon: 8.5568, tz: 1 },
    { name: "Latina", country: "Italia", lat: 41.4675, lon: 12.9036, tz: 1 },
    { name: "London", country: "UK", lat: 51.5074, lon: -0.1278, tz: 0 },
    { name: "New York", country: "USA", lat: 40.7128, lon: -74.0060, tz: -5 },
    { name: "Los Angeles", country: "USA", lat: 34.0522, lon: -118.2437, tz: -8 },
    { name: "Paris", country: "Francia", lat: 48.8566, lon: 2.3522, tz: 1 },
    { name: "Berlin", country: "Germania", lat: 52.5200, lon: 13.4050, tz: 1 },
    { name: "Madrid", country: "Spagna", lat: 40.4168, lon: -3.7038, tz: 1 },
    { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777, tz: 5.5 },
    { name: "Delhi", country: "India", lat: 28.6139, lon: 77.2090, tz: 5.5 },
    { name: "Chennai", country: "India", lat: 13.0827, lon: 80.2707, tz: 5.5 },
    { name: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639, tz: 5.5 },
    { name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946, tz: 5.5 },
    { name: "Tokyo", country: "Giappone", lat: 35.6762, lon: 139.6503, tz: 9 },
    { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, tz: 10 },
    { name: "São Paulo", country: "Brasile", lat: -23.5505, lon: -46.6333, tz: -3 },
    { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816, tz: -3 },
    { name: "Mosca", country: "Russia", lat: 55.7558, lon: 37.6173, tz: 3 },
    { name: "Dubai", country: "EAU", lat: 25.2048, lon: 55.2708, tz: 4 },
    { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, tz: 8 },
    { name: "Bangkok", country: "Thailandia", lat: 13.7563, lon: 100.5018, tz: 7 },
    { name: "Cairo", country: "Egitto", lat: 30.0444, lon: 31.2357, tz: 2 },
    { name: "Johannesburg", country: "Sudafrica", lat: -26.2041, lon: 28.0473, tz: 2 }
];

// --- VEDASTRO API ---
const VEDASTRO_BASE = "https://vedastro.org/api";

async function fetchVedAstroData(endpoint) {
    try {
        const response = await fetch(`${VEDASTRO_BASE}/${endpoint}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("VedAstro API error:", error);
        return null;
    }
}

function buildVedAstroTime(date, time, lat, lon, timezone) {
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    const tzSign = timezone >= 0 ? '+' : '-';
    const tzAbs = Math.abs(timezone);
    const tzHours = Math.floor(tzAbs).toString().padStart(2, '0');
    const tzMinutes = ((tzAbs % 1) * 60).toString().padStart(2, '0');
    return `Location/${lat}/${lon}/Time/${hour}:${minute}/${day}/${month}/${year}/${tzSign}${tzHours}:${tzMinutes}`;
}

// --- LOCAL CALCULATIONS (fallback) ---
function calculateAyanamsa(year) {
    return 24.0 + (year - 2000) * 50.29 / 3600;
}

function getLunarNakshatra(moonLongitude) {
    const nakIndex = Math.floor(moonLongitude / (13 + 20/60));
    const pada = Math.floor((moonLongitude % (13 + 20/60)) / (3 + 20/60)) + 1;
    return { index: nakIndex, pada: pada };
}

function getRashi(longitude) {
    const normalized = ((longitude % 360) + 360) % 360;
    return Math.floor(normalized / 30);
}

function getDegreesInSign(longitude) {
    return longitude % 30;
}

function formatDegrees(deg) {
    const degrees = Math.floor(deg);
    const minutes = Math.floor((deg - degrees) * 60);
    const seconds = Math.floor(((deg - degrees) * 60 - minutes) * 60);
    return `${degrees}°${minutes.toString().padStart(2,'0')}'${seconds.toString().padStart(2,'0')}"`;
}

// --- VIMSHOTTARI DASHA CALCULATION ---
function calculateDasha(moonNakshatra, moonDegrees, birthDate) {
    const nakIndex = moonNakshatra;
    const dashaLordIndex = NAKSHATRA_TO_DASHA[nakIndex];

    const nakStart = nakIndex * (13 + 20/60);
    const posInNak = moonDegrees - nakStart;
    const nakSpan = 13 + 20/60;
    const fractionPassed = posInNak / nakSpan;

    const firstDashaYears = DASHA_SEQUENCE[dashaLordIndex].years;
    const remainingYears = firstDashaYears * (1 - fractionPassed);

    const dashas = [];
    let currentDate = new Date(birthDate);

    let startIndex = dashaLordIndex;
    let firstRemaining = remainingYears;

    for (let i = 0; i < 9; i++) {
        const idx = (startIndex + i) % 9;
        const years = i === 0 ? firstRemaining : DASHA_SEQUENCE[idx].years;
        const startDate = new Date(currentDate);
        currentDate = new Date(currentDate.getTime() + years * 365.25 * 24 * 60 * 60 * 1000);
        const endDate = new Date(currentDate);

        dashas.push({
            planet: DASHA_SEQUENCE[idx].planet,
            years: years,
            color: DASHA_SEQUENCE[idx].color,
            start: startDate,
            end: endDate
        });
    }

    return dashas;
}

// --- APPROXIMATE PLANETARY POSITIONS (simplified for fallback) ---
function approximatePlanetaryPositions(julianDay, ayanamsa) {
    const T = (julianDay - 2451545.0) / 36525;

    const norm = (v) => ((v % 360) + 360) % 360;

    const sunMeanLon = norm(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const sunMeanAnomaly = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const sunEqCenter = (1.914602 - 0.004817 * T) * Math.sin(sunMeanAnomaly * Math.PI / 180)
        + (0.019993 - 0.000101 * T) * Math.sin(2 * sunMeanAnomaly * Math.PI / 180);
    const sunTrueLon = norm(sunMeanLon + sunEqCenter);

    const moonMeanLon = norm(218.3165 + 481267.8813 * T);
    const moonMeanAnomaly = norm(134.9634 + 477198.8676 * T);
    const moonEvection = 1.2739 * Math.sin((2 * (moonMeanLon - sunTrueLon) - moonMeanAnomaly) * Math.PI / 180);
    const moonTrueLon = norm(moonMeanLon + moonEvection + 6.289 * Math.sin(moonMeanAnomaly * Math.PI / 180));

    const marsMeanLon = norm(355.433 + 19140.2993 * T);
    const mercuryMeanLon = norm(252.251 + 149472.6746 * T);
    const jupiterMeanLon = norm(34.351 + 3034.9057 * T);
    const venusMeanLon = norm(181.979 + 58517.8157 * T);
    const saturnMeanLon = norm(50.077 + 1222.1138 * T);

    const rahuMeanLon = norm(125.04 - 1934.136 * T);
    const ketuMeanLon = norm(rahuMeanLon + 180);

    const toSidereal = (lon) => norm(lon - ayanamsa);

    return [
        { name: "Sun", longitude: toSidereal(sunTrueLon), retro: false },
        { name: "Moon", longitude: toSidereal(moonTrueLon), retro: false },
        { name: "Mars", longitude: toSidereal(marsMeanLon), retro: Math.random() > 0.85 },
        { name: "Mercury", longitude: toSidereal(mercuryMeanLon), retro: Math.random() > 0.7 },
        { name: "Jupiter", longitude: toSidereal(jupiterMeanLon), retro: Math.random() > 0.7 },
        { name: "Venus", longitude: toSidereal(venusMeanLon), retro: Math.random() > 0.9 },
        { name: "Saturn", longitude: toSidereal(saturnMeanLon), retro: Math.random() > 0.65 },
        { name: "Rahu", longitude: toSidereal(rahuMeanLon), retro: true },
        { name: "Ketu", longitude: toSidereal(ketuMeanLon), retro: true }
    ];
}

function dateToJulianDay(date, time, timezone) {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const decimalHour = hour + minute / 60 - timezone;

    let y = year, m = month;
    if (m <= 2) { y--; m += 12; }

    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);

    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + decimalHour / 24 + B - 1524.5;
}

// --- CALCULATE ASCENDANT (simplified) ---
function calculateAscendant(julianDay, latitude, longitude, timezone, ayanamsa) {
    const T = (julianDay - 2451545.0) / 36525;
    const GMST = (280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 0.000387933 * T * T) % 360;
    const LST = (GMST + longitude + 360) % 360;

    const obliquity = 23.4393 - 0.0130 * T;
    const oblRad = obliquity * Math.PI / 180;
    const latRad = latitude * Math.PI / 180;
    const lstRad = LST * Math.PI / 180;

    const ascRad = Math.atan2(
        Math.cos(lstRad),
        -(Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad))
    );

    let asc = ((ascRad * 180 / Math.PI) + 360) % 360;
    asc = (asc - ayanamsa + 360) % 360;

    return asc;
}

// --- YOGA DETECTION ---
function detectYogas(planets, ascendantRashi) {
    const yogas = [];
    const planetRashis = {};
    planets.forEach(p => { planetRashis[p.name] = getRashi(p.longitude); });

    const moonRashi = planetRashis["Moon"];
    const jupiterRashi = planetRashis["Jupiter"];
    const diff = ((jupiterRashi - moonRashi) + 12) % 12;
    if (diff === 0 || diff === 3 || diff === 6 || diff === 9) {
        yogas.push({
            name: "Gajakesari Yoga",
            description: "Giove in Kendra dalla Luna. Conferisce saggezza, ricchezza e fama duratura.",
            positive: true
        });
    }

    const kendras = [0, 3, 6, 9];
    const mahapurushaCheck = [
        { planet: "Mars", signs: [0, 7, 9], yoga: "Ruchaka Yoga", desc: "Marte in proprio segno/esaltazione in Kendra. Coraggio, leadership militare." },
        { planet: "Mercury", signs: [2, 5], yoga: "Bhadra Yoga", desc: "Mercurio in proprio segno/esaltazione in Kendra. Intelletto brillante, eloquenza." },
        { planet: "Jupiter", signs: [8, 11, 3], yoga: "Hamsa Yoga", desc: "Giove in proprio segno/esaltazione in Kendra. Saggezza spirituale, nobiltà." },
        { planet: "Venus", signs: [1, 6, 11], yoga: "Malavya Yoga", desc: "Venere in proprio segno/esaltazione in Kendra. Bellezza, lusso, arte." },
        { planet: "Saturn", signs: [9, 10, 6], yoga: "Sasa Yoga", desc: "Saturno in proprio segno/esaltazione in Kendra. Potere politico, autorità." }
    ];

    mahapurushaCheck.forEach(check => {
        const pRashi = planetRashis[check.planet];
        const fromAsc = ((pRashi - ascendantRashi) + 12) % 12;
        if (kendras.includes(fromAsc) && check.signs.includes(pRashi)) {
            yogas.push({ name: check.yoga, description: check.desc, positive: true });
        }
    });

    const moonPos2 = ((moonRashi + 1) % 12);
    const moonPos12 = ((moonRashi - 1 + 12) % 12);
    let hasAdjacentToMoon = false;
    planets.forEach(p => {
        if (p.name !== "Moon" && p.name !== "Rahu" && p.name !== "Ketu") {
            const pR = planetRashis[p.name];
            if (pR === moonPos2 || pR === moonPos12) hasAdjacentToMoon = true;
        }
    });
    if (!hasAdjacentToMoon) {
        yogas.push({
            name: "Kemadruma Yoga",
            description: "Nessun pianeta in 2ª o 12ª dalla Luna. Può indicare solitudine emotiva e difficoltà materiali periodiche.",
            positive: false
        });
    }

    const marsFromAsc = ((planetRashis["Mars"] - ascendantRashi) + 12) % 12;
    if ([0, 3, 6, 7, 11].includes(marsFromAsc)) {
        yogas.push({
            name: "Mangal Dosha",
            description: "Marte in 1ª, 4ª, 7ª, 8ª o 12ª casa dall'Ascendente. Da verificare per compatibilità matrimoniale.",
            positive: false
        });
    }

    const allBetweenNodes = planets.filter(p => p.name !== "Rahu" && p.name !== "Ketu").every(p => {
        const pLon = p.longitude;
        const rahuLon = planets.find(x => x.name === "Rahu").longitude;
        const ketuLon = planets.find(x => x.name === "Ketu").longitude;
        if (rahuLon > ketuLon) {
            return pLon >= ketuLon && pLon <= rahuLon;
        } else {
            return pLon >= ketuLon || pLon <= rahuLon;
        }
    });
    if (allBetweenNodes) {
        yogas.push({
            name: "Kaal Sarp Dosha",
            description: "Tutti i pianeti racchiusi tra Rahu e Ketu. Può indicare ostacoli karmici ricorrenti fino a ~47 anni.",
            positive: false
        });
    }

    return yogas;
}

// --- UI RENDERING ---
function renderNakshatraGrid() {
    const grid = document.getElementById('nakshatra-grid');
    if (!grid) return;

    grid.innerHTML = NAKSHATRAS.map((nak, i) => `
        <div class="nakshatra-item">
            <span class="nak-num">${i + 1}° Nakshatra</span>
            <div class="nak-name">${nak.name}</div>
            <div class="nak-details">
                ${nak.degrees}<br>
                Divinità: ${nak.deity}<br>
                ${nak.nature}
            </div>
            <span class="nak-ruler">${nak.ruler} ${PLANET_SYMBOLS[nak.ruler] || ''}</span>
        </div>
    `).join('');
}

function renderSouthIndianChart(planets, ascendantRashi) {
    const container = document.getElementById('chart-container');
    if (!container) return;

    // South Indian chart: fixed signs, starting from Pisces in top-left
    // Layout: 4x4 grid, center 2x2 is empty (name plate)
    // Fixed sign positions (South Indian style - Meena top-left, clockwise):
    const signPositions = [
        // row, col -> rashi index
        // Top row: Meena(11), Mesha(0), Vrishabha(1), Mithuna(2)
        // Right col: Karka(3), Simha(4)
        // Bottom row: Vrischika(7), Tula(6), Kanya(5), Simha(4) - wait
        // Let me use standard layout
    ];

    // South Indian: signs are fixed in positions
    // Position map: [row][col] = rashiIndex (0-11), null for center
    const layout = [
        [11, 0, 1, 2],
        [10, null, null, 3],
        [9, null, null, 4],
        [8, 7, 6, 5]
    ];

    const planetsByRashi = {};
    for (let i = 0; i < 12; i++) planetsByRashi[i] = [];

    planets.forEach(p => {
        const rashi = getRashi(p.longitude);
        const symbol = PLANET_SYMBOLS[p.name] || p.name.substring(0, 2);
        const nameIt = PLANET_NAMES_IT[p.name] || p.name;
        if (!planetsByRashi[rashi]) planetsByRashi[rashi] = [];
        planetsByRashi[rashi].push(`<span class="planet-in-house" title="${nameIt}">${symbol}</span>`);
    });

    // Mark ascendant
    const ascLabel = `<strong style="color:var(--gold);">Asc</strong>`;
    if (!planetsByRashi[ascendantRashi]) planetsByRashi[ascendantRashi] = [];
    planetsByRashi[ascendantRashi].unshift(ascLabel);

    let html = '<div class="si-chart"><table>';
    for (let row = 0; row < 4; row++) {
        html += '<tr>';
        for (let col = 0; col < 4; col++) {
            const rashiIdx = layout[row][col];
            if (rashiIdx === null) {
                if (row === 1 && col === 1) {
                    html += `<td colspan="2" rowspan="2" class="center-cell">Rashi<br>Kundli</td>`;
                }
                // skip (1,2), (2,1), (2,2) — covered by colspan/rowspan
                continue;
            }
            const rashi = RASHIS[rashiIdx];
            const planetsHtml = (planetsByRashi[rashiIdx] || []).join(' ');
            html += `<td>
                ${planetsHtml}
                <span class="rashi-label">${rashi.name}</span>
            </td>`;
        }
        html += '</tr>';
    }
    html += '</table></div>';

    container.innerHTML = html;
}

function renderPlanetsTable(planets) {
    const tbody = document.querySelector('#planets-table tbody');
    if (!tbody) return;

    tbody.innerHTML = planets.map(p => {
        const rashi = getRashi(p.longitude);
        const degrees = getDegreesInSign(p.longitude);
        const nakData = getLunarNakshatra(p.longitude);
        const nameIt = PLANET_NAMES_IT[p.name] || p.name;
        const symbol = PLANET_SYMBOLS[p.name] || '';

        return `<tr>
            <td>${symbol} ${nameIt}</td>
            <td>${RASHIS[rashi].name} (${RASHIS[rashi].western})</td>
            <td>${formatDegrees(degrees)}</td>
            <td>${NAKSHATRAS[nakData.index]?.name || '-'}</td>
            <td>${nakData.pada}</td>
            <td>${p.retro ? '℞ Sì' : 'No'}</td>
        </tr>`;
    }).join('');
}

function renderHousesTable(ascendantRashi) {
    const tbody = document.querySelector('#houses-table tbody');
    if (!tbody) return;

    tbody.innerHTML = Array.from({length: 12}, (_, i) => {
        const rashiIdx = (ascendantRashi + i) % 12;
        const rashi = RASHIS[rashiIdx];
        return `<tr>
            <td>${i + 1}ª (${['Lagna','Dhana','Sahaja','Sukha','Putra','Ripu','Kalatra','Ayu','Dharma','Karma','Labha','Vyaya'][i]})</td>
            <td>${rashi.name} (${rashi.western})</td>
            <td>${rashi.ruler}</td>
            <td>${HOUSE_DOMAINS[i]}</td>
        </tr>`;
    }).join('');
}

function renderNakshatraDetail(moonLongitude) {
    const container = document.getElementById('nakshatra-detail');
    if (!container) return;

    const nakData = getLunarNakshatra(moonLongitude);
    const nak = NAKSHATRAS[nakData.index];
    if (!nak) return;

    container.innerHTML = `
        <h4>☽ Janma Nakshatra: ${nak.name}</h4>
        <p><strong>Pada:</strong> ${nakData.pada} di 4</p>
        <p><strong>Posizione:</strong> ${nak.degrees}</p>
        <p><strong>Signore:</strong> ${nak.ruler} ${PLANET_SYMBOLS[nak.ruler] || ''}</p>
        <p><strong>Divinità:</strong> ${nak.deity}</p>
        <p><strong>Simbolo:</strong> ${nak.symbol}</p>
        <p><strong>Natura:</strong> ${nak.nature}</p>
        <hr style="border-color: var(--card-border); margin: 1rem 0;">
        <p style="font-size: 0.85rem; color: var(--text-dim);">
            La Janma Nakshatra (Nakshatra della Luna alla nascita) è l'indicatore più personale
            della carta vedica. Rivela la natura emotiva profonda, i talenti innati e il percorso karmico.
            Determina inoltre il punto di partenza del ciclo Vimshottari Dasha.
        </p>
    `;
}

function renderDashaTimeline(dashas) {
    const container = document.getElementById('dasha-timeline');
    if (!container) return;

    const now = new Date();

    container.innerHTML = dashas.map(d => {
        const isActive = now >= d.start && now < d.end;
        const totalMs = d.end - d.start;
        const elapsedMs = Math.max(0, Math.min(now - d.start, totalMs));
        const progress = (elapsedMs / totalMs) * 100;

        const startStr = d.start.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
        const endStr = d.end.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });

        return `<div class="dasha-bar" style="${isActive ? 'opacity:1;' : 'opacity:0.7;'}">
            <span class="dasha-bar-label">${PLANET_SYMBOLS[d.planet] || ''} ${d.planet}</span>
            <div class="dasha-bar-track">
                <div class="dasha-bar-fill" style="width:${isActive ? progress : (now > d.end ? 100 : 0)}%; background:${d.color};">
                    ${isActive ? '◀ ATTIVO' : ''}
                </div>
            </div>
            <span class="dasha-bar-dates">${startStr} → ${endStr}</span>
        </div>`;
    }).join('');
}

function renderYogas(yogas) {
    const container = document.getElementById('yogas-list');
    if (!container) return;

    if (yogas.length === 0) {
        container.innerHTML = '<p style="color:var(--text-dim);">Nessun yoga significativo rilevato con i parametri attuali.</p>';
        return;
    }

    container.innerHTML = yogas.map(y => `
        <div class="yoga-result-item ${y.positive ? '' : 'negative'}">
            <h5>${y.positive ? '✦' : '⚠️'} ${y.name}</h5>
            <p>${y.description}</p>
        </div>
    `).join('');
}

// --- MAIN CALCULATION ---
async function calculateKundli(date, time, lat, lon, timezone) {
    const jd = dateToJulianDay(date, time, timezone);
    const year = parseInt(date.split('-')[0]);
    const ayanamsa = calculateAyanamsa(year);

    // Try VedAstro API first
    const timeStr = buildVedAstroTime(date, time, lat, lon, timezone);
    let planets = null;
    let apiSuccess = false;

    try {
        const apiUrl = `${VEDASTRO_BASE}/Calculate/AllPlanetLongitude/${timeStr}`;
        const response = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
        if (response.ok) {
            const data = await response.json();
            if (data && data.Status === "Pass" && data.Payload) {
                apiSuccess = true;
                planets = parsePlanetData(data.Payload);
            }
        }
    } catch (e) {
        console.log("VedAstro API unavailable, using local calculation:", e.message);
    }

    if (!planets) {
        planets = approximatePlanetaryPositions(jd, ayanamsa);
    }

    const ascendant = calculateAscendant(jd, lat, lon, timezone, ayanamsa);
    const ascendantRashi = getRashi(ascendant);

    const moon = planets.find(p => p.name === "Moon");
    const moonNak = getLunarNakshatra(moon.longitude);
    const dashas = calculateDasha(moonNak.index, moon.longitude, date);

    const yogas = detectYogas(planets, ascendantRashi);

    return { planets, ascendant, ascendantRashi, dashas, yogas, moonNak, apiSuccess };
}

function parsePlanetData(payload) {
    const planetMap = {
        "Sun": "Sun", "Moon": "Moon", "Mars": "Mars",
        "Mercury": "Mercury", "Jupiter": "Jupiter", "Venus": "Venus",
        "Saturn": "Saturn", "Rahu": "Rahu", "Ketu": "Ketu"
    };

    const planets = [];

    if (payload.AllPlanetLongitude) {
        for (const [key, value] of Object.entries(payload.AllPlanetLongitude)) {
            const pName = planetMap[key];
            if (pName && value && value.DegreeDecimal !== undefined) {
                planets.push({
                    name: pName,
                    longitude: value.DegreeDecimal,
                    retro: value.IsRetrograde || false
                });
            }
        }
    }

    if (planets.length < 9) return null;
    return planets;
}

// --- DATA LOADER ---
const JYOTISH_DATA = {
    rashi: null, nakshatra: null, bhava: null, graha: null,
    dasha: null, yoga: null, remedies: null,
    loaded: false
};

async function loadJyotishData() {
    try {
        const [rashi, n1, n2, n3, bhava, graha, dasha, yoga, remedies] = await Promise.all([
            fetch('data/rashi.json').then(r => r.json()),
            fetch('data/nakshatra_01_09.json').then(r => r.json()),
            fetch('data/nakshatra_10_18.json').then(r => r.json()),
            fetch('data/nakshatra_19_27.json').then(r => r.json()),
            fetch('data/bhava.json').then(r => r.json()),
            fetch('data/graha.json').then(r => r.json()),
            fetch('data/dasha.json').then(r => r.json()),
            fetch('data/yoga.json').then(r => r.json()),
            fetch('data/remedies.json').then(r => r.json())
        ]);
        JYOTISH_DATA.rashi = rashi.rashi || rashi.rashis || [];
        JYOTISH_DATA.nakshatra = [...(n1.nakshatra||n1.nakshatras||[]), ...(n2.nakshatra||n2.nakshatras||[]), ...(n3.nakshatra||n3.nakshatras||[])];
        JYOTISH_DATA.bhava = bhava.bhava || bhava.bhavas || [];
        JYOTISH_DATA.graha = graha.graha || graha.grahas || [];
        JYOTISH_DATA.dasha = dasha.mahadasha || dasha.dashas || [];
        JYOTISH_DATA.yoga = yoga.yoga || [];
        JYOTISH_DATA.dosha = yoga.dosha || {};
        JYOTISH_DATA.remedies = remedies;
        JYOTISH_DATA.loaded = true;
        console.log('Jyotish data loaded:', {
            rashi: JYOTISH_DATA.rashi.length,
            nakshatra: JYOTISH_DATA.nakshatra.length,
            bhava: JYOTISH_DATA.bhava.length,
            graha: JYOTISH_DATA.graha.length,
            dasha: JYOTISH_DATA.dasha.length
        });
    } catch (e) {
        console.warn('Could not load deep data, using fallbacks:', e);
        JYOTISH_DATA.loaded = false;
    }
}

// Helper: find data item by index/name
function findRashi(idx) {
    if (!JYOTISH_DATA.loaded || !JYOTISH_DATA.rashi.length) return null;
    return JYOTISH_DATA.rashi.find(r => r.id === idx + 1 || r.id === idx) || JYOTISH_DATA.rashi[idx] || null;
}
function findNakshatra(idx) {
    if (!JYOTISH_DATA.loaded || !JYOTISH_DATA.nakshatra.length) return null;
    return JYOTISH_DATA.nakshatra.find(n => n.id === idx + 1 || n.id === idx) || JYOTISH_DATA.nakshatra[idx] || null;
}
function findBhava(num) {
    if (!JYOTISH_DATA.loaded || !JYOTISH_DATA.bhava.length) return null;
    return JYOTISH_DATA.bhava.find(b => b.number === num) || JYOTISH_DATA.bhava[num - 1] || null;
}
function findGraha(name) {
    if (!JYOTISH_DATA.loaded || !JYOTISH_DATA.graha.length) return null;
    const variants = {
        'Sun': ['Surya', 'Sun', 'Sole'], 'Moon': ['Chandra', 'Moon', 'Luna'],
        'Mars': ['Mangala', 'Mangal', 'Mars', 'Marte'], 'Mercury': ['Budha', 'Mercury', 'Mercurio'],
        'Jupiter': ['Guru', 'Brihaspati', 'Jupiter', 'Giove'], 'Venus': ['Shukra', 'Venus', 'Venere'],
        'Saturn': ['Shani', 'Saturn', 'Saturno'], 'Rahu': ['Rahu'], 'Ketu': ['Ketu']
    };
    const candidates = variants[name] || [name];
    return JYOTISH_DATA.graha.find(g =>
        candidates.includes(g.name) || candidates.includes(g.sanskrit) || candidates.includes(g.english)
    ) || null;
}
function findDasha(name) {
    if (!JYOTISH_DATA.loaded || !JYOTISH_DATA.dasha.length) return null;
    return JYOTISH_DATA.dasha.find(d =>
        d.planet === name || d.pianeta === name ||
        (d.planet && d.planet.toLowerCase().includes(name.toLowerCase()))
    ) || null;
}

// --- INTERPRETIVE READING ENGINE ---

const RASHI_INTERPRETATIONS = {
    0: { traits: "iniziativa, coraggio, leadership, impulsività", body: "testa, viso", element: "Fuoco cardinale", lesson: "imparare la pazienza e a considerare gli altri", strength: "pioniere naturale, capace di iniziare nuovi cicli" },
    1: { traits: "stabilità, sensualità, perseveranza, possessività", body: "collo, gola", element: "Terra fissa", lesson: "rilasciare l'attaccamento e accogliere il cambiamento", strength: "costruire valore duraturo, godimento della bellezza" },
    2: { traits: "comunicazione, curiosità, dualità, versatilità", body: "spalle, braccia, polmoni", element: "Aria mutevole", lesson: "trovare profondità e radicamento dietro la versatilità", strength: "ponte tra mondi, intelletto agile" },
    3: { traits: "sensibilità, nutrimento, memoria, emotività", body: "petto, stomaco", element: "Acqua cardinale", lesson: "proteggere senza chiudersi, fluire senza affogare", strength: "intuizione profonda, capacità di accudire" },
    4: { traits: "regalità, generosità, creatività, orgoglio", body: "cuore, schiena", element: "Fuoco fisso", lesson: "umiltà autentica, servire più che dominare", strength: "magnetismo carismatico, espressione creativa" },
    5: { traits: "discernimento, servizio, perfezionismo, analisi", body: "addome, intestino", element: "Terra mutevole", lesson: "accettare l'imperfezione come parte del Tutto", strength: "competenza tecnica, dedizione al miglioramento" },
    6: { traits: "armonia, diplomazia, equilibrio, indecisione", body: "reni, parte bassa schiena", element: "Aria cardinale", lesson: "decidere senza sempre cercare il consenso", strength: "mediazione, senso di giustizia, raffinatezza" },
    7: { traits: "intensità, trasformazione, mistero, controllo", body: "organi riproduttivi", element: "Acqua fissa", lesson: "lasciare andare per rinascere", strength: "profondità psicologica, capacità rigenerativa" },
    8: { traits: "espansione, filosofia, libertà, ottimismo", body: "fianchi, cosce", element: "Fuoco mutevole", lesson: "incarnare la saggezza nel quotidiano", strength: "visione, ricerca del senso, insegnamento" },
    9: { traits: "ambizione, disciplina, responsabilità, pragmatismo", body: "ginocchia, scheletro", element: "Terra cardinale", lesson: "ammorbidire il rigore con compassione", strength: "costruire strutture durature, autorità naturale" },
    10: { traits: "originalità, innovazione, distacco, idealismo", body: "polpacci, caviglie", element: "Aria fissa", lesson: "tradurre l'idealismo in azione concreta", strength: "visione del futuro, pensiero non convenzionale" },
    11: { traits: "compassione, sogno, sensibilità, dissoluzione", body: "piedi, sistema linfatico", element: "Acqua mutevole", lesson: "ancorare la spiritualità nella vita pratica", strength: "empatia universale, accesso ai mondi sottili" }
};

const NAKSHATRA_READINGS = {
    0: "Velocità di guarigione e capacità di nuovi inizi. L'anima ha l'energia dei guaritori divini Ashwini Kumara — porta soccorso rapido. Tema vitale: usare la velocità con saggezza.",
    1: "Trasformazione attraverso il limite. Bharani contiene l'energia dell'utero (yoni) e della morte (Yama). Tema: gestire la creatività e la sessualità con maturità.",
    2: "Purificazione attraverso il fuoco. Krittika taglia l'illusione. Personalità nitida, talvolta tagliente. Tema: usare la lama del discernimento per servire, non per ferire.",
    3: "Bellezza, fertilità e desiderio. Nakshatra preferita di Krishna. Carisma naturale, sensualità terrena. Tema: equilibrio tra godimento e attaccamento.",
    4: "Curiosità e ricerca delicata. Energia del cervo che cerca. Mente esplorativa, gentilezza. Tema: trovare la propria meta interiore senza disperdersi.",
    5: "Tempesta interiore creativa. Rudra è l'urlo che purifica. Intensità emotiva e mentale. Tema: trasformare la sofferenza in arte e visione.",
    6: "Ritorno al centro dopo l'esilio. Aditi è la madre cosmica. Capacità di ricominciare. Tema: ottimismo radicato, ritrovare la luce dopo l'oscurità.",
    7: "Nutrimento e prosperità spirituale. La Nakshatra più auspiciosa per nuovi inizi. Tema: nutrire gli altri come pratica di abbondanza.",
    8: "Misticismo, ipnosi, kundalini. Energia del serpente arrotolato. Magnetismo profondo, talvolta inquietante. Tema: usare il potere occulto per elevare.",
    9: "Regalità e legame con gli antenati. Magha porta il trono dei Pitri. Tema: onorare il lignaggio, esercitare autorità con dignità.",
    10: "Piacere e creatività rilassata. Bhaga è la fortuna del godimento. Tema: equilibrare il piacere con il proposito.",
    11: "Patronato, contratti, amicizia stabile. Aryaman dona unioni durature. Tema: costruire alleanze basate su valori condivisi.",
    12: "Mani come strumento di guarigione. Savitar è la forza del Sole creativo. Tema: ciò che tocchi si trasforma — usa le mani per servire.",
    13: "Bellezza creata dall'arte cosmica. Vishwakarma costruisce mondi. Tema: creatività raffinata, occhio per il bello e l'armonioso.",
    14: "Indipendenza e flessibilità. Vayu è il vento che si muove libero. Tema: bilanciare libertà personale e radicamento.",
    15: "Determinazione assoluta verso un obiettivo. Indragni unisce fuoco e tuono. Tema: focalizzare la potenza senza diventare ossessivi.",
    16: "Devozione e amicizia profonda. Mitra porta unione e organizzazione. Tema: leadership attraverso il servizio amorevole.",
    17: "Anzianità e protezione. Indra è il re degli dei. Tema: assumere responsabilità con coraggio, anche se solitario.",
    18: "Ricerca delle radici e distruzione di ciò che è falso. Nirriti scioglie le illusioni. Tema: andare al fondo delle cose.",
    19: "Invincibilità attraverso la purificazione. Apas è l'acqua sacra. Tema: tenere fede ai valori più alti, ottenere vittoria interiore.",
    20: "Vittoria finale e leadership integra. Tema: pazienza che porta al trionfo duraturo, integrità sopra tutto.",
    21: "Ascolto e connessione cosmica. Vishnu sostiene l'universo. Tema: ricevere insegnamenti dall'ascolto profondo.",
    22: "Ricchezza, ritmo, fama. Vasus sono gli dei dell'abbondanza. Tema: musica, simmetria, fama attraverso il talento.",
    23: "Cento medicine. Varuna guarisce ciò che sembra incurabile. Tema: ricerca, mistero, capacità di sciogliere nodi profondi.",
    24: "Fuoco interiore della tapas. Aja Ekapada è l'asceta a una gamba. Tema: trasformazione attraverso disciplina spirituale intensa.",
    25: "Profondità cosmica e kundalini. Ahir Budhnya è il serpente delle profondità. Tema: saggezza dei fondali oceanici dell'inconscio.",
    26: "Nutrimento, viaggio, completamento. Pushan protegge i viandanti. Tema: condurre gli altri a destinazione con cura."
};

const HOUSE_READINGS = [
    { name: "Tanu Bhava (Sé)", deep: "Come ti presenti al mondo, il corpo, la vitalità, l'inizio di ogni cosa." },
    { name: "Dhana Bhava (Ricchezza)", deep: "La tua relazione con risorse, parola, famiglia di origine, valori personali." },
    { name: "Sahaja Bhava (Sforzi)", deep: "Coraggio, fratelli, comunicazione, tutto ciò che richiede iniziativa propria." },
    { name: "Sukha Bhava (Felicità)", deep: "Madre, casa, fondamenta emotive, terra, comfort interiore. La radice della pace." },
    { name: "Putra Bhava (Merito)", deep: "Figli, intelligenza, creatività, romanticismo, e — cruciale — il merito accumulato in vite passate (purva punya)." },
    { name: "Ripu Bhava (Ostacoli)", deep: "Nemici, malattie, debiti, servizio, lavoro quotidiano. Dove devi conquistare." },
    { name: "Kalatra Bhava (Coniuge)", deep: "Partner, matrimonio, partnership pubbliche, ciò che incontri come 'altro'." },
    { name: "Ayu Bhava (Trasformazione)", deep: "Longevità, eredità, occulto, traumi, sessualità profonda. La porta della morte e rinascita." },
    { name: "Dharma Bhava (Fortuna)", deep: "Padre, guru, viaggi lunghi, filosofia, fortuna karmica, ciò che ti guida verso il significato." },
    { name: "Karma Bhava (Carriera)", deep: "Reputazione pubblica, professione, posizione sociale, le tue azioni più visibili." },
    { name: "Labha Bhava (Guadagni)", deep: "Amici, network, aspirazioni, guadagni, fratelli maggiori. Dove la rete sostiene il sogno." },
    { name: "Vyaya Bhava (Liberazione)", deep: "Perdite, spese, isolamento, terre lontane, sonno, moksha. Il preludio alla nuova alba." }
];

const PLANET_INTERPRETATIONS = {
    "Sun": { core: "il Sé, l'anima (atman), il padre, l'autorità, la vitalità", strong: "leadership naturale, integrità, salute robusta", weak: "ego ferito, problemi con figure paterne, vitalità bassa" },
    "Moon": { core: "la mente (manas), la madre, le emozioni, il subconscio, il pubblico", strong: "stabilità emotiva, intuizione, popolarità, memoria", weak: "instabilità mentale, ansia, difficoltà materne" },
    "Mars": { core: "energia, coraggio, fratelli, terra, conflitto, sangue", strong: "coraggio, capacità di azione, atletismo, leadership militare/imprenditoriale", weak: "rabbia incontrollata, conflitti, infortuni, impulsività" },
    "Mercury": { core: "intelletto, comunicazione, commercio, educazione, abilità tecniche", strong: "eloquenza, intelligenza analitica, successo negli scambi", weak: "confusione mentale, difficoltà di comunicazione, doppiezza" },
    "Jupiter": { core: "saggezza, dharma, guru, figli, espansione, fortuna", strong: "saggezza, ricchezza, prole sana, fortuna spirituale, riconoscimento", weak: "eccessi, dogmatismo, difficoltà con figli o insegnanti" },
    "Venus": { core: "amore, matrimonio, arte, lusso, veicoli, comfort, creatività", strong: "armonia relazionale, talento artistico, prosperità, bellezza", weak: "delusioni amorose, eccessi sensuali, problemi di gusto" },
    "Saturn": { core: "disciplina, longevità, karma, ritardi, servitù, vecchiaia", strong: "perseveranza, autorità duratura, integrità sotto pressione", weak: "depressione, isolamento, ostacoli cronici, paure" },
    "Rahu": { core: "ossessione, illusione, materia, tecnologia, stranieri, desideri amplificati", strong: "successo materiale, capacità di rompere convenzioni, accesso a nuovi mondi", weak: "dipendenze, illusioni, ambizione divorante" },
    "Ketu": { core: "liberazione, distacco, vite passate, misticismo, perdite", strong: "intuizione spirituale, capacità di lasciar andare, accesso a saperi profondi", weak: "isolamento, perdite improvvise, scollamento dalla realtà" }
};

const DASHA_INTERPRETATIONS = {
    "Sole": "Periodo di centratura nell'autorità, focus sul Sé e sull'identità. Tempo di leadership, riconoscimento o difficoltà con figure di autorità. Forza vitale al centro.",
    "Luna": "Periodo emotivo, lunare, ciclico. Casa, madre, pubblico, fluidità. Adatto per nutrire relazioni intime e sviluppare la sensibilità. Possibili oscillazioni emotive.",
    "Marte": "Periodo di azione, conflitto creativo, energia. Progetti che richiedono coraggio. Possibili scontri, infortuni o invece grandi conquiste se l'energia è ben canalizzata.",
    "Mercurio": "Periodo intellettuale, di comunicazione, commercio, viaggi brevi. Ottimo per studio, scrittura, scambi. Mente molto attiva — serve disciplinarla.",
    "Giove": "Periodo di espansione, saggezza, fortuna, dharma. Spesso il più benefico. Studi superiori, figli, riconoscimento spirituale. Tempo di crescita autentica.",
    "Venere": "Periodo di amore, arte, lusso, relazioni. Matrimonio, romanticismo, creatività estetica. Attenzione agli eccessi e alle illusioni del piacere.",
    "Saturno": "Periodo lungo (19 anni) di responsabilità, disciplina, fatica costruttiva. Risultati tardivi ma duraturi. Test del karma. Ciò che è solido resterà.",
    "Rahu": "Periodo lungo (18 anni) di ambizione amplificata, desideri intensi, capacità di rompere schemi. Successo mondano ma rischio di illusione. Direzione: nuovi territori.",
    "Ketu": "Periodo di distacco, spiritualità, possibili perdite materiali. Tempo per lasciar andare e ricevere intuizioni dall'altrove. Direzione: interiorità."
};

function generateReading(result, birthData) {
    // If deep data is loaded, use the rich generator
    if (JYOTISH_DATA.loaded) {
        return generateDeepReading(result, birthData);
    }
    return generateBasicReading(result, birthData);
}

function generateBasicReading(result, birthData) {
    const ascRashi = result.ascendantRashi;
    const moon = result.planets.find(p => p.name === 'Moon');
    const sun = result.planets.find(p => p.name === 'Sun');
    const moonRashi = getRashi(moon.longitude);
    const sunRashi = getRashi(sun.longitude);
    const moonNakIdx = result.moonNak.index;

    const ascData = RASHI_INTERPRETATIONS[ascRashi];
    const moonData = RASHI_INTERPRETATIONS[moonRashi];
    const sunData = RASHI_INTERPRETATIONS[sunRashi];
    const nakReading = NAKSHATRA_READINGS[moonNakIdx];

    const now = new Date();
    const activeDasha = result.dashas.find(d => now >= d.start && now < d.end);
    const dashaInterp = activeDasha ? DASHA_INTERPRETATIONS[activeDasha.planet] : null;

    const sections = [];

    // INTRO
    sections.push({
        type: 'intro',
        content: `Una lettura del Kundli vedico legge il momento di nascita come una mappa di tendenze karmiche. Non è destino fisso — è il terreno su cui crescerai. Le scelte consapevoli, il dharma e le pratiche spirituali (kriya, mantra, donazioni, gemme) possono modulare ogni influenza planetaria. Questa è la prospettiva di Sri Yukteswar e Yogananda: i pianeti sono indicatori, non cause.`
    });

    // ASCENDANT
    sections.push({
        icon: "🌅",
        title: "Ascendente — Lagna",
        rashi: RASHIS[ascRashi],
        text: `Il tuo Ascendente in <span class="highlight">${RASHIS[ascRashi].name} (${RASHIS[ascRashi].western})</span> definisce <span class="key">come ti presenti al mondo</span>, il tuo corpo fisico e l'inizio di ogni nuovo ciclo. È l'involucro attraverso cui l'anima si manifesta in questa vita.\n\n` +
            `Tratti dominanti: <em>${ascData.traits}</em>.\n\n` +
            `<span class="key">Forza:</span> ${ascData.strength}.\n\n` +
            `<span class="key">Lezione karmica:</span> ${ascData.lesson}.\n\n` +
            `Zona del corpo da curare: ${ascData.body}. Elemento: ${ascData.element}.`
    });

    // MOON
    sections.push({
        icon: "🌙",
        title: "Luna — Mente ed Emozioni (Rashi)",
        rashi: RASHIS[moonRashi],
        text: `La tua Luna in <span class="highlight">${RASHIS[moonRashi].name}</span> rivela <span class="key">la natura della tua mente, le emozioni profonde e il rapporto con la madre</span>. Nel Jyotish, il segno lunare è considerato spesso più importante del segno solare per descrivere chi sei davvero.\n\n` +
            `La tua mente opera attraverso: <em>${moonData.traits}</em>.\n\n` +
            `<span class="key">Forza emotiva:</span> ${moonData.strength}.\n\n` +
            `<span class="key">Apprendimento dell'anima:</span> ${moonData.lesson}.`
    });

    // NAKSHATRA
    sections.push({
        icon: "✨",
        title: `Janma Nakshatra — ${NAKSHATRAS[moonNakIdx].name} (Pada ${result.moonNak.pada})`,
        text: `${nakReading}\n\n` +
            `<span class="key">Divinità della Nakshatra:</span> ${NAKSHATRAS[moonNakIdx].deity}\n` +
            `<span class="key">Simbolo:</span> ${NAKSHATRAS[moonNakIdx].symbol}\n` +
            `<span class="key">Signore planetario:</span> ${NAKSHATRAS[moonNakIdx].ruler}\n\n` +
            `La Janma Nakshatra è l'indicatore più intimo del tuo Kundli — rivela il <span class="highlight">filo conduttore karmico</span> di questa incarnazione e determina l'intero ciclo Vimshottari Dasha.`
    });

    // SUN
    sections.push({
        icon: "☉",
        title: "Sole — Anima e Padre",
        rashi: RASHIS[sunRashi],
        text: `Il Sole in <span class="highlight">${RASHIS[sunRashi].name}</span> rappresenta <span class="key">la tua essenza spirituale (atman), l'autorità e il rapporto con la figura paterna</span>.\n\n` +
            `Espressione solare: <em>${sunData.traits}</em>.\n\n` +
            `<span class="key">Espressione luminosa:</span> ${sunData.strength}.`
    });

    // ACTIVE DASHA
    if (activeDasha && dashaInterp) {
        const yearsLeft = ((activeDasha.end - now) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
        sections.push({
            icon: "⏳",
            title: `Mahadasha Attiva — ${activeDasha.planet}`,
            text: `Stai attraversando il <span class="highlight">Mahadasha di ${activeDasha.planet}</span>, iniziato il ${activeDasha.start.toLocaleDateString('it-IT')} e che terminerà il ${activeDasha.end.toLocaleDateString('it-IT')} (mancano circa ${yearsLeft} anni).\n\n` +
                `${dashaInterp}\n\n` +
                `<span class="key">Raccomandazione pratica:</span> osserva quali aree della vita sono particolarmente attive ora — sono il "campo di prova" che il karma sta presentando. Le scelte fatte in questo periodo creeranno semi per il prossimo Dasha.`
        });
    }

    // YOGAS
    if (result.yogas.length > 0) {
        const positive = result.yogas.filter(y => y.positive);
        const challenges = result.yogas.filter(y => !y.positive);

        let yogaText = '';
        if (positive.length > 0) {
            yogaText += `<span class="key">Combinazioni favorevoli rilevate:</span>\n`;
            positive.forEach(y => {
                yogaText += `• <span class="highlight">${y.name}</span>: ${y.description}\n`;
            });
        }
        if (challenges.length > 0) {
            yogaText += `\n<span class="key">Aree di attenzione (dosha):</span>\n`;
            challenges.forEach(y => {
                yogaText += `• <span class="highlight">${y.name}</span>: ${y.description}\n`;
            });
            yogaText += `\nI dosha non sono "maledizioni" — sono <em>tensioni karmiche</em> che richiedono consapevolezza e pratiche specifiche (mantra, puja, gemme, donazioni). Il libero arbitrio resta sovrano.`;
        }

        sections.push({
            icon: "🔗",
            title: "Yoga e Combinazioni Significative",
            text: yogaText
        });
    }

    // HOUSES SUMMARY (top 3 strongest)
    const planetCounts = {};
    result.planets.forEach(p => {
        const houseFromAsc = ((getRashi(p.longitude) - ascRashi) + 12) % 12;
        planetCounts[houseFromAsc] = (planetCounts[houseFromAsc] || 0) + 1;
    });

    const strongHouses = Object.entries(planetCounts)
        .sort((a,b) => b[1] - a[1])
        .filter(([_, c]) => c >= 2)
        .slice(0, 3);

    if (strongHouses.length > 0) {
        let housesText = `Le aree della vita più "popolate" da pianeti — quindi più attive nel tuo karma:\n\n`;
        strongHouses.forEach(([h, count]) => {
            const idx = parseInt(h);
            housesText += `<span class="key">${HOUSE_READINGS[idx].name}</span> (${count} pianeti): ${HOUSE_READINGS[idx].deep}\n\n`;
        });
        sections.push({
            icon: "🏠",
            title: "Case Karmicamente Attive",
            text: housesText
        });
    }

    // CLOSING
    sections.push({
        type: 'closing',
        content: `Ricorda: <em>"Un uomo saggio domina le stelle"</em> — ogni configurazione planetaria è un'opportunità di crescita. La pratica spirituale (meditazione, kriya yoga, mantra, donazioni, servizio) può modulare anche i transiti più difficili. Per un'analisi professionale completa, consulta un Jyotishi qualificato.`
    });

    return sections;
}

// === DEEP READING (uses rich JSON data) ===
function generateDeepReading(result, birthData) {
    const sections = [];
    const ascRashi = result.ascendantRashi;
    const moon = result.planets.find(p => p.name === 'Moon');
    const sun = result.planets.find(p => p.name === 'Sun');
    const moonRashi = getRashi(moon.longitude);
    const sunRashi = getRashi(sun.longitude);
    const moonNakIdx = result.moonNak.index;

    const ascData = findRashi(ascRashi);
    const moonRashiData = findRashi(moonRashi);
    const sunRashiData = findRashi(sunRashi);
    const nakData = findNakshatra(moonNakIdx);

    // 1. INTRODUZIONE
    sections.push({
        type: 'intro',
        content: `Questa è una lettura vedica approfondita della tua carta natale. Il Jyotish — la "scienza della luce" — interpreta il momento esatto della nascita come una mappa delle tendenze karmiche che ti accompagnano. Non è destino fisso: è il terreno su cui crescerai. Le scelte consapevoli, la pratica spirituale (mantra, meditazione, kriya), le donazioni e le gemme possono modulare ogni influenza planetaria. Come insegnano Sri Yukteswar e Yogananda nell'Autobiografia di uno Yogi, i pianeti sono <em>indicatori</em> del karma accumulato, non sue cause assolute. La lettura che segue integra le fonti classiche (Brihat Parashara Hora Shastra, Saravali, Phaladeepika) con la psicologia moderna e la prospettiva ayurvedica.`
    });

    // 2. LAGNA — APPROFONDIMENTO
    if (ascData) {
        const text = `<h5>Il segno che sorgeva all'orizzonte al tuo primo respiro</h5>
<p><span class="key">Elemento:</span> ${ascData.elemento || ascData.element || '-'} | <span class="key">Modalità:</span> ${ascData.modalita || '-'} | <span class="key">Signore:</span> ${ascData.signore || '-'}</p>

<h5>Psicologia profonda</h5>
<p>${ascData.psicologia_profonda || ascData.psychology || ''}</p>

<h5>Aspetto fisico</h5>
<p>${ascData.aspetto_fisico || ascData.physicalAppearance || ''}</p>

<h5>Forza nascosta</h5>
<p>${ascData.forza_nascosta || ascData.hiddenStrength || ''}</p>

<h5>Ombra da integrare</h5>
<p>${ascData.ombra_da_integrare || ascData.shadowToIntegrate || ''}</p>

<h5>Lezione spirituale</h5>
<p>${ascData.lezione_spirituale || ascData.spiritualLesson || ''}</p>`;

        sections.push({
            icon: "🌅",
            title: `Lagna (Ascendente) — ${ascData.nome || RASHIS[ascRashi].name} / ${ascData.italiano || RASHIS[ascRashi].western}`,
            text
        });
    }

    // 3. LUNA IN RASHI — APPROFONDIMENTO
    if (moonRashiData) {
        const text = `<h5>La tua mente, le tue emozioni, il tuo rapporto con la madre</h5>
<p>Nel Jyotish la Luna è considerata spesso più importante del Sole per descrivere chi sei davvero, perché governa la <em>manas</em> (mente emotiva) e la natura più intima.</p>

<h5>Psicologia lunare</h5>
<p>${moonRashiData.psicologia_profonda || moonRashiData.psychology || ''}</p>

<h5>Vita relazionale</h5>
<p>${moonRashiData.vita_relazionale || moonRashiData.relationships || ''}</p>

<h5>Salute (zone del corpo, dosha ayurvedico)</h5>
<p>${moonRashiData.salute || moonRashiData.health || ''}</p>`;

        sections.push({
            icon: "🌙",
            title: `Luna in ${moonRashiData.nome || RASHIS[moonRashi].name} — Janma Rashi`,
            text
        });
    }

    // 4. NAKSHATRA — APPROFONDIMENTO
    if (nakData) {
        const padaInfo = nakData.padas && nakData.padas[result.moonNak.pada - 1];
        const padaText = padaInfo ?
            `<h5>Pada ${result.moonNak.pada} (il quarto specifico della Nakshatra in cui è la tua Luna)</h5>
<p>${padaInfo.descrizione || padaInfo.description || padaInfo.testo || JSON.stringify(padaInfo)}</p>` : '';

        const classifications = nakData.classifications || nakData.classificazioni || {};
        const classText = Object.keys(classifications).length > 0 ?
            `<h5>Classificazioni vediche</h5><p>` +
            Object.entries(classifications).map(([k, v]) =>
                `<span class="key">${k.charAt(0).toUpperCase() + k.slice(1)}:</span> ${v}`
            ).join(' | ') + `</p>` : '';

        const text = `<h5>Mito vedico</h5>
<p>${nakData.mito || nakData.myth || ''}</p>

<h5>Shakti — il potere specifico</h5>
<p>${nakData.shakti || ''}</p>

<h5>La tua personalità lunare profonda</h5>
<p>${nakData.personality || nakData.personalita || ''}</p>

<h5>Tema karmico centrale</h5>
<p>${nakData.karmicTheme || nakData.tema_karmico || ''}</p>

${padaText}

${classText}

<h5>Carriera e dharma</h5>
<p>${nakData.career || nakData.carriera || ''}</p>

<h5>Relazioni</h5>
<p>${nakData.relationships || nakData.relazioni || ''}</p>

<h5>Salute</h5>
<p>${nakData.health || nakData.salute || ''}</p>`;

        sections.push({
            icon: "✨",
            title: `Janma Nakshatra — ${nakData.nome || nakData.name || NAKSHATRAS[moonNakIdx].name}`,
            text
        });
    }

    // 5. SOLE — più conciso
    if (sunRashiData) {
        const text = `<h5>L'anima (atman), l'autorità, il rapporto con il padre</h5>
<p>${sunRashiData.psicologia_profonda?.substring(0, 600) + '...' || sunRashiData.psychology || ''}</p>

<h5>Carriera (espressione solare)</h5>
<p>${sunRashiData.carriera_dharma?.substring(0, 500) + '...' || sunRashiData.career || ''}</p>`;

        sections.push({
            icon: "☉",
            title: `Sole in ${sunRashiData.nome || RASHIS[sunRashi].name}`,
            text
        });
    }

    // 6. PIANETI NELLE CASE (analisi pianeta per pianeta)
    const planetSections = [];
    result.planets.forEach(p => {
        const grahaData = findGraha(p.name);
        if (!grahaData) return;
        const houseFromAsc = ((getRashi(p.longitude) - ascRashi) + 12) % 12 + 1; // 1-12
        const inHouseDesc = grahaData.inHouses?.[String(houseFromAsc)] || grahaData.in_houses?.[String(houseFromAsc)];
        if (!inHouseDesc) return;

        const planetName = PLANET_NAMES_IT[p.name] || p.name;
        const symbol = PLANET_SYMBOLS[p.name] || '';
        const rashiName = RASHIS[getRashi(p.longitude)].name;

        planetSections.push(`<div class="planet-block">
            <h5>${symbol} ${planetName} in ${houseFromAsc}ª casa (${rashiName})${p.retro ? ' — ℞' : ''}</h5>
            <p>${inHouseDesc}</p>
        </div>`);
    });

    if (planetSections.length > 0) {
        sections.push({
            icon: "🪐",
            title: "Pianeti nelle Case del tuo Kundli",
            text: `<p>Ogni pianeta, secondo la casa in cui si trova al momento della nascita, attiva specifiche aree della vita. Ecco come ciascun Graha si manifesta nella tua mappa:</p>` +
                planetSections.join('')
        });
    }

    // 7. MAHADASHA ATTIVA — APPROFONDIMENTO
    const now = new Date();
    const activeDasha = result.dashas.find(d => now >= d.start && now < d.end);
    if (activeDasha) {
        const dashaData = findDasha(activeDasha.planet);
        const yearsLeft = ((activeDasha.end - now) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);

        let text = `<p>Stai attraversando il <span class="highlight">Mahadasha di ${activeDasha.planet}</span>, iniziato il ${activeDasha.start.toLocaleDateString('it-IT')} e che terminerà il ${activeDasha.end.toLocaleDateString('it-IT')} (mancano circa ${yearsLeft} anni).</p>`;

        if (dashaData) {
            text += `<h5>Panoramica del periodo</h5>
<p>${dashaData.overview || dashaData.descrizione || ''}</p>`;

            if (dashaData.lifeAreasActive || dashaData.aree_vita_attive) {
                const areas = dashaData.lifeAreasActive || dashaData.aree_vita_attive;
                text += `<h5>Aree della vita attive ora</h5>
<p>${Array.isArray(areas) ? areas.join(' • ') : areas}</p>`;
            }

            if (dashaData.karmicTest || dashaData.test_karmico) {
                text += `<h5>Test karmico tipico</h5>
<p>${dashaData.karmicTest || dashaData.test_karmico}</p>`;
            }

            if (dashaData.doList || dashaData.fare) {
                const list = dashaData.doList || dashaData.fare;
                text += `<h5>Cosa coltivare</h5>
<ul>` + (Array.isArray(list) ? list : [list]).map(i => `<li>${i}</li>`).join('') + `</ul>`;
            }

            if (dashaData.avoidList || dashaData.evitare) {
                const list = dashaData.avoidList || dashaData.evitare;
                text += `<h5>Cosa evitare</h5>
<ul>` + (Array.isArray(list) ? list : [list]).map(i => `<li>${i}</li>`).join('') + `</ul>`;
            }

            if (dashaData.spiritualPractices || dashaData.pratiche_spirituali) {
                text += `<h5>Pratiche spirituali consigliate</h5>
<p>${dashaData.spiritualPractices || dashaData.pratiche_spirituali}</p>`;
            }
        }

        sections.push({
            icon: "⏳",
            title: `Mahadasha Attiva — ${activeDasha.planet}`,
            text
        });
    }

    // 8. CASE PIÙ ATTIVE
    const planetCounts = {};
    result.planets.forEach(p => {
        const houseFromAsc = ((getRashi(p.longitude) - ascRashi) + 12) % 12 + 1;
        planetCounts[houseFromAsc] = (planetCounts[houseFromAsc] || 0) + 1;
    });
    const strongHouses = Object.entries(planetCounts).sort((a,b) => b[1] - a[1]).filter(([_,c]) => c >= 2).slice(0, 4);

    if (strongHouses.length > 0) {
        let text = `<p>Le aree della vita più "popolate" da pianeti — quindi più attive nel tuo karma:</p>`;
        strongHouses.forEach(([h, count]) => {
            const num = parseInt(h);
            const bhavaData = findBhava(num);
            if (bhavaData) {
                text += `<div class="planet-block">
                    <h5>${num}ª — ${bhavaData.sanskrit} / ${bhavaData.name} (${count} pianeti)</h5>
                    <p><span class="key">Significazioni primarie:</span> ${Array.isArray(bhavaData.primaryMeanings) ? bhavaData.primaryMeanings.join(', ') : bhavaData.primaryMeanings}</p>
                    <p><span class="key">Karaka (significatore):</span> ${typeof bhavaData.karaka === 'object' ? bhavaData.karaka.pianeta || bhavaData.karaka.planet : bhavaData.karaka}</p>
                    <p>${bhavaData.secondaryMeanings ? (Array.isArray(bhavaData.secondaryMeanings) ? bhavaData.secondaryMeanings.join('. ') : bhavaData.secondaryMeanings) : ''}</p>
                </div>`;
            }
        });
        sections.push({
            icon: "🏠",
            title: "Case Karmicamente Attive",
            text
        });
    }

    // 9. YOGA E DOSHA
    if (result.yogas.length > 0) {
        const positive = result.yogas.filter(y => y.positive);
        const challenges = result.yogas.filter(y => !y.positive);
        let text = '';
        if (positive.length > 0) {
            text += `<h5>Combinazioni favorevoli rilevate</h5>`;
            positive.forEach(y => {
                text += `<div class="planet-block"><strong>${y.name}</strong><p>${y.description}</p></div>`;
            });
        }
        if (challenges.length > 0) {
            text += `<h5 style="margin-top:1rem;">Aree di attenzione</h5>`;
            challenges.forEach(y => {
                text += `<div class="planet-block warning"><strong>${y.name}</strong><p>${y.description}</p></div>`;
            });
            text += `<p><em>I dosha non sono "maledizioni": sono tensioni karmiche che richiedono consapevolezza. Mantra, puja, gemme, donazioni e disciplina spirituale modulano il loro effetto. Il libero arbitrio resta sovrano.</em></p>`;
        }

        sections.push({
            icon: "🔗",
            title: "Yoga e Combinazioni Significative",
            text
        });
    }

    // 10. RIMEDI CONSOLIDATI
    if (ascData?.rimedi) {
        const r = ascData.rimedi;
        let text = `<p>I rimedi vedici tradizionali per il tuo Lagna (${ascData.nome || RASHIS[ascRashi].name}):</p>
<table style="width:100%; border-collapse:collapse; margin-top:0.5rem;">
<tr><td style="padding:6px; color:var(--gold-light); width:140px;">Mantra</td><td style="padding:6px;">${r.mantra || ''}</td></tr>
<tr><td style="padding:6px; color:var(--gold-light);">Divinità</td><td style="padding:6px;">${r.divinita || ''}</td></tr>
<tr><td style="padding:6px; color:var(--gold-light);">Gemma</td><td style="padding:6px;">${r.gemma || ''}</td></tr>
<tr><td style="padding:6px; color:var(--gold-light);">Yantra</td><td style="padding:6px;">${r.yantra || ''}</td></tr>
<tr><td style="padding:6px; color:var(--gold-light);">Colore</td><td style="padding:6px;">${r.colore || ''}</td></tr>
<tr><td style="padding:6px; color:var(--gold-light);">Giorno</td><td style="padding:6px;">${r.giorno || ''}</td></tr>
<tr><td style="padding:6px; color:var(--gold-light);">Donazione</td><td style="padding:6px;">${r.donazione || ''}</td></tr>
</table>`;

        if (nakData?.remedies) {
            const nr = nakData.remedies;
            text += `<h5 style="margin-top:1.5rem;">Rimedi specifici per la tua Janma Nakshatra (${nakData.nome || nakData.name})</h5>
<p><span class="key">Mantra:</span> ${nr.mantra || ''}<br>
<span class="key">Divinità:</span> ${nr.deity || nr.divinita || ''}<br>
<span class="key">Gemma:</span> ${nr.gemstone || nr.gemma || ''}<br>
<span class="key">Donazione:</span> ${nr.donation || nr.donazione || ''}</p>`;
        }

        sections.push({
            icon: "🕉",
            title: "Rimedi Vedici Personalizzati",
            text
        });
    }

    // 11. PERSONAGGI FAMOSI
    if (ascData?.personaggi_famosi || ascData?.famousFigures || nakData?.famousFigures) {
        const ascF = ascData?.personaggi_famosi || ascData?.famousFigures || [];
        const nakF = nakData?.famousFigures || [];

        let text = `<p>Persone note nate con configurazioni simili alla tua:</p>`;
        if (ascF.length > 0) {
            text += `<h5>Lagna ${ascData.nome || RASHIS[ascRashi].name}</h5>
<p>${(Array.isArray(ascF) ? ascF : [ascF]).join(' · ')}</p>`;
        }
        if (nakF.length > 0) {
            text += `<h5>Janma Nakshatra ${nakData.nome || nakData.name}</h5>
<p>${(Array.isArray(nakF) ? nakF : [nakF]).join(' · ')}</p>`;
        }

        sections.push({
            icon: "🌟",
            title: "Persone con Configurazioni Simili",
            text
        });
    }

    // CONCLUSIONE
    sections.push({
        type: 'closing',
        content: `<em>"Un uomo saggio domina le stelle"</em>: ogni configurazione planetaria è un'opportunità di crescita. La pratica spirituale — meditazione, Kriya Yoga, mantra, donazioni, servizio (seva) — può modulare anche i transiti più severi. Per un'analisi completa di transiti, divisional charts (Navamsa, Dasamsa) e antardasha specifiche, consulta un Jyotishi qualificato. Questa lettura è uno specchio: usalo per vedere meglio, non per inchiodarti a un'immagine fissa.`
    });

    return sections;
}

function renderReading(result, birthData) {
    const container = document.getElementById('reading-content');
    if (!container) return;

    const sections = generateReading(result, birthData);
    let html = '';

    sections.forEach(s => {
        if (s.type === 'intro' || s.type === 'closing') {
            html += `<div class="reading-intro">
                ${s.type === 'intro' ? '<h3>Lettura Personalizzata del Kundli</h3>' : '<h3>Conclusione</h3>'}
                <p>${s.content}</p>
            </div>`;
        } else {
            const text = s.text.replace(/\n/g, '<br>');
            html += `<div class="reading-section">
                <h4><span class="icon">${s.icon}</span> ${s.title}</h4>
                <p>${text}</p>
            </div>`;
        }
    });

    container.innerHTML = html;
}

// --- PDF GENERATION ---
let lastKundliResult = null;
let lastBirthData = null;

function generatePDF() {
    if (!lastKundliResult || !lastBirthData) {
        alert('Genera prima un Kundli per scaricare il PDF.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    const GOLD = [212, 175, 55];
    const VIOLET = [124, 58, 237];
    const DARK = [30, 27, 75];
    const TEXT = [40, 40, 50];
    const DIM = [110, 110, 130];

    // === COVER PAGE ===
    doc.setFillColor(...DARK);
    doc.rect(0, 0, pageW, 60, 'F');

    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('Jyotish Vidya', pageW/2, 25, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(230, 230, 240);
    doc.text('Report Kundli — Carta Natale Vedica', pageW/2, 36, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(180, 180, 200);
    doc.text('La Scienza della Luce', pageW/2, 44, { align: 'center' });

    y = 75;

    // Birth data box
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, pageW - 2*margin, 45, 3, 3, 'S');

    doc.setFontSize(11);
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.text('DATI DI NASCITA', margin + 5, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...TEXT);

    const [yyyy, mm, dd] = lastBirthData.date.split('-');
    const dateStr = `${dd}/${mm}/${yyyy}`;

    let by = y + 16;
    doc.text(`Data:`, margin + 5, by);
    doc.setFont('helvetica', 'bold');
    doc.text(dateStr, margin + 30, by);

    doc.setFont('helvetica', 'normal');
    doc.text(`Ora:`, margin + 80, by);
    doc.setFont('helvetica', 'bold');
    doc.text(lastBirthData.time, margin + 95, by);

    by += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Luogo:`, margin + 5, by);
    doc.setFont('helvetica', 'bold');
    doc.text(lastBirthData.city || `${lastBirthData.lat}, ${lastBirthData.lon}`, margin + 30, by);

    by += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Coordinate:`, margin + 5, by);
    doc.setFont('helvetica', 'bold');
    doc.text(`${lastBirthData.lat}°, ${lastBirthData.lon}°`, margin + 30, by);

    doc.setFont('helvetica', 'normal');
    doc.text(`Fuso:`, margin + 80, by);
    doc.setFont('helvetica', 'bold');
    doc.text(`UTC${lastBirthData.timezone >= 0 ? '+' : ''}${lastBirthData.timezone}`, margin + 95, by);

    y += 55;

    // === ASCENDANT & MOON SECTION ===
    const ascRashi = RASHIS[lastKundliResult.ascendantRashi];
    const moonPlanet = lastKundliResult.planets.find(p => p.name === 'Moon');
    const moonRashi = RASHIS[getRashi(moonPlanet.longitude)];
    const moonNak = NAKSHATRAS[lastKundliResult.moonNak.index];
    const sunPlanet = lastKundliResult.planets.find(p => p.name === 'Sun');
    const sunRashi = RASHIS[getRashi(sunPlanet.longitude)];

    doc.setFontSize(13);
    doc.setTextColor(...VIOLET);
    doc.setFont('helvetica', 'bold');
    doc.text('I TRE PILASTRI', margin, y);
    y += 6;

    const pillars = [
        { label: 'Ascendente (Lagna)', value: `${ascRashi.name} (${ascRashi.western})` },
        { label: 'Segno Lunare (Rashi)', value: `${moonRashi.name} (${moonRashi.western})` },
        { label: 'Nakshatra Lunare', value: `${moonNak.name} — Pada ${lastKundliResult.moonNak.pada}` },
        { label: 'Segno Solare', value: `${sunRashi.name} (${sunRashi.western})` }
    ];

    doc.autoTable({
        startY: y,
        head: [['Elemento', 'Valore']],
        body: pillars.map(p => [p.label, p.value]),
        theme: 'grid',
        headStyles: { fillColor: VIOLET, textColor: 255, fontStyle: 'bold', fontSize: 10 },
        bodyStyles: { fontSize: 10, textColor: TEXT },
        styles: { cellPadding: 3 },
        margin: { left: margin, right: margin }
    });

    y = doc.lastAutoTable.finalY + 10;

    // === PLANETARY POSITIONS ===
    doc.setFontSize(13);
    doc.setTextColor(...VIOLET);
    doc.setFont('helvetica', 'bold');
    doc.text('POSIZIONI PLANETARIE (9 GRAHA)', margin, y);
    y += 4;

    const planetRows = lastKundliResult.planets.map(p => {
        const r = getRashi(p.longitude);
        const deg = formatDegrees(getDegreesInSign(p.longitude));
        const nak = getLunarNakshatra(p.longitude);
        return [
            PLANET_NAMES_IT[p.name] || p.name,
            `${RASHIS[r].name} (${RASHIS[r].western})`,
            deg,
            NAKSHATRAS[nak.index]?.name || '-',
            String(nak.pada),
            p.retro ? 'R' : '-'
        ];
    });

    doc.autoTable({
        startY: y,
        head: [['Graha', 'Rashi', 'Gradi', 'Nakshatra', 'Pada', 'Retro']],
        body: planetRows,
        theme: 'striped',
        headStyles: { fillColor: VIOLET, textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9, textColor: TEXT },
        styles: { cellPadding: 2 },
        margin: { left: margin, right: margin }
    });

    y = doc.lastAutoTable.finalY + 10;

    // === HOUSES ===
    if (y > pageH - 80) { doc.addPage(); y = margin; }

    doc.setFontSize(13);
    doc.setTextColor(...VIOLET);
    doc.setFont('helvetica', 'bold');
    doc.text('LE 12 BHAVA (CASE)', margin, y);
    y += 4;

    const houseNames = ['Lagna','Dhana','Sahaja','Sukha','Putra','Ripu','Kalatra','Ayu','Dharma','Karma','Labha','Vyaya'];
    const houseRows = Array.from({length: 12}, (_, i) => {
        const rashiIdx = (lastKundliResult.ascendantRashi + i) % 12;
        const r = RASHIS[rashiIdx];
        return [`${i+1}ª (${houseNames[i]})`, `${r.name} (${r.western})`, r.ruler, HOUSE_DOMAINS[i]];
    });

    doc.autoTable({
        startY: y,
        head: [['Bhava', 'Rashi', 'Signore', 'Dominio']],
        body: houseRows,
        theme: 'striped',
        headStyles: { fillColor: VIOLET, textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8.5, textColor: TEXT },
        styles: { cellPadding: 2 },
        columnStyles: { 3: { cellWidth: 70 } },
        margin: { left: margin, right: margin }
    });

    // === NAKSHATRA DETAIL ===
    doc.addPage();
    y = margin;

    doc.setFontSize(13);
    doc.setTextColor(...VIOLET);
    doc.setFont('helvetica', 'bold');
    doc.text('JANMA NAKSHATRA — Dettaglio', margin, y);
    y += 8;

    doc.setFillColor(248, 245, 255);
    doc.roundedRect(margin, y, pageW - 2*margin, 60, 3, 3, 'F');
    doc.setDrawColor(...GOLD);
    doc.roundedRect(margin, y, pageW - 2*margin, 60, 3, 3, 'S');

    let ny = y + 8;
    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    doc.text(`${moonNak.name} — Pada ${lastKundliResult.moonNak.pada}`, margin + 5, ny);

    ny += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT);

    const nakDetails = [
        ['Posizione', moonNak.degrees],
        ['Signore', moonNak.ruler],
        ['Divinità', moonNak.deity],
        ['Simbolo', moonNak.symbol],
        ['Natura', moonNak.nature]
    ];

    nakDetails.forEach(([k, v]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(k + ':', margin + 5, ny);
        doc.setFont('helvetica', 'normal');
        const wrapped = doc.splitTextToSize(v, pageW - 2*margin - 30);
        doc.text(wrapped, margin + 30, ny);
        ny += Math.max(6, wrapped.length * 5);
    });

    y = ny + 15;

    // === VIMSHOTTARI DASHA ===
    doc.setFontSize(13);
    doc.setTextColor(...VIOLET);
    doc.setFont('helvetica', 'bold');
    doc.text('VIMSHOTTARI MAHADASHA', margin, y);
    y += 4;

    const now = new Date();
    const dashaRows = lastKundliResult.dashas.map(d => {
        const isActive = now >= d.start && now < d.end;
        const fmt = (date) => date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
        return [
            (isActive ? '▶ ' : '   ') + d.planet,
            `${d.years.toFixed(2)} anni`,
            fmt(d.start),
            fmt(d.end),
            isActive ? 'ATTIVO' : ''
        ];
    });

    doc.autoTable({
        startY: y,
        head: [['Pianeta', 'Durata', 'Inizio', 'Fine', 'Stato']],
        body: dashaRows,
        theme: 'striped',
        headStyles: { fillColor: VIOLET, textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9, textColor: TEXT },
        didParseCell: (data) => {
            if (data.section === 'body' && data.row.raw[4] === 'ATTIVO') {
                data.cell.styles.fillColor = [255, 240, 200];
                data.cell.styles.fontStyle = 'bold';
            }
        },
        styles: { cellPadding: 2 },
        margin: { left: margin, right: margin }
    });

    y = doc.lastAutoTable.finalY + 10;

    // === YOGAS ===
    if (lastKundliResult.yogas.length > 0) {
        if (y > pageH - 60) { doc.addPage(); y = margin; }

        doc.setFontSize(13);
        doc.setTextColor(...VIOLET);
        doc.setFont('helvetica', 'bold');
        doc.text('YOGA E COMBINAZIONI RILEVATE', margin, y);
        y += 8;

        lastKundliResult.yogas.forEach(yoga => {
            if (y > pageH - 30) { doc.addPage(); y = margin; }

            const color = yoga.positive ? [100, 180, 100] : [200, 100, 100];
            doc.setFillColor(...color);
            doc.rect(margin, y - 4, 2, 14, 'F');

            doc.setFontSize(11);
            doc.setTextColor(...DARK);
            doc.setFont('helvetica', 'bold');
            doc.text(`${yoga.positive ? '✦' : '⚠'} ${yoga.name}`, margin + 5, y);

            y += 5;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...TEXT);
            const desc = doc.splitTextToSize(yoga.description, pageW - 2*margin - 5);
            doc.text(desc, margin + 5, y);
            y += desc.length * 4 + 6;
        });
    }

    // === LETTURA INTERPRETATIVA ===
    doc.addPage();
    y = margin;

    doc.setFillColor(...VIOLET);
    doc.rect(0, 0, pageW, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('LETTURA INTERPRETATIVA', pageW/2, 16, { align: 'center' });

    y = 35;
    const sections = generateReading(lastKundliResult, lastBirthData);

    const stripHtml = (s) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

    sections.forEach(s => {
        const titleText = s.type === 'intro' ? 'Introduzione' : (s.type === 'closing' ? 'Conclusione' : `${s.icon} ${s.title}`);
        const rawText = s.content || s.text;

        // Page break check before title
        if (y > pageH - 30) { doc.addPage(); y = margin; }

        // Title bar
        doc.setFillColor(245, 240, 255);
        doc.rect(margin, y - 4, pageW - 2*margin, 9, 'F');
        doc.setDrawColor(...VIOLET);
        doc.setLineWidth(0.5);
        doc.line(margin, y - 4, margin, y + 5);

        doc.setFontSize(11);
        doc.setTextColor(...VIOLET);
        doc.setFont('helvetica', 'bold');
        doc.text(titleText, margin + 4, y + 2);

        y += 10;

        // Parse HTML structure for rich PDF rendering
        // Replace tags with markers
        const blocks = rawText.split(/<h5[^>]*>(.*?)<\/h5>/gi);
        // blocks alternates between text and h5-content

        for (let bi = 0; bi < blocks.length; bi++) {
            const isHeader = bi % 2 === 1;
            const txt = stripHtml(blocks[bi]).replace(/\s+/g, ' ').trim();
            if (!txt) continue;

            if (isHeader) {
                // Render as bold sub-heading
                if (y > pageH - 20) { doc.addPage(); y = margin; }
                doc.setFontSize(10);
                doc.setTextColor(...DARK);
                doc.setFont('helvetica', 'bold');
                const wrapped = doc.splitTextToSize(txt, pageW - 2*margin - 8);
                doc.text(wrapped, margin + 4, y);
                y += wrapped.length * 4.5 + 2;
            } else {
                doc.setFontSize(9.5);
                doc.setTextColor(...TEXT);
                doc.setFont('helvetica', 'normal');
                const wrapped = doc.splitTextToSize(txt, pageW - 2*margin - 8);
                // Render line by line with page-break check
                wrapped.forEach(line => {
                    if (y > pageH - 15) { doc.addPage(); y = margin; }
                    doc.text(line, margin + 4, y);
                    y += 4.5;
                });
                y += 3;
            }
        }
        y += 5;
    });

    // === FOOTER on every page ===
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...DIM);
        doc.setFont('helvetica', 'italic');
        doc.text('Jyotish Vidya — Generato con Swiss Ephemeris (Ayanamsa Lahiri)', pageW/2, pageH - 8, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.text(`Pagina ${i} di ${totalPages}`, pageW - margin, pageH - 8, { align: 'right' });
        doc.text('davil-life-leadership-coaching.it', margin, pageH - 8);
    }

    // Save
    const fileName = `kundli_${dateStr.replace(/\//g, '-')}_${lastBirthData.time.replace(':', '')}.pdf`;
    doc.save(fileName);
}

// --- EVENT HANDLERS ---
document.addEventListener('DOMContentLoaded', () => {
    loadJyotishData(); // async, non blocca
    renderNakshatraGrid();
    setupNavigation();
    setupCitySuggestions();
    setupForm();
    setupTabs();
    setupPDFDownload();
});

function setupPDFDownload() {
    const btn = document.getElementById('download-pdf');
    if (btn) btn.addEventListener('click', generatePDF);
}

function setupNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
        });

        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('active');
                links.querySelectorAll('a').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // Highlight active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        links?.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function setupCitySuggestions() {
    const input = document.getElementById('birth-city');
    const dropdown = document.getElementById('city-suggestions');
    const latInput = document.getElementById('birth-lat');
    const lonInput = document.getElementById('birth-lon');
    const tzSelect = document.getElementById('timezone');

    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        if (query.length < 2) {
            dropdown.classList.remove('active');
            return;
        }

        const matches = CITIES.filter(c =>
            c.name.toLowerCase().startsWith(query) ||
            c.name.toLowerCase().includes(query)
        ).slice(0, 8);

        if (matches.length === 0) {
            dropdown.classList.remove('active');
            return;
        }

        dropdown.innerHTML = matches.map(c =>
            `<div class="suggestion-item" data-lat="${c.lat}" data-lon="${c.lon}" data-tz="${c.tz}">
                ${c.name}, ${c.country}
            </div>`
        ).join('');
        dropdown.classList.add('active');

        dropdown.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.textContent.trim();
                latInput.value = item.dataset.lat;
                lonInput.value = item.dataset.lon;
                tzSelect.value = item.dataset.tz;
                dropdown.classList.remove('active');
            });
        });
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

function setupForm() {
    const form = document.getElementById('kundli-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const date = document.getElementById('birth-date').value;
        const time = document.getElementById('birth-time').value;
        const lat = parseFloat(document.getElementById('birth-lat').value);
        const lon = parseFloat(document.getElementById('birth-lon').value);
        const timezone = parseFloat(document.getElementById('timezone').value);

        if (!date || !time || isNaN(lat) || isNaN(lon)) {
            alert('Per favore compila tutti i campi. Latitudine e longitudine sono necessarie per un calcolo preciso.');
            return;
        }

        const btnText = form.querySelector('.btn-text');
        const btnLoading = form.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        try {
            const result = await calculateKundli(date, time, lat, lon, timezone);

            lastKundliResult = result;
            lastBirthData = {
                date, time, lat, lon, timezone,
                city: document.getElementById('birth-city').value
            };

            renderSouthIndianChart(result.planets, result.ascendantRashi);
            renderPlanetsTable(result.planets);
            renderHousesTable(result.ascendantRashi);
            renderNakshatraDetail(result.planets.find(p => p.name === "Moon").longitude);
            renderDashaTimeline(result.dashas);
            renderYogas(result.yogas);
            renderReading(result, lastBirthData);

            document.getElementById('results').style.display = 'block';

            if (!result.apiSuccess) {
                const apiInfo = document.querySelector('.api-info');
                if (apiInfo) {
                    apiInfo.innerHTML = `<p>ℹ️ Calcolo eseguito localmente con effemeridi semplificate. Per analisi professionali approfondite si consiglia <a href="https://www.vedicastrologer.org/jh/" target="_blank">Jagannatha Hora</a> o una consulenza Jyotishi.</p>`;
                }
            }

            document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Calculation error:', error);
            alert('Errore nel calcolo. Verifica i dati inseriti e riprova.');
        } finally {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${tab}`)?.classList.add('active');
        });
    });
}
