import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

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
}
