import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SnakeWrapperComponent } from './snake-wrapper/snake-wrapper.component';
// import { InvadersWrapperComponent } from './invaders-wrapper/invaders-wrapper.component';
import { InvadersJsComponent } from './invaders-js/invaders-js.component';
import { MobxAngularModule } from 'mobx-angular';
import { LoaderComponent } from './loader/loader.component';
import { DxBallWrapperComponent } from './dx-ball-wrapper/dx-ball-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    SnakeWrapperComponent,
    // InvadersWrapperComponent,
    InvadersJsComponent,
    LoaderComponent,
    DxBallWrapperComponent
  ],
  imports: [BrowserModule, MobxAngularModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
