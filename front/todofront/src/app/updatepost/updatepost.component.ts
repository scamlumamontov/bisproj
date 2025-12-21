import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { TaskInt } from '../interfaces';
import { ActivatedRoute, Route } from '@angular/router';
import { inject } from '@angular/core';
import { SerService } from '../ser.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updatepost',
  imports: [FormsModule],
  template:`
  <div class="task-card">

    <h2 class="title">Редактирование задачи #{{task.id}}</h2>

    <div class="row">
      <span class="label">Статус:</span>
      <select [(ngModel)]="task.completed" class="input">
        <option [ngValue]="true">Выполнено</option>
        <option [ngValue]="false">В процессе</option>
      </select>
    </div>

    <div class="row">
      <span class="label">Название:</span>
      <input type="text" class="input" [(ngModel)]="task.title">
    </div>

    <div class="row">
      <span class="label">Описание:</span>
      <textarea class="input" rows="3" [(ngModel)]="task.description"></textarea>
    </div>

    <div class="row">
      <span class="label">Автор:</span>
      <input type="text" class="input" [(ngModel)]="task.user">
    </div>

    <div class="row">
      <span class="label">Создано:</span>
      <span>{{task.created_at}}</span>
    </div>

    <div class="row">
      <span class="label">Начало:</span>
      <input type="datetime-local" class="input" [(ngModel)]="task.start_time">
    </div>

    <div class="row">
      <span class="label">Конец:</span>
      <input type="datetime-local" class="input" [(ngModel)]="task.end_time">
    </div>

    <div class="actions">
      <button class="btn save" (click)="post()">Сохранить</button>
      <button class="btn cancel" (click)="cancel()">Отмена</button>
    </div>

  </div>
`,
  styleUrl: './updatepost.component.css'
})
export class UpdatepostComponent {
  @Input() task!:TaskInt;
  id!:number;
  cur!: Observable<TaskInt>;
  status:boolean = true;


  constructor(private ser:SerService, private router: Router){

  }

  cancel():void{
    this.router.navigate(['/myposts'])
  }

  private route = inject(ActivatedRoute);
  ngOnInit(){
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.cur = this.ser.getTask(this.id);
      this.cur.subscribe({
        next: task => {
          this.task = task;
        },
        error: err => {
          this.status = false;
        }
    });
    });
  }

  post():void{
    this.ser.updateTask(this.task).subscribe({
      next: updatedTask => {
        console.log('ok', updatedTask);
        this.router.navigate(['/myposts']);
      },
      error: err => {
        console.error('error', err);
      }
    });
    this.router.navigate(['/myposts']);
  }

}
