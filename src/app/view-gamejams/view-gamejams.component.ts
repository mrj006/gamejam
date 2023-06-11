import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Gamejam } from '../models/gamejam.model';
@Component({
  selector: 'app-view-gamejams',
  templateUrl: './view-gamejams.component.html',
  styleUrls: ['../../styles.css']
})
export class ViewGamejamsComponent implements OnInit {
  private token: string;

  constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {
    this.token = this.cookies.get("token");
}
ngOnInit(): void {
  this.init();
}
init() {
  this.displayGamejam();
  document.getElementById("menu")?.addEventListener('click', evt => {
    this.router.navigate(['/']);
});
};
displayGamejam(){
  
  this.cs.getCurrentGameJam().subscribe((res) => {
    let gj : Gamejam = res.data?.at(0) as Gamejam;
    const fecha = document.getElementById('id');
    if (fecha) fecha.innerHTML = gj._id;
    const desc = document.getElementById('description');
    if (desc) desc.innerHTML = gj.description;
  });
}
}
