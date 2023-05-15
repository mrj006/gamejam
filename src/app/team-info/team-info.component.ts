import { Component } from '@angular/core';
import { ConnectionService } from '../connection/connection';
import { Response } from '../connection/response';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../connection/token';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-team-info',
    templateUrl: './team-info.component.html',
    styleUrls: ['../../styles.css'],
})
export class TeamInfoComponent {
    private token: string;
    private game?: Game;
    private logo?: File;

    constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {
        this.token = this.cookies.get("token");
    }

    ngOnInit(): void {
        this.init();
    }

    async init() {
        let payload = jwtDecode(this.token) as Token;

        if (!payload) {
            alert("You must be logged in to edit information!");
            return;
        }
        
        this.game = ((await firstValueFrom(this.cs.getCurrentUserGame(payload._id))).data as Game[])[0];

        if (!this.game) {
            alert("You need to create a game first before adding its team information!");
            this.router.navigate(['/']);
        }

        document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        let imageInput = document.getElementById("teamLogoInput") as HTMLInputElement;
        let teamLogo = document.getElementById("teamLogo") as HTMLImageElement;

        if (!(imageInput && teamLogo)) return;

        imageInput.setAttribute("accept", "image/jpeg,image/jpg,image/png");
        
        imageInput.onchange = (evt) => {
            let files = (evt.target as HTMLInputElement).files;

            if (!(files && this.game)) return;

            if (files[0].size / 1024**2 > 5) {
                alert("The maximum logo size is 5 MB! Choose a different image.");
                imageInput.value = "";
                return;
            }

            this.logo = new File([files[0]], this.game._id, {type: files[0].type});

            let fr = new FileReader();
            fr.onload = () => {
                if (!fr.result) return;

                teamLogo.src = fr.result?.toString();
                
                if (teamLogo.width > 400 || teamLogo.height > 400) {
                    alert("The logo maximum dimensions are 400x400! Choose a different image.");
                    imageInput.value = "";
                    
                    document.getElementById("teamLogoDiv")?.removeChild(teamLogo);
                    teamLogo = document.createElement("img");
                    teamLogo.setAttribute("id", "teamLogo");
                    document.getElementById("teamLogoDiv")?.appendChild(teamLogo);
                    return;
                }
            }
            fr.readAsDataURL(this.logo);
        }

        document.getElementById('save')?.addEventListener('click', (evt) => {
            this.upload();
        });
    }

    async upload() {
        let aboutTeam = '';
        let teamExistence = (document.getElementById('teamExistence') as HTMLInputElement)?.valueAsNumber;
        let companyName = (document.getElementById('companyName') as HTMLInputElement)?.value;
        let companyLink = (document.getElementById('teamLink') as HTMLInputElement)?.value;

        document.getElementsByName('teamHistory').forEach((option) => {
            // as there'll be only 1 option checked, the loop could be broken by an exception
            // optimization not necessary for 4 options
            if ((option as HTMLInputElement).checked)
                aboutTeam = (option as HTMLInputElement).value;
        });
           
        if (!(this.game && this.logo)) {
            alert("You must provide a valid team logo to continue!");
            return;
        }
        
        let form = new FormData();
        form.append("file", this.logo);
        form.append("_id", this.game._id);
        form.append("teamExistence", teamExistence.toString());
        form.append("aboutTeam", aboutTeam);
        form.append("companyName", companyName);
        form.append("companyLink", companyLink);
        
        this.cs.uploadTeamInfo(form, this.token).subscribe(response => {
            if (response.code == 500) alert(response.message);
            if (response.code == 200) {
                alert(response.message);
                this.router.navigate(['/']);
            }
            else alert('Error: ' + response.message);
        });
    }
}
