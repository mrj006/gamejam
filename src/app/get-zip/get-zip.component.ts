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
        document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        let compressedInput = document.getElementById("compressedInput") as HTMLInputElement;

        if (!(compressedInput)) return;

        compressedInput.setAttribute("accept", ".zip, .rar, .7z, .tar.gz, .tgz, .tar.bz2");
        
        compressedInput.onchange = (evt) => {
            let files = (evt.target as HTMLInputElement).files;

            if (!(files && this.game)) return;

 

            this.logo = new File([files[0]], this.game._id, {type: files[0].type});

            let fr = new FileReader();
            fr.onload = () => {
                if (!fr.result) return;

        }

        document.getElementById('back')?.addEventListener('click', (evt) => {
            this.router.navigate(['/']);
        });

        document.getElementById('save')?.addEventListener('click', (evt) => {
            
        });
    }
    }
}

