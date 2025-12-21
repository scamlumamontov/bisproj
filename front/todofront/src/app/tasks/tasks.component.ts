import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { NgFor, NgIf } from '@angular/common';
import { SerService } from '../ser.service';
import { TaskInt } from '../interfaces';
import { Observable } from 'rxjs';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  imports: [NgFor, NgIf, TaskComponent, FormsModule],
  template: `
  <h2 *ngIf="checklocal()">
    {{ (lang == "ru" || lang == null)
      ? "Сначала необходимо войти в систему!"
      : "You need to log in first!" }}
  </h2>

  <div class="search-box">
    <input
      type="text"
      [placeholder]="(lang == 'ru' || lang == null)
        ? 'Поиск по заголовку или описанию...'
        : 'Search by title or description...'"
      [(ngModel)]="searchText"
      (input)="applyFilter()"
    >
  </div>

  <div class="tasks">
    <app-task
      *ngFor="let k of filteredList; index as id"
      [task]="k"
      [id]="id"
      [lang] = "lang">
    </app-task>
  </div>
`,

  styleUrl: './tasks.component.css'
})

export class TasksComponent {
  tasklist: TaskInt[] = [];
  filteredList: TaskInt[] = []; // что показываем на экране
  searchText: string = "";
  cur!: Observable<TaskInt[]>;
  lang = localStorage.getItem("lang");

  constructor(private ser: SerService){}

  checklocal(): boolean {
    let buf = localStorage.getItem('refresh') || "";
    return buf === "";
  }

  ngOnInit(){
    this.cur = this.ser.getTasks();
    this.cur.subscribe(tasks => {
      this.tasklist = tasks;
      this.filteredList = tasks;  // изначально показываем всё
    });

    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });

  }

  applyFilter(): void {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredList = this.tasklist;
      return;
    }

    this.filteredList = this.tasklist.filter(task =>
      (task.title && task.title.toLowerCase().includes(text)) ||
      (task.description && task.description.toLowerCase().includes(text))
    );
  }
}
