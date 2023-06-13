import { Component } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { firstValueFrom } from 'rxjs';
import { Response } from '../services/response';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-get-pitch',
    templateUrl: './get-pitch.component.html',
    styleUrls: ['../../styles.css'],
})
export class GetPitchComponent {
    private game?: Game;
    private token: string;

    constructor(
        private cs: ConnectionService,
        private cookies: CookieService,
        private router: Router
    ) {
        this.token = this.cookies.get('token');
    }

    async init() {
        let payload = jwtDecode(this.token) as Token;
        if (!payload) {
            throw 'You must be logged in to edit information!';
        }
        this.game = (
            (await firstValueFrom(this.cs.getCurrentUserGame(payload._id)))
                .data as Game[]
        )[0];

        if (!this.game) {
            throw 'You need to create a game first before adding its information!';
        }

        document.getElementById('home')?.addEventListener('click', (evt) => {
            this.router.navigate(['/']);
        });

        let pitchInput = document.getElementById("pitchInput") as HTMLInputElement;
        pitchInput.setAttribute("pattern", environment.PITCH_REGEX);
        pitchInput.setAttribute("title", environment.PITCH_ERROR);
        pitchInput?.addEventListener("focusout", evt => {
            let pattern = new RegExp(environment.PITCH_REGEX);
            let pitchLink = (evt.target as HTMLInputElement).value;
            const domains = ['youtube.com', 'youtu.be'];
            let match = pattern.exec(pitchLink);
            
            if (!match) {
                pitchInput.style.borderColor = "#FF0000";
                document.getElementById("pitchError")?.style.setProperty("display", "block");
            }

            if (match?.groups) {
                let domain = match.groups["domain"];
                
                if (!domains.includes(domain)) {
                    pitchInput.style.borderColor = "#FF0000";
                    document.getElementById("pitchError")?.style.setProperty("display", "block");
                } else {
                    pitchInput.style.borderColor = "#ced4da";
                    document.getElementById("pitchError")?.style.setProperty("display", "none");
                }
            } else {
                pitchInput.style.borderColor = "#FF0000";
                document.getElementById("pitchError")?.style.setProperty("display", "block");
            }
        });

        let pitchError = document.getElementById("pitchError");
        pitchError?.appendChild(document.createTextNode(environment.PITCH_ERROR));
        pitchError?.style.setProperty("display", "none");

        document.getElementById('back')?.addEventListener('click', (evt) => {
            this.router.navigate(['/']);
        });

        document.getElementById('save')?.addEventListener('click', (evt) => {
            this.savePitch();
        });
    }

    ngOnInit(): void {
        this.init();
    }
    
    savePitch() {
        let pitchLink = (document.getElementById('pitchInput') as HTMLInputElement)?.value;
        
        if (!pitchLink) {
            alert(environment.PITCH_ERROR);
            return;
        }

        let game: Partial<Game> = {
            _id: this.game?._id,
            pitchLink,
        };

        this.cs.uploadPitchInfo(game as Game, this.token).subscribe((res) => {
            let response = res as Response;

            if ([400, 401].includes(response.code))
                alert('Error: ' + response.message);
            if (response.code == 403) alert('Error: ' + response.message);
            if (response.code == 500) alert(response.message);
            if (response.code == 200) {
                alert(response.message);
                this.router.navigate(['/']);
            }
        });
    }
}
