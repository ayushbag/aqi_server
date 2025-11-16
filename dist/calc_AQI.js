// India AQI (CPCB) Breakpoints
const INDIA_BREAKPOINTS = {
    pm25: [
        { conc_lo: 0, conc_hi: 30, aqi_lo: 0, aqi_hi: 50 },
        { conc_lo: 31, conc_hi: 60, aqi_lo: 51, aqi_hi: 100 },
        { conc_lo: 61, conc_hi: 90, aqi_lo: 101, aqi_hi: 200 },
        { conc_lo: 91, conc_hi: 120, aqi_lo: 201, aqi_hi: 300 },
        { conc_lo: 121, conc_hi: 250, aqi_lo: 301, aqi_hi: 400 },
        { conc_lo: 251, conc_hi: 500, aqi_lo: 401, aqi_hi: 500 },
    ],
    pm10: [
        { conc_lo: 0, conc_hi: 50, aqi_lo: 0, aqi_hi: 50 },
        { conc_lo: 51, conc_hi: 100, aqi_lo: 51, aqi_hi: 100 },
        { conc_lo: 101, conc_hi: 250, aqi_lo: 101, aqi_hi: 200 },
        { conc_lo: 251, conc_hi: 350, aqi_lo: 201, aqi_hi: 300 },
        { conc_lo: 351, conc_hi: 430, aqi_lo: 301, aqi_hi: 400 },
        { conc_lo: 431, conc_hi: 600, aqi_lo: 401, aqi_hi: 500 },
    ],
};
// Linear interpolation formula
function calculateAQI(C, BPlo, BPhi, Ilo, Ihi) {
    return ((Ihi - Ilo) / (BPhi - BPlo)) * (C - BPlo) + Ilo;
}
// Get AQI for pollutant
function getIndiaAQI(pollutant, concentration) {
    const breakpoints = INDIA_BREAKPOINTS[pollutant];
    const range = breakpoints.find((bp) => concentration >= bp.conc_lo && concentration <= bp.conc_hi);
    if (!range)
        return null;
    return Math.round(calculateAQI(concentration, range.conc_lo, range.conc_hi, range.aqi_lo, range.aqi_hi));
}
// AQI Meaning
function getAQICategory(aqi) {
    if (aqi <= 50)
        return "Good";
    if (aqi <= 100)
        return "Satisfactory";
    if (aqi <= 200)
        return "Moderate";
    if (aqi <= 300)
        return "Poor";
    if (aqi <= 400)
        return "Very Poor";
    return "Severe";
}
// FINAL FUNCTION
export const calcualteAQIIndex = async ({ co, no2, so2, o3, pm10, pm2_5, }) => {
    const aqiPM25 = getIndiaAQI("pm25", pm2_5);
    const aqiPM10 = getIndiaAQI("pm10", pm10);
    const finalAQI = Math.max(aqiPM25 ?? 0, aqiPM10 ?? 0);
    const category = getAQICategory(finalAQI);
    return {
        pollutants: { co, no2, so2, o3, pm10, pm2_5 },
        aqi: {
            pm25: aqiPM25,
            pm10: aqiPM10,
            finalAQI,
            category,
        },
    };
};
//# sourceMappingURL=calc_AQI.js.map