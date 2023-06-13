import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection';
import { Platform } from '../models/platform.model';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';
import jwtDecode from 'jwt-decode';
import { Token } from '../services/token';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Router } from '@angular/router';




@Component({
    selector: 'app-engine',
    templateUrl: './platform.component.html',
    styleUrls: ['../../styles.css'],
    
})

export class PlatformComponent implements OnInit {
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

        await this.loadPlatforms()
        
        document.getElementById("addPlatformButton")?.addEventListener('click', evt => {
            this.addPlatform();
        });
        
        document.getElementById("deleteSelected")?.addEventListener('click', evt => {
            this.deletePlatform();
        });
        
    }

    deletePlatform() {
        let selectElement = document.getElementById('platformSelect') as HTMLSelectElement;
        let selectedOptions = Array.from(selectElement.selectedOptions);
        
        for (let option of selectedOptions) {
            let platform: Platform = {_id: option.innerHTML };
            
            this.cs.deletePlatform(platform, this.token).subscribe(response => {
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
        let platforms = (await firstValueFrom(this.cs.getPlatforms())).data as Platform[];       
        let platformSelect = document.getElementById("platformSelect");

        if(!platformSelect) return;
        platformSelect.textContent = "";

        for (let platform of platforms) {
            let option = document.createElement("option");
            option.value = platform._id;
            option.innerHTML = platform._id;

            platformSelect?.appendChild(option);
        } 
    }
    
    addPlatform(){            
        let _id = (document.getElementById("platformName") as HTMLInputElement)?.value;
        let platform: Platform = {
            _id
        }; 
                
        this.cs.addPlatform(platform, this.token).subscribe(async response =>{                               
                if (response.code == 200) {                    
                    await this.loadPlatforms();
                    alert("New platform added successfully");
                } else alert(response.message);
            }                                         
        );            
        
    }
}