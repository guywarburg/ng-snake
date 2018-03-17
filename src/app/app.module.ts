import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SnakeWrapperComponent } from './snake-wrapper/snake-wrapper.component';
import { InvadersWrapperComponent } from './invaders-wrapper/invaders-wrapper.component';


@NgModule({
  declarations: [
    AppComponent,
    SnakeWrapperComponent,
    InvadersWrapperComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
