import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../services/connection';
import { Response } from '../services/response';
import { Platform } from '../models/platform.model';




@Component({
    selector: 'app-engine',
    templateUrl: './platform.component.html',
    styleUrls: ['../../styles.css'],
    
})

export class PlatformComponent implements OnInit {
    Platforms: Platform[] = []; 
    
    constructor(private cs: ConnectionService, private router: Router) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
        this.loadPlatforms()
        document.getElementById("addPlatformButton")?.addEventListener('click', evt => {
            this.addPlatform();
        });
        
    }
    loadPlatforms(){
        this.cs.getPlatforms().subscribe(
            (response: Response)=> {
                if (response.code == 200){
                    this.Platforms = response.data??[];
                }else {
                    console.log(response.code +' '+response.message );
                }

            }
        )
    }
    
    addPlatform(){
        let newPlatformName = (document.getElementById("platformName") as HTMLInputElement)?.value;
        let newPlatform : Platform = {
            _id : newPlatformName
        };
        this.cs.addPlatform(newPlatform).subscribe(
            (response : Response) =>{
                if (response.code == 200){                    
                    this.loadPlatforms();
                }
            }
        )
    }
    
}