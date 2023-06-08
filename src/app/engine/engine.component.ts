import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-engine',
    templateUrl: './engine.component.html',
    styleUrls: ['../../styles.css']
})
export class EngineComponent implements OnInit {

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
    }
}