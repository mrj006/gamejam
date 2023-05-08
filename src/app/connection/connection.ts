import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Game } from '../models/Game.model';

@Injectable({
    providedIn: 'root'
})

export class ConnectionService {
    private api = environment.BACKEND;

    constructor(private http: HttpClient) {}

    /////////////////////////////// USER ///////////////////////////////

    public registerUser(user: User) {
        return this.http.post(this.api + "/register", user);
    }

    /////////////////////////////// GAME ///////////////////////////////

    public findUser(param: string) {
        return this.http.get(`${this.api}/find-users?user=${param}`);
    }
    public findUser(param: string) {
        return this.http.post(this.api + "/register", user);
    }

}
