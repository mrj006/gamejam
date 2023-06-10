import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-engine',
    templateUrl: './engine.component.html',
    styleUrls: ['../../styles.css']
})
export class EngineComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.init();
    }

    init() {
       
    }
}