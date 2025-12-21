import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginInt, TaskInt } from '../interfaces';
import { FormsModule } from "@angular/forms";
import { SerService } from '../ser.service';
import { Router } from '@angular/router';
import { TaskComponent } from "../task/task.component";
import { NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-taskbyid',
  imports: [RouterModule, FormsModule, TaskComponent, NgIf],
  template:`
    <fieldset>
        <label>ID</label>
        <input type="text" [(ngModel)] = "id">
    </fieldset>
    <button (click)="send()">Search!</button>
    
    <app-task [task]="inst" *ngIf="status && auth()"></app-task>

  `,
  styleUrl: './taskbyid.component.css'
})
export class TaskbyidComponent {
  id!:number;
  id1!:number;
  cur!: Observable<TaskInt>;
  inst!:TaskInt;
  tasklist!:TaskInt[];
  status:boolean = true;



  constructor(private ser: SerService){
  }

  auth():boolean{
    let f = localStorage.getItem('refresh');
    if(f) return true;
    return false;
  }

  send(){
    this.id1 = this.id;
    if (!this.id1) return;
  
    this.cur = this.ser.getTask(this.id);
    this.cur.subscribe({
      next: task => {
        this.inst = task;
        this.status = true;
      },
      error: err => {
        this.status = false;
      }
    });

  }
}
