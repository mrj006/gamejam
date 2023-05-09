import { Component } from '@angular/core';
import { ConnectionService } from '../connection/connection';
import { Response } from '../connection/response';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { token } from '../connection/token';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['../../styles.css'],
})
export class TeamInfoComponent {
  constructor(
    private cs: ConnectionService,
    private cookies: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    document.getElementById('save')?.addEventListener('click', (evt) => {
      this.upload();
    });
  }

  upload() {
    const cookieValue = this.cookies.get('token');

    if (!cookieValue) {
      return;
    }
    let aboutTeam = '';
    let teamExistence = (
      document.getElementById('teamExistence') as HTMLInputElement
    )?.valueAsNumber;
    let companyName = (
      document.getElementById('companyName') as HTMLInputElement
    )?.value;
    let companyLink = (document.getElementById('teamLink') as HTMLInputElement)
      ?.value;

    document.getElementsByName('teamHistory').forEach((option) => {
      // as there'll be only 1 option checked, the loop could be broken by an exception
      // optimization not necessary for 4 options
      if ((option as HTMLInputElement).checked)
        aboutTeam = (option as HTMLInputElement).value;
    });

    const [headerB64, payloadB64, signature] = cookieValue.split('.');
    const payloadStr = jwtDecode(cookieValue) as token;

    console.log(payloadStr.email);

    let gameName = this.fetchGameId('david@achoy.net'); //arreglo
    let game: Partial<Game> = {
      gameName,
      teamExistence,
      aboutTeam,
      companyName,
      companyLink,
    };
    let file = document.getElementById('userImage') as HTMLInputElement;
    if (file?.files) {
      this.cs.uploadTeamInfo(game as Game, file.files[0]);
    }
  }

  fetchGameId(email: string): string {
    //Realizar cambios al futuro(Solo 1 juego por ahora)
    this.cs.getUserGames(email).subscribe((res) => {
      console.log(res);
      let response = res as Response;
      if (response.code === 200 && response.data) {
        return response.data[0]._id;
      }
      return '';
    });
    return '';
  }
}
