import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../services/connection';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { CookieService } from 'ngx-cookie-service';
import { Response } from '../services/response';
import { Gamejam } from '../models/gamejam.model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { User } from '../models/user.model';

@Component({
    selector: 'app-gamejam',
    templateUrl: './gamejam.component.html',
    styleUrls: ['../../styles.css']
})
export class GamejamComponent implements OnInit {
    private token: string;
    constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {
        this.token = this.cookies.get('token');
    }

    ngOnInit(): void {
        this.init();
    }
    async init() {
        let payload = jwtDecode(this.token) as Token;
        
        if (!payload) {
            throw "You must be properly signed in before creating a gamejam!";
        }

        let user = ((await firstValueFrom(this.cs.getUser(payload._id))).data as User[])[0]; 

        if(!user.isGlobalOrg){
            throw "You must be logged as Global organizer ";
        }

        document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        document.getElementById("addGameJam")?.addEventListener('click', evt => {
            this.addGameJam();
        });

        let currentGameJam = ((await firstValueFrom(this.cs.getCurrentGameJam())).data as Gamejam[])[0];
        let date = new Date(currentGameJam._id);
        let gameJamsDiv = document.getElementById("gameJamsDiv");
        
        let title = document.createElement("h5");
        title.innerText = "Current GameJam";

        let titleRow = document.createElement("div");
        titleRow.appendChild(title);

        let infoRow = document.createElement("div");
        infoRow.appendChild(document.createTextNode("Date: " + date.toUTCString()));
        infoRow.appendChild(document.createElement("br"));
        infoRow.appendChild(document.createTextNode("Description: " + currentGameJam.description));
        
        gameJamsDiv?.appendChild(titleRow);
        gameJamsDiv?.appendChild(infoRow);
    }
    async addGameJam() {
        let date = (document.getElementById('_id') as HTMLInputElement)?.value;
        let _id = (new Date(date)).getTime();
        let description = (document.getElementById('description') as HTMLInputElement)?.value;
        let gameJam: Gamejam = {
            _id,
            description,
        };

        let decision = confirm("Adding a new GameJam may turn it into the current one.\nAre you sure you want to continue?");
        
        if (decision) {
            this.cs.addGameJam(gameJam, this.token).subscribe(response => {                
                if (response.code == 200) {
                    this.router.navigate(['/']);
                } else alert(response.message);
            });
        }
    }
}
