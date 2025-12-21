import { Component } from '@angular/core';
import { TaskInt } from '../interfaces';
import { Input, Output } from '@angular/core';
import { SerService } from '../ser.service';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [],
  template:`
  <div class="task-card">

    <div class="task-header">
      <span class="task-id">#{{task.id}}</span>
      <span class="status" [class.done]="task.completed" [class.pending]="!task.completed">
        {{ task.completed ? 'Выполнено' : 'В процессе' }}
      </span>
    </div>

    <h2 class="title">{{task.title}}</h2>

    <p class="desc">{{task.description}}</p>

    <div class="row">
      <span class="label">
        {{(lang == 'ru' || lang == null) ? "Автор: " : "Author: "}}
      </span>
      <span>{{task.user}}</span>
    </div>

    <div class="row">
      <span class="label">
        {{(lang == 'ru' || lang == null) ? "Создано: " : "Created at: "}}
      </span>
      <span>{{task.created_at}}</span>
    </div>

    <div class="row">
      <span class="label">
        {{(lang == 'ru' || lang == null) ? "Начало: " : "Start time: "}}  
      </span>
      <span>{{task.start_time ? (task.start_time) : '—' }}</span>
    </div>

    <div class="row">
      <span class="label">
        {{(lang == 'ru' || lang == null) ? "Конец: " : "End time: "}}  
      </span>
      <span>{{task.end_time ? (task.end_time) : '—' }}</span>
    </div>

    <div class="actions">
      <button class="btn update" (click)="update(task.id)">
         {{(lang == 'ru' || lang == null) ? "Изменить" : "Update"}}  
      </button>
      <button class="btn delete" (click)="delete(task.id)">
        {{(lang == 'ru' || lang == null) ? "Удалить" : "Delete"}}
      </button>
    </div>

  </div>
`,
  styleUrl: './post.component.css'
})
export class PostComponent {
  @Input() task!:TaskInt;
  @Input() lang!:any;
  @Output() DeletePress = new EventEmitter<number>();

  constructor(private ser:SerService, private router: Router){

  }

  update(id:number): void{
    console.log("Update clicked!");
    console.log(`myposts/${id}`);
    this.router.navigate([`myposts/${id}`]);
  }

  delete(id: number): void {
    this.ser.deleteTask(id)
      .subscribe({
        next: () => {
          this.DeletePress.emit(this.task.id);
          console.log(`Task ${id} deleted`);
        },
        error: err => {
          console.error('Delete failed', err);
        }
      });
  }
}
