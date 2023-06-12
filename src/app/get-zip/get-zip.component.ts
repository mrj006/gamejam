import { Component } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { Response } from '../services/response';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-get-zip',
    templateUrl: './get-zip.component.html',
    styleUrls: ['../../styles.css'],
})
export class GetZipComponent {
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
            throw "You must be logged in to edit information!";
        }
        
        this.game = ((await firstValueFrom(this.cs.getCurrentUserGame(payload._id))).data as Game[])[0];

        if (!this.game) {
            throw "You need to create a game first before adding its information!";
        }

        document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        let gameExecutableInput = document.getElementById("gameExecutableInput") as HTMLInputElement;

        if (!(gameExecutableInput)) return;

        gameExecutableInput.setAttribute("accept", ".zip");
        
        gameExecutableInput.onchange = (evt) => {
            let files = (evt.target as HTMLInputElement).files;

            if (!(files && this.game)) return;

            this.logo = new File([files[0]], this.game._id, {type: files[0].type});
        }

        document.getElementById('back')?.addEventListener('click', (evt) => {
            this.router.navigate(['/']);
        });

        document.getElementById('save')?.addEventListener('click', (evt) => {
            this.upload();
        });
    }

    upload() {
        let version = (document.getElementById('gameExecutableVersion') as HTMLInputElement)?.value;
        let description = (document.getElementById('gameExecutableDescription') as HTMLInputElement)?.value;

        if (!(this.game && this.logo)) {
            alert("You must provide a valid game executable to continue!");
            return;
        }

        let form = new FormData();
        form.append("file", this.logo);
        form.append("_id", this.game._id);
        form.append("version", version);
        form.append("description", description);

        this.cs.uploadGameExecutable(form, this.token).subscribe(response => {
            if (response.code == 500) alert(response.message);
            else if (response.code == 200) {
                alert(response.message);
                this.router.navigate(['/']);
            }
            else alert('Error: ' + response.message);
        })
    }
}

