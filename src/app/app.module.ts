import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {HttpModule} from '@angular/http'
import { ContentsComponent } from './contents/contents.component';
import { DetailsComponent } from './details/details.component';
import { SectionComponent } from './section/section.component';
import { NestComponent } from './nest/nest.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ContentsComponent,
    DetailsComponent,
    SectionComponent,
    NestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
