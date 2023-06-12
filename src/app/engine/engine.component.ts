import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { Response } from '../services/response';
import { Engine } from '../models/engine.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { User } from '../models/user.model';


@Component({
    selector: 'app-engine',
    templateUrl: './engine.component.html',
    styleUrls: ['../../styles.css'],
    
})

export class EngineComponent implements OnInit {
    Engines: Engine[] = [];    
    user? : User ;
    private token: string;
    constructor(private cs: ConnectionService, private cookies: CookieService) {        
        this.token = this.cookies.get('token');
        
    }

    ngOnInit(): void {
        this.init();
    }

    async init() {
        
        //Get token
        let payload = jwtDecode(this.token) as Token;        
        if (!payload) {
            throw "You must be logged in to edit information!";
        }
        this.user = ((await firstValueFrom(this.cs.getUser(payload._id))).data as User[])[0]; 
        if(!this.user.isGlobalOrg){
            throw "You must be logged as Global organizer ";
        }
        //load engines at first
        await this.loadEngines()
        document.getElementById("addEngineButton")?.addEventListener('click', evt => {
            this.addEngine();
        });
        document.getElementById("deleteSelected")?.addEventListener('click', evt => {
            this.deleteEngine();
        });
        
    }
    deleteEngine(){
        let selectElement = document.getElementById('engineSelect') as HTMLSelectElement;
        let selectedOptions = Array.from(selectElement.selectedOptions);
        
        for (let option of selectedOptions) {
            let engine = {_id: option.innerHTML };
            
            this.cs.deleteEngine( engine as Engine, this.token).subscribe(response => {
                if(response.code == 200){
                    alert("Engine successfully deleted");
                    selectElement.removeChild(option);
                }else{
                    alert(response.message);
                }
            });
        } 
    }

    async loadEngines(){
        this.Engines = (await firstValueFrom(this.cs.getEngines())).data as Engine[];       
        let engineSelect = document.getElementById("engineSelect");

        for (let engine of this.Engines) {
            let option = document.createElement("option");
            option.value = engine._id;
            option.innerHTML = engine._id;

            engineSelect?.appendChild(option);
        } 
    }
    
    addEngine(){            
        
        //create de engine for add
        let newEngineName = (document.getElementById("engineName") as HTMLInputElement)?.value;
        let newEngine : Engine = {
            _id : newEngineName
        }; 
                
        this.cs.addEngine(newEngine, this.token).subscribe(async response =>{                               
                if (response.code == 200) {                    
                    let engineSelect = document.getElementById("engineSelect");
                    if(!engineSelect){
                        return;
                    }
                    engineSelect.textContent = "";
                    await this.loadEngines();
                    alert("New engine added successfully");
                }else{
                    alert(response.message);
                }
            }                                         
        );            
        
    }
    
}