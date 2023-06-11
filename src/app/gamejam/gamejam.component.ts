import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../services/connection';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { CookieService } from 'ngx-cookie-service';
import { Response } from '../services/response';
import { Gamejam } from '../models/gamejam.model';

@Component({
  selector: 'app-gamejam',
  templateUrl: './gamejam.component.html',
  styleUrls: ['../../styles.css']
})
export class GamejamComponent implements OnInit{
  private token: string;
  constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {
    this.token = this.cookies.get('token');
  }

  ngOnInit(): void {
      this.init();
  }
  init() {
    document.getElementById("menu")?.addEventListener('click', evt => {
        this.router.navigate(['/']);
    });

    document.getElementById("createGamejam")?.addEventListener('click', evt => {
      this.addGamejam();
    });
    
}
async addGamejam(){
  let payload = jwtDecode(this.token) as Token;
  if (!payload) {
    throw "You must be properly signed in before creating a gamejam!";
}
  let _id = (document.getElementById('_id') as HTMLInputElement)?.value;
  let description = (document.getElementById('description') as HTMLInputElement)?.value;
  let gj :Gamejam =  {
    _id,
    description,
  };
  console.log(gj);
  this.cs.addGamejam(gj, this.token).subscribe((res) => {
    let response = res as Response;
    if (response.code == 200) {
        this.router.navigate(['/']);
    }          
});
this.router.navigate(['/']);
}
}
