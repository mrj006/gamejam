import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { Response } from '../services/response';
import { Platform } from '../models/platform.model';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';




@Component({
    selector: 'app-engine',
    templateUrl: './platform.component.html',
    styleUrls: ['../../styles.css'],
    
})

export class PlatformComponent implements OnInit {
    platforms: Platform[] = [];    
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
        //load platforms at first
        await this.loadPlatforms()
        document.getElementById("addPlatformButton")?.addEventListener('click', evt => {
            this.addPlatform();
        });
        document.getElementById("deleteSelected")?.addEventListener('click', evt => {
            this.deletePlatform();
        });
        
    }
    deletePlatform(){
        let selectElement = document.getElementById('platformSelect') as HTMLSelectElement;
        let selectedOptions = Array.from(selectElement.selectedOptions);
        
        for (let option of selectedOptions) {
            let platform = {_id: option.innerHTML };
            
            this.cs.deletePlatform( platform as Platform, this.token).subscribe(response => {
                if(response.code == 200){
                    alert("Platform successfully deleted");
                    selectElement.removeChild(option);
                }else{
                    alert(response.message);
                }
            });
        } 
    }

    async loadPlatforms(){
        this.platforms = (await firstValueFrom(this.cs.getPlatforms())).data as Platform[];       
        let platformSelect = document.getElementById("platformSelect");

        for (let platform of this.platforms) {
            let option = document.createElement("option");
            option.value = platform._id;
            option.innerHTML = platform._id;

            platformSelect?.appendChild(option);
        } 
    }
    
    addPlatform(){            
        
        //create de platform for add
        let newPlatformName = (document.getElementById("platformName") as HTMLInputElement)?.value;
        let newPlatform : Platform = {
            _id : newPlatformName
        }; 
                
        this.cs.addPlatform(newPlatform, this.token).subscribe(async response =>{                               
                if (response.code == 200) {                    
                    let platformSelect = document.getElementById("platformSelect");
                    if(!platformSelect){
                        return;
                    }
                    platformSelect.textContent = "";
                    await this.loadPlatforms();
                    alert("New platform added successfully");
                }else{
                    alert(response.message);
                }
            }                                         
        );            
        
    }
}