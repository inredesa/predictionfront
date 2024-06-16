import { Component, OnInit } from '@angular/core';
import { MunicipalityService } from "../shared/services/municipality.service";
import { Municipality } from "../shared/model/municipality";
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, filter, mergeMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { TemperatureUnit } from '../shared/enums/temperature-unit';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PredictionService } from '../shared/services/prediction.service';
import { PrecipitationProbability } from '../shared/model/precipitation-probability';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';


@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions: Observable<Municipality[]>;
  temperatureUnits: TemperatureUnit[];
  precipitationProbabilityList: PrecipitationProbability[];
  selectedTemperatureUnit: TemperatureUnit;
  temperatureUnit: string;
  averageTemperature: number;
  municipalityIdSelected: string;
  municipalityNameSelected: string;
  tomorrow: Date;
  subtitle: string = "para municipios de España";

  constructor(
    private municipalityService: MunicipalityService,
    private predictionService: PredictionService,
    private toastr: ToastrService
  ) {
    this.temperatureUnits = [TemperatureUnit.Celsius, TemperatureUnit.Fahrenheit];
    this.precipitationProbabilityList = [];
    this.selectedTemperatureUnit = TemperatureUnit.Celsius;
    this.averageTemperature = 1000;
    this.temperatureUnit = TemperatureUnit.Celsius;
    this.filteredOptions = of([]);
    this.municipalityIdSelected = "";
    this.municipalityNameSelected = "";
    this.tomorrow = moment().add(1, 'days').toDate();;
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(500),
      filter(value => value),
      mergeMap(value => this.filter(value))
    );

    this.getSearchParametersLocalStorage();

    if (this.municipalityIdSelected && this.selectedTemperatureUnit) {
      this.getPrediction();
    }
  }

  filter(value: string): Observable<Municipality[]> {
    return this.municipalityService.findMunicipalities(value).pipe(
      catchError(() => {
        this.toastr.error("Se ha producido un error al intentar obtener la lista de municipios");
        return of([]);
      })
    );
  }

  displayMunicipalityName(municipality: Municipality): string {
    return municipality?.name;
  }

  selectTemperature(event: any): void {
    this.selectedTemperatureUnit = event.value;
    if (this.municipalityIdSelected) {
      this.getPrediction();
      this.setSearchParametersLocalStorage();
    }
  }

  onSelectMunicipality(event: MatAutocompleteSelectedEvent): void {
    this.municipalityIdSelected = event.option.value.id;
    this.municipalityNameSelected = event.option.value.name;
    this.getPrediction();
    this.setSearchParametersLocalStorage();
  }

  getPrediction(): void {
    this.predictionService.getPrediction(this.municipalityIdSelected, this.selectedTemperatureUnit)
      .subscribe(prediction => {        
        this.setPrediction(
          prediction.averageTemperature,
          prediction.precipitationProbabilityList,
          (prediction.temperatureUnit.valueOf() === "G_CEL") ? "ºC" : "ºF"
        );

        this.toastr.success("La predicción se ha obtenido correctamente");
    }, () => {
      this.toastr.error("Se ha producido un error al intentar obtener la predicción");
    });
  }

  setPrediction(averageTemperature: number, precipitationProbabilityList: PrecipitationProbability[], temperatureUnit: string): void {
    this.averageTemperature = averageTemperature;
    this.precipitationProbabilityList = precipitationProbabilityList;
    this.temperatureUnit = temperatureUnit;
  }

  setSearchParametersLocalStorage(): void {
    localStorage.setItem("municipalityId", this.municipalityIdSelected);
    localStorage.setItem("temperatureUnit", this.selectedTemperatureUnit);
    localStorage.setItem("municipalityName", this.municipalityNameSelected);
  }

  getSearchParametersLocalStorage(): void {
    const municipalitySelected: string | null = localStorage.getItem("municipalityId");
    const municipalityNameSelected: string | null = localStorage.getItem("municipalityName");
    const selectedTemperatureUnit: TemperatureUnit = 
      (localStorage.getItem("temperatureUnit") === "ºC") ? TemperatureUnit.Celsius : TemperatureUnit.Fahrenheit;

    if (municipalitySelected && selectedTemperatureUnit && municipalityNameSelected) {
      this.municipalityIdSelected = municipalitySelected;
      this.selectedTemperatureUnit = selectedTemperatureUnit;
      this.municipalityNameSelected = municipalityNameSelected;
    }  
  }

}

