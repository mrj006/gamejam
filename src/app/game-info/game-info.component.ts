import { Component } from '@angular/core';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css'],
})
export class GameInfoComponent {
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
