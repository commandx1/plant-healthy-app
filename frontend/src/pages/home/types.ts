export interface IPlant {
    _id?: string;
    name: string;
    type: string;
    weeklyWaterNeed: string; // ml
    expectedHumidity: number; // %
}
