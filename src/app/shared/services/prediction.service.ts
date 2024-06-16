import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Prediction } from '../model/prediction';
import { TemperatureUnit } from '../enums/temperature-unit';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private baseUrl = `${environment.wsUrl}/v1/prediction`

  constructor(private http: HttpClient) { }

  getPrediction(municipalityId: string, temperatureUnit: TemperatureUnit): Observable<Prediction> {
    return this.http.get<Prediction>(`${this.baseUrl}`, {
      params: {
        municipalityId: municipalityId,
        temperatureUnitEnum: temperatureUnit === TemperatureUnit.Celsius ? "G_CEL" : "G_FAH"
      }
    });
  }

}