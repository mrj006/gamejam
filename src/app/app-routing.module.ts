import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TeamInfoComponent } from './team-info/team-info.component';
const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'team-info', component: TeamInfoComponent },


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
