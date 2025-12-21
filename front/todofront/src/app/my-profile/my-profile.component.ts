import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from '../interfaces';
import { Observable } from 'rxjs';
import { SerService } from '../ser.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  imports:[FormsModule],
  template: `
    <html lang="ru">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- <title>Profile Card</title> -->
    </head>
    <body style="background:#f9fafb; padding:40px; font-family:Inter, sans-serif;">

      <div class="profile-card">

        <div class="profile-header">
          <div class="profile-avatar">
            <img [src]="'http://localhost:8000' + profile.link" alt="avatar" />
          </div>

          <div class="profile-info">
            <h3>{{profile.nickname}}</h3>
            <p class="muted">UserID: {{profile.id}}</p>
            <div style="margin-top:8px;">
              <button class="btn">
                {{ (lang == "ru" || lang == null) ? "Редактировать" : "Edit" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Разделительная линия -->
        <hr style="margin:16px 0; border:none; border-top:1px solid #e6e9ee;" />

        <!-- Форма редактирования (фиктивная) -->
        <form style="margin-top:16px;">
          <div class="form-row">
            <label for="nickname">
              {{ (lang == "ru" || lang == null) ? "Никнейм" : "Nickname" }}
            </label>
            <input id="nickname" name="nickname" type="text" [(ngModel)]="profile.nickname" />
          </div>

          <!-- ID изображения -->
          <div class="form-row">
            <label for="pic">
              {{ (lang == "ru" || lang == null) ? "Id изображения" : "Picture Id" }}
            </label>
            <input id="pic" name="pic" type="number" [(ngModel)]="profile.pic" />
          </div>

          <!-- Описание -->
          <div class="form-row">
            <label for="desc">
              {{ (lang == "ru" || lang == null) ? "Расскажите о себе" : "Tell us about yourself" }}
            </label>
            <input id="desc" name="desc" type="text" [(ngModel)]="profile.desc" />
          </div>

          <div style="display:flex; gap:8px; margin-top:8px;">
            <button type="button" class="btn btn-primary" (click)="saveProfile()">
              {{ (lang == "ru" || lang == null) ? "Сохранить" : "Save" }}
            </button>
            <button type="button" class="btn btn-ghost" (click)="cancel()">
              {{ (lang == "ru" || lang == null) ? "Отмена" : "Cancel" }}
            </button>
          </div>
        </form>

        <!-- Разделительная линия -->
        <hr style="margin:16px 0; border:none; border-top:1px solid #e6e9ee;" />
      </div>

    </body>

  `,
  styleUrl: './my-profile.component.css'
})

export class MyProfileComponent {
  profile!:Profile;
  cur!: Observable<Profile[]>;
  lang = localStorage.getItem("lang");


  cancel(){
    this.router.navigate(['/home']);
  }

  constructor(private ser: SerService, private router: Router){
    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });
  }

  saveProfile() {
    if (!this.profile || !this.profile.id) {
      //console.error('Нет профиля или id для обновления');
      return;
    }
    //console.log("PROFILE: ", this.profile);

    const payload: any = {
      nickname: this.profile.nickname,
      desc: this.profile.desc,
      ...(this.profile.pic !== null ? { pic: this.profile.pic } : {})
    };

    this.ser.updateProfile(this.profile.id, this.profile).subscribe({
      next: (res) => {
        //console.log('Профиль обновлён:', res);
      },
      error: (err) => {
        //console.error('Ошибка при обновлении профиля:', err);
      }
    });
  }


  ngOnInit() {
  this.ser.getMyProfile().subscribe({
    next: (profile) => {
      this.profile = profile;
      //console.log('Профиль:', this.profile);

      if (this.profile.pic) {
        this.ser.getImageById(this.profile.pic).subscribe({
          next: (imgData) => {
            this.profile.link = imgData.image;
            //console.log('Картинка:', this.profile.link);
          },
          error: (err) => console.error('Ошибка при получении изображения:', err)
        });
      }
    },
    error: (err) => console.error('Ошибка при получении профиля:', err)
  });
}


}