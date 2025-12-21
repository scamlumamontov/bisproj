import { Component, Input } from '@angular/core';
import { TaskInt } from '../interfaces';
import { DatePipe } from '@angular/common';
import { SerService } from '../ser.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports:[DatePipe],
  template: `
  <div class="task-card">

    <div class="task-header">
      <span class="task-id">#{{task.id}}</span>
      <span class="status" [class.done]="task.completed" [class.pending]="!task.completed">
        {{ task.completed ? 
        'Completed' : 'In progress' }}
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
      <span>{{task.created_at | date:'dd.MM.yyyy HH:mm'}}</span>
    </div>

    <div class="row">
      <span class="label">
        {{(lang == 'ru' || lang == null) ? "Начало: " : "Start time: "}}  
      </span>
      <span>{{task.start_time || '—' }}</span>
    </div>

    <div class="row">
      <span class="label">
        {{(lang == 'ru' || lang == null) ? "Конец: " : "End time: "}}  
      </span>
      <span>{{task.end_time || '—' }}</span>
    </div>

  </div>
  `,
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() task!: TaskInt;
  @Input() lang!:any;

  constructor(private ser: SerService){
    
  }
}
