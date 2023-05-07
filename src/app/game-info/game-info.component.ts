import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConnectionService } from '../connection/connection';
import { Response } from '../connection/response';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['../../styles.css'],
})
export class GameInfoComponent {
  constructor(
    private cs: ConnectionService,
    private cookies: CookieService,
    private router: Router
  ) {}
  genreList = [
    'Action',
    'Platform',
    'Shooter',
    'Fighting',
    "Beat'em'up",
    'Stealth',
    'Survival',
    'Rhythm',
    'Action-adventure',
    'Survival horror',
    'Metroidvania',
    'Adventure',
    'Text adventure',
    'Graphic adventure',
    'Visual Novel',
    'Interactive Movie',
    'RPG',
    'Action-RPG',
    'Roguelike',
    'Tactical RPG',
    'Sandbox',
    'JRPG',
    'Simulation',
    'Strategy',
    'Sports',
    'Puzzle',
    'Idle',
    'Party',
    'Digital Card game',
    'Logic',
    'Horror',
    'Trivia',
    'Typing',
    'Single player',
    'Multiplayer',
    'Competitive',
    'Co-op',
  ];

  engineList = [
    'Unity',
    'Unreal',
    'Game Maker',
    'Construct',
    'Amazon Lumberyard',
    'CryEngine',
    'Godot',
    'Cocos2d',
    'RPG Maker',
  ];

  platformList = [
    'Mobile platforms (like iOS and Android)',
    'Desktop platforms (Windows, Mac and Linux)',
    'Web platform (WebGL)',
    'Console platforms (like PS4, PS5 and Xbox)',
    'Virtual/Extended reality platforms (like Oculus and PlayStation VR)',
  ];

  selectedThemes: string[] = [];
  addSelectedThemes(): void {
    const selectElement = document.getElementById(
      'themesSelect'
    ) as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions);

    selectedOptions.forEach((option) => {
      const theme = option.textContent;
      if (theme && this.selectedThemes.indexOf(theme) === -1) {
        this.selectedThemes.push(theme);
      }
    });
  }
  removeTheme(theme: string): void {
    const themeIndex = this.selectedThemes.indexOf(theme);
    if (themeIndex !== -1) {
      this.selectedThemes.splice(themeIndex, 1);
    }
  }
}
