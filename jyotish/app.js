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

// --- EVENT HANDLERS ---
document.addEventListener('DOMContentLoaded', () => {
    renderNakshatraGrid();
    setupNavigation();
    setupCitySuggestions();
    setupForm();
    setupTabs();
});

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

            renderSouthIndianChart(result.planets, result.ascendantRashi);
            renderPlanetsTable(result.planets);
            renderHousesTable(result.ascendantRashi);
            renderNakshatraDetail(result.planets.find(p => p.name === "Moon").longitude);
            renderDashaTimeline(result.dashas);
            renderYogas(result.yogas);

            document.getElementById('results').style.display = 'block';

            if (!result.apiSuccess) {
                const apiInfo = document.querySelector('.api-info');
                if (apiInfo) {
                    apiInfo.innerHTML = `<p>⚠️ Calcolo locale (approssimato). L'API VedAstro non era raggiungibile. Per risultati professionali usa <a href="https://www.vedicastrologer.org/jh/" target="_blank">Jagannatha Hora</a>.</p>`;
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
