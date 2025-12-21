import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginInt } from '../interfaces';
import { FormsModule } from "@angular/forms";
import { SerService } from '../ser.service';
import { Router } from '@angular/router';
import { Profile } from '../interfaces';

@Component({
  selector: 'app-root',
  imports: [RouterModule, FormsModule],
  template:`
  <div class="login-wrap">
  <div class="login-card" role="main" aria-labelledby="loginTitle">
    <h1 id="loginTitle">
      {{ (lang == "ru" || lang == null) ? "Вход в систему" : "Sign In" }}
    </h1>

    <p class="lead">
      {{ (lang == "ru" || lang == null)
        ? "Введите ваши учётные данные, чтобы продолжить"
        : "Enter your credentials to continue" }}
    </p>

    <form (ngSubmit)="login()" class="login-form" autocomplete="on" novalidate>
      <fieldset class="field">
        <label for="username">
          {{ (lang == "ru" || lang == null) ? "Логин" : "Username" }}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          [(ngModel)]="authModel.username"
          required
          autocomplete="username"
          [placeholder]="(lang == 'ru' || lang == null)
            ? 'Введите логин'
            : 'Enter username'"
        />
      </fieldset>

      <fieldset class="field">
        <label for="password">
          {{ (lang == "ru" || lang == null) ? "Пароль" : "Password" }}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          [(ngModel)]="authModel.password"
          required
          autocomplete="current-password"
          [placeholder]="(lang == 'ru' || lang == null)
            ? 'Введите пароль'
            : 'Enter password'"
        />
      </fieldset>

      <div class="actions">
        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="!authModel.username || !authModel.password"
        >
          {{ (lang == "ru" || lang == null) ? "Войти" : "Sign In" }}
        </button>
      </div>
    </form>

    <p class="help">
      {{ (lang == "ru" || lang == null)
        ? "При успешном входе вас перенаправит на другую страницу"
        : "After a successful login, you will be redirected to another page" }}
    </p>
  </div>
</div>

    `
  ,
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent {
  title = 'hh-front';
  authModel: LoginInt;
  profile!:Profile;
  lang = localStorage.getItem("lang");

  //private ser: SerService
  constructor(private ser: SerService, private router: Router){
    this.authModel = {} as LoginInt
    
  window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });

  }

  getUserFromToken(): number | null {
    const token = localStorage.getItem('access');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.user_id;

      if (userId) {
        localStorage.setItem('user_id', userId.toString());
        return userId;
      }

      return null;
    } catch (e) {
      console.error('Ошибка чтения токена:', e);
      return null;
    }
}


  login() {
  this.ser.login(this.authModel).subscribe({
    next: (token) => {
      localStorage.setItem('access', token.access);
      localStorage.setItem('refresh', token.refresh);

      const userId = this.getUserFromToken();

      if (!userId) {
        console.error("Не удалось получить user_id из токена");
        return;
      }

      console.log("USER ID:", userId);

      this.ser.getProfileById(userId).subscribe({
        next: (p) => {
          //console.log("Профиль:", p)
          localStorage.setItem('username', p.nickname.toString());
          console.log(localStorage.getItem('username'))
        },
        error: (err) => {} //console.error("Ошибка получения профиля", err)
      });

      this.router.navigate(['/home']);
    },
    error: (err) => {
      console.error("Ошибка логина", err);
    }
  });
}


  ngOnInit(){
  }
}