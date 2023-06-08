import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TeamInfoComponent } from './team-info/team-info.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { FirstStageComponent } from './first-stage/first-stage.component';
import { LoginComponent } from './login/login.component';
import { GamejamComponent } from './gamejam/gamejam.component';
import { ViewGamejamsComponent } from './view-gamejams/view-gamejams.component';

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'team-info', component: TeamInfoComponent },
    { path: 'game-info', component: GameInfoComponent },
    { path: 'first-stage', component: FirstStageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'gamejam', component: GamejamComponent },
    { path: 'view-gamejam', component: ViewGamejamsComponent },



];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
