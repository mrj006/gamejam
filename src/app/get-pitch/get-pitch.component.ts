import { Component } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { firstValueFrom } from 'rxjs';
import { Response } from '../services/response';

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
    let pitchLink = (document.getElementById('linkInput') as HTMLInputElement)
      ?.value;
    if (!pitchLink) {
      alert('Por favor, ingrese una URL válida');
      return;
    }

    // RegExp to match a valid YouTube URL
    let youtubeRegExp = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

    if (youtubeRegExp.test(pitchLink)) {

      
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
    } else {
      alert('El enlace ingresado no pertenece al dominio de YouTube');
      return;
    }
  }
}
