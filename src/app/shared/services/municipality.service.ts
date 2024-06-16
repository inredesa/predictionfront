import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Municipality } from "../model/municipality";

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {

  private baseUrl = `${environment.wsUrl}/v1/municipality`

  constructor(private http: HttpClient) { }

  findMunicipalities(municipalityName: string): Observable<Municipality[]> {
    return this.http.get<Municipality[]>(`${this.baseUrl}`, {
      params: {
        municipalityName: municipalityName
      }
    });
  }

}
