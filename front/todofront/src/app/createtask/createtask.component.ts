import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { SerService } from '../ser.service';
import { TaskInt } from '../interfaces';

@Component({
  selector: 'app-createtask',
  standalone: true,
  imports: [FormsModule],
  template: `
<div class="create-wrap">
  <div class="create-card">
    <h1 class="title">
      {{ (lang == "ru" || lang == null) ? "Создать задачу" : "Create Task" }}
    </h1>

    <p class="subtitle">
      {{ (lang == "ru" || lang == null)
        ? "Заполните поля и нажмите «Опубликовать»"
        : "Fill in the fields and click “Publish”" }}
    </p>

    <form (ngSubmit)="post()" class="create-form" autocomplete="off" novalidate>

      <div class="form-row">
        <label for="title">
          {{ (lang == "ru" || lang == null) ? "Заголовок" : "Title" }}
        </label>
        <input
          id="title"
          name="title"
          type="text"
          [(ngModel)]="cur.title"
          [placeholder]="(lang == 'ru' || lang == null)
            ? 'Краткое название задачи'
            : 'Short task title'"
          required
        />
      </div>

      <div class="form-row">
        <label for="description">
          {{ (lang == "ru" || lang == null) ? "Описание" : "Description" }}
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          [(ngModel)]="cur.description"
          [placeholder]="(lang == 'ru' || lang == null)
            ? 'Подробности задачи'
            : 'Task details'"
        ></textarea>
      </div>

      <div class="row-two">
        <div class="form-row">
          <label for="start_time">
            {{ (lang == "ru" || lang == null) ? "Начало" : "Start" }}
          </label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            [(ngModel)]="cur.start_time"
          />
        </div>

        <div class="form-row">
          <label for="end_time">
            {{ (lang == "ru" || lang == null) ? "Окончание" : "End" }}
          </label>
          <input
            type="datetime-local"
            id="end_time"
            name="end_time"
            [(ngModel)]="cur.end_time"
          />
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary">
          {{ (lang == "ru" || lang == null) ? "Опубликовать" : "Publish" }}
        </button>
        <button type="button" class="btn btn-ghost" (click)="tasks()">
          {{ (lang == "ru" || lang == null) ? "Отмена" : "Cancel" }}
        </button>
      </div>

    </form>
  </div>
</div>
`
,
  styleUrl: './createtask.component.css'
})
export class CreatetaskComponent {
  cur: TaskInt = {} as TaskInt;
  lang = localStorage.getItem("lang");

  constructor(private ser: SerService, private router: Router) {

    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });
    
  }


  ngOnInit() {
    
  }

  tasks(): void {
    this.router.navigate(['/tasks']);
  }

  post(): void {
  this.cur.completed = false;
  this.cur.user = this.ser.getUserId();

  /*if (this.cur.start_time) {
    this.cur.start_time = new Date(this.cur.start_time).toISOString();
  }

  if (this.cur.end_time) {
    this.cur.end_time = new Date(this.cur.end_time).toISOString();
  }*/

  console.log('SEND', this.cur);

  this.ser.createtask(this.cur).subscribe({
    next: (res) => {
      console.log('good', res);
      this.router.navigate(['/tasks']);
    },
    error: (err) => {
      console.error('400 error', err.error);
    }
  });
}

}
