import { Component } from '@angular/core';
import { ConnectionService } from '../connection/connection';
import { Response } from '../connection/response';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';
import { CookieService } from 'ngx-cookie-service';

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

  fileName: string = 'Choose file';
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.fileName = fileInput.files[0].name;
      this.selectedFile = fileInput.files[0];
    } else {
      this.fileName = 'Choose file';
      this.selectedFile = null;
    }
  }
  upload() {
    const cookieValue = this.cookies.get('token');

    if (!cookieValue) {
      return;
    }
    let imageFile = this.selectedFile;
    let aboutTeam = '';
    let teamExistence = (
      document.getElementById('teamExistence') as HTMLInputElement
    )?.value;
    let companyName = (
      document.getElementById('companyName') as HTMLInputElement
    )?.value;
    let teamLink = (document.getElementById('teamLink') as HTMLInputElement)
      ?.value;

    console.log(teamLink);

    document.getElementsByName('teamHistory').forEach((option) => {
      // as there'll be only 1 option checked, the loop could be broken by an exception
      // optimization not necessary for 4 options
      if ((option as HTMLInputElement).checked)
        aboutTeam = (option as HTMLInputElement).value;
    });

    console.log('Valor de la cookie:', cookieValue);

    const [headerB64, payloadB64, signature] = cookieValue.split('.');
    const headerStr = atob(headerB64);
    const payloadStr = atob(payloadB64);
    const headerObj = JSON.parse(headerStr);
    const payloadObj = JSON.parse(payloadStr);

    let userEmail = payloadObj.email;
    console.log(userEmail);

    if (this.selectedFile) {
      console.log(this.selectedFile);
    } else {
      console.log('No file selected');
    }
  }
}
