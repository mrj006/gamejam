import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TeamInfoComponent } from './team-info/team-info.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { FirstStageComponent } from './first-stage/first-stage.component';
const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'team-info', component: TeamInfoComponent },
    { path: 'game-info', component: GameInfoComponent },
    { path: 'first-stage', component: FirstStageComponent },




];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
