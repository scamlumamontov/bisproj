import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SerService } from './ser.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">

  <header class="header">
    <div class="logo">
      ❄️ <span>SSN</span> 🎄
    </div>

    <div class="lang-switch">
      <button [class.active]="lang === 'ru'" (click)="russian()">RU</button>
      <span>|</span>
      <button [class.active]="lang === 'eng'" (click)="english()">ENG</button>
    </div>
  </header>

  <nav class="nav">
    <button (click)="home()">🏠 {{ lang === 'ru' || !lang ? 'Главная' : 'Home' }}</button>
    <button (click)="tasks()">📋 {{ lang === 'ru' || !lang ? 'Все задачи' : 'Tasks' }}</button>
    <button (click)="myposts()">⭐ {{ lang === 'ru' || !lang ? 'Мои задачи' : 'My tasks' }}</button>
    <button (click)="create()">➕ {{ lang === 'ru' || !lang ? 'Создать' : 'Create' }}</button>
    <button (click)="messages()">💬 {{ lang === 'ru' || !lang ? 'Сообщения' : 'Messages' }}</button>
    <button (click)="schedule()">📆 {{ lang === 'ru' || !lang ? 'Расписание' : 'Schedule' }}</button>
    <button (click)="gallery()">🖼️ {{ lang === 'ru' || !lang ? 'Галерея' : 'Gallery' }}</button>
    <button (click)="myprofile()">👤 {{ lang === 'ru' || !lang ? 'Мой Профиль' : 'My Profile' }}</button>
    <button (click)="profiles()">👤👤 {{ lang === 'ru' || !lang ? 'Профили' : 'Profiles' }}</button>
  </nav>

  <main class="content">
    <router-outlet></router-outlet>
  </main>

</div>

  `,
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'todofront';
  lang: string | null = null;

  constructor(
    private router: Router,
    private ser: SerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ localStorage ТОЛЬКО в браузере
    if (isPlatformBrowser(this.platformId)) {
      this.lang = localStorage.getItem('lang');
    }
  }

  russian() {
    this.ser.changeLang('ru');
    this.lang = 'ru';
  }

  english() {
    this.ser.changeLang('eng');
    this.lang = 'eng';
  }

  messages() { this.router.navigate(['/messages']); }
  schedule() { this.router.navigate(['/schedule']); }
  home() { this.router.navigate(['/home']); }
  profiles() { this.router.navigate(['/profiles']); }
  myprofile() { this.router.navigate(['/myprofile']); }
  gallery() { this.router.navigate(['/gallery']); }
  myposts() { this.router.navigate(['/myposts']); }
  tasks() { this.router.navigate(['/tasks']); }
  login() { this.router.navigate(['/login']); }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access', '');
      localStorage.setItem('refresh', '');
    }
    this.router.navigate(['/login']);
  }

  create() { this.router.navigate(['/createtask']); }
}
