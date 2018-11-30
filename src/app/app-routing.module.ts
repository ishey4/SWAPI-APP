import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NestComponent } from './nest/nest.component';

const routes: Routes = [
  {path: ':obj/:id', component:NestComponent },
  {path: '**', component:NestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
