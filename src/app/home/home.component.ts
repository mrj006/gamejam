import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['../../styles.css']
})
export class HomeComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
        document.getElementById("firstStage")?.addEventListener('click', evt => {
            this.router.navigate(['/first-stage']);
        });

        document.getElementById("teamInfo")?.addEventListener('click', evt => {
            this.router.navigate(['/team-info']);
        });

        document.getElementById("gameInfo")?.addEventListener('click', evt => {
            this.router.navigate(['/game-info']);
        });

        document.getElementById("register")?.addEventListener('click', evt => {
            this.router.navigate(['/register']);
        });
        document.getElementById("login")?.addEventListener('click', evt => {
            this.router.navigate(['/login']);
        });
        document.getElementById("gamejam")?.addEventListener('click', evt => {
            this.router.navigate(['/gamejam']);
        });
        document.getElementById("get-zip")?.addEventListener('click', evt => {
            this.router.navigate(['/get-zip']);
        });
        document.getElementById("get-pitch")?.addEventListener('click', evt => {
            this.router.navigate(['/get-pitch']);
        });
        document.getElementById("view-gamejam")?.addEventListener('click', evt => {
            this.router.navigate(['/view-gamejam']);
        });

    }
}


//get-pitch