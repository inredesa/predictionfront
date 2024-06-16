import { TemperatureUnit } from "../enums/temperature-unit";
import { PrecipitationProbability } from "./precipitation-probability";

export interface Prediction {
    precipitationProbabilityList: PrecipitationProbability[];
    averageTemperature: number;
    temperatureUnit: TemperatureUnit;
}