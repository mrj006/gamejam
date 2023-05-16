import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CustomErrorHandler } from './services/custom-error-handler';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TeamInfoComponent } from './team-info/team-info.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { FirstStageComponent } from './first-stage/first-stage.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    TeamInfoComponent,
    GameInfoComponent,
    FirstStageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ 
    CookieService,
    { 
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
