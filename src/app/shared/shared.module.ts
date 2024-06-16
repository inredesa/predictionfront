import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { TitleComponent } from './components/title/title.component';
import { CustomDateFormatPipe } from './pipes/custom-date-format.pipe';


@NgModule({
  declarations: [
    FooterComponent,
    TitleComponent,
    CustomDateFormatPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FooterComponent,
    TitleComponent,
    CustomDateFormatPipe
  ]
})
export class SharedModule { }
