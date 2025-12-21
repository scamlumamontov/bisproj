import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Profile, Blocked } from '../interfaces';
import { SerService } from '../ser.service';
import { Router } from '@angular/router';
import { switchMap, of, map, catchError } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template:`
  
  <div class="profile-card">
  <div class="profile-header">
    <div class="profile-avatar">
      <img [src]="'http://localhost:8000' + profile.link" alt="avatar" />
    </div>

    <div class="profile-info">
      <h3>{{ profile.nickname }}</h3>
      <p class="muted">UserID: {{ profile.id }}</p>
    </div>
  </div>

  <hr style="margin:16px 0; border:none; border-top:1px solid #e6e9ee;" />

  <div class="grid-2">
    <div>
      <div class="kv-label">ID изображения</div>
      <div class="kv-value">{{ profile.pic }}</div>
    </div>

    <div>
      <div class="kv-label">Описание</div>
      <div class="kv-value">{{ profile.desc || '—' }}</div>
    </div>
  </div>

  <hr style="margin:16px 0; border:none; border-top:1px solid #e6e9ee;" />

  <div class="profile-actions">
    <button class="btn btn-primary" (click)="startChat(profile.id)">Написать</button>

    <button 
      class="btn" 
      [ngClass]="(blocked || blocked2) ? 'btn-secondary' : 'btn-danger'" 
      (click)="toggleBlock()">

      {{ blocked ? 'Разблокировать' : 'Заблокировать' }}
  </button>
  
  </div>
</div>

  
  `,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile!: Profile;
  id!: number;
  blocked: Boolean = false;
  blocked2!: Boolean;
  currentUserId!:number;

  constructor(
    private ser: SerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  startChat(userId: number) {
    console.log('Переход к пользователю', userId);
    this.router.navigate(['/messages'], { queryParams: { user: userId } })
      .then(success => console.log('Навигация:', success))
      .catch(err => console.error('Ошибка навигации:', err));
  }

  toggleBlock() {
    this.ser.toggleBlock(this.currentUserId, this.profile.id)
      .subscribe({
        next: (res) => {
          this.blocked = res.blocked;
          this.blocked2 = this.blocked;
          console.log("Статус изменён:", this.blocked);
        },
        error: err => console.error("Ошибка блокировки:", err)
      });
  }


  ngOnInit() {
  this.currentUserId = Number(localStorage.getItem("user_id"));

  this.route.paramMap
    .pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (!idParam) return of(null);

        this.id = +idParam;

        // 1) Загружаем профиль
        return this.ser.getProfileById(this.id).pipe(
          switchMap(profile => {
            this.profile = profile;

            // 2) Загружаем аватар пользователя
            if (profile.pic) {
              return this.ser.getImageById(profile.pic).pipe(
                map(img => ({
                  ...profile,
                  link: img.image
                })),
                catchError(() =>
                  of({
                    ...profile,
                    link: ''
                  })
                )
              );
            }

            return of({
              ...profile,
              link: ''
            });
          })
        );
      })
    )
    .subscribe({
      next: (profileWithLink) => {
        if (!profileWithLink) return;

        this.profile = profileWithLink;

        // 3) Проверяем блокировку
        this.ser.getBlockStatus(this.currentUserId, this.profile.id)
          .subscribe(res => {
            this.blocked = res.blocked;
            this.blocked2 = this.blocked;
            console.log("Статус блокировки:", this.blocked);
          });
      },
      error: err => console.error("Ошибка загрузки профиля:", err)
    });
}


}
