import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
        let home = document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        let login = document.getElementById("login")?.addEventListener('click', evt => {
            this.router.navigate(['/login']);
        });

        let register = document.getElementById("register")?.addEventListener('click', evt => {
            // api call to backend
        });
    }
}
