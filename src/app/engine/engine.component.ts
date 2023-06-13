import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { Engine } from '../models/engine.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { User } from '../models/user.model';
import { Router } from '@angular/router';


@Component({
    selector: 'app-engine',
    templateUrl: './engine.component.html',
    styleUrls: ['../../styles.css'],
    
})

export class EngineComponent implements OnInit {
    private token: string;

    constructor(private cs: ConnectionService, private cookies: CookieService, private router: Router) {        
        this.token = this.cookies.get('token');  
    }

    ngOnInit(): void {
        this.init();
    }

    async init() {
        let payload = jwtDecode(this.token) as Token;        
        
        if (!payload) {
            throw "You must be logged in to edit information!";
        }

        let user = ((await firstValueFrom(this.cs.getUser(payload._id))).data as User[])[0]; 
        
        if(!user.isGlobalOrg){
            throw "You must be logged as Global organizer ";
        }

        document.getElementById("home")?.addEventListener('click', evt => {
            this.router.navigate(['/']);
        });

        await this.loadEngines()
        
        document.getElementById("addEngineButton")?.addEventListener('click', evt => {
            this.addEngine();
        });

        document.getElementById("deleteSelected")?.addEventListener('click', evt => {
            this.deleteEngine();
        });
        
    }

    deleteEngine() {
        let selectElement = document.getElementById('engineSelect') as HTMLSelectElement;
        let selectedOptions = Array.from(selectElement.selectedOptions);
        
        for (let option of selectedOptions) {
            let engine: Engine = {_id: option.innerHTML };
            
            this.cs.deleteEngine(engine, this.token).subscribe(response => {
                if(response.code == 200){
                    alert("Engine successfully deleted");
                    selectElement.removeChild(option);
                }else{
                    alert(response.message);
                }
            });
        } 
    }

    async loadEngines() {
        let engines = (await firstValueFrom(this.cs.getEngines())).data as Engine[];       
        let engineSelect = document.getElementById("engineSelect");
        
        if (!engineSelect) return;
        engineSelect.textContent = "";

        for (let engine of engines) {
            let option = document.createElement("option");
            option.value = engine._id;
            option.innerHTML = engine._id;

            engineSelect?.appendChild(option);
        } 
    }
    
    addEngine() {        
        let _id = (document.getElementById("engineName") as HTMLInputElement)?.value;
        let engine: Engine = {
            _id
        }; 
                
        this.cs.addEngine(engine, this.token).subscribe(async response =>{                               
                if (response.code == 200) {                    
                    await this.loadEngines();
                    alert("New engine added successfully!");
                } else alert(response.message);
            }                                         
        );            
        
    }
    
}