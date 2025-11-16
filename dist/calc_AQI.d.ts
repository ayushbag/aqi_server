export interface CalculateAQIIndexType {
    co: number;
    no2: number;
    so2: number;
    o3: number;
    pm10: number;
    pm2_5: number;
}
export declare const calcualteAQIIndex: ({ co, no2, so2, o3, pm10, pm2_5, }: CalculateAQIIndexType) => Promise<{
    pollutants: {
        co: number;
        no2: number;
        so2: number;
        o3: number;
        pm10: number;
        pm2_5: number;
    };
    aqi: {
        pm25: number | null;
        pm10: number | null;
        finalAQI: number;
        category: string;
    };
}>;
//# sourceMappingURL=calc_AQI.d.ts.map