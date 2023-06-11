import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../services/connection';
import { Response } from '../services/response';
import { Engine } from '../models/engine.model';




@Component({
    selector: 'app-engine',
    templateUrl: './engine.component.html',
    styleUrls: ['../../styles.css'],
    
})

export class EngineComponent implements OnInit {
    Engines: Engine[] = []; 
    
    constructor(private cs: ConnectionService, private router: Router) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
        this.loadEngines()
        document.getElementById("addEngineButton")?.addEventListener('click', evt => {
            this.addEngine();
        });
        
    }
    loadEngines(){
        this.cs.getEngines().subscribe(
            (response: Response)=> {
                if (response.code == 200){
                    this.Engines = response.data??[];
                }else {
                    console.log(response.code +' '+response.message );
                }

            }
        )
    }
    
    addEngine(){
        let newEngineName = (document.getElementById("engineName") as HTMLInputElement)?.value;
        let newEngine : Engine = {
            _id : newEngineName
        };
        this.cs.addEngine(newEngine).subscribe(
            (response : Response) =>{
                if (response.code == 200){
                    console.log("la mica entró ");
                    this.loadEngines();
                }
            }
        )
    }
    
}