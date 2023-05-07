import { Component } from '@angular/core';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['../../styles.css']

})
export class TeamInfoComponent {
  fileName: string = 'Choose file';

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.fileName = fileInput.files[0].name;
    } else {
      this.fileName = 'Choose file';
    }
  }
}
