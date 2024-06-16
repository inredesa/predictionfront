import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'prediction', loadChildren: () => import('./prediction/prediction.module').then(m => m.PredictionModule)},
  {path: '', pathMatch: 'full', redirectTo: '/prediction'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
