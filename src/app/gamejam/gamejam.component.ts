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
  constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {}

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
addGamejam(){
  let fecha = (document.getElementById('date') as HTMLInputElement)?.value;
  let desc = (document.getElementById('desc') as HTMLInputElement)?.value;
  let gj :Gamejam =  {
    _id: fecha,
    description : desc,
  };
  console.log(gj);
//   this.cs.addGamejam(gj).subscribe(res => {
//     let response = res as Response;
//     if (response.code == 200) {
//         this.router.navigate(['/']);
//     }          
// });
this.router.navigate(['/']);
}
}
