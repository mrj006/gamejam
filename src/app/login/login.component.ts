import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../services/connection';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../../styles.css'],
})
export class LoginComponent implements OnInit {
    constructor(private cookies: CookieService, private router: Router, private cs: ConnectionService) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
        document.getElementById('register')?.addEventListener('click', (evt) => {
            this.router.navigate(['/register']);
        });
        
        document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        document.getElementById('login')?.addEventListener('click', (evt) => {
            this.login();
        });
    }

    login() {
        let email = (document.getElementById('email') as HTMLInputElement)?.value;
        let password = (document.getElementById('password') as HTMLInputElement)?.value;
        let user: Partial<User> = {
            _id: email,
            password,
        };

        this.cs.loginUser(user as User).subscribe((response) => {
            if ([400, 401].includes(response.code)) alert("Error: " + response.message);
            else if (response.code == 200) {
                if (response.token) {
                    let payload = jwtDecode(response.token) as Token;
                    let expiration = new Date(payload.exp);       
                    this.cookies.set("token", response.token, expiration);
                }
                this.router.navigate(['/']);
            } else alert(response.message);
        });
    }
}
