import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerService } from '../ser.service';
import { Profile } from '../interfaces';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profiles-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  
    <div class="profiles-container">
      <h2>
        {{ (lang == "ru" || lang == null) ? "Профили пользователей" : "Profiles" }}
      </h2>

      <!-- Поиск -->
      <div class="search-bar">
        <input
          type="text"

        [placeholder]="(lang == 'ru' || lang == null)
            ? 'Поиск по нику'
            : 'Search by nickname'"
          [(ngModel)]="search"
          (input)="onSearch()"
        />
      </div>

      <!-- Список профилей -->
      <div *ngIf="filtered.length; else empty">
        <div *ngFor="let p of filtered" class="profile-row" [routerLink]="['/profile', p.id]" style="cursor:pointer;" >
          <div class="avatar">
            <img [src]="'http://localhost:8000' + p.link" alt="avatar" />
          </div>
          <div class="info">
            <h3>{{ p.nickname }}</h3>
            <p>ID: {{ p.id }}</p>
          </div>
        </div>
      </div>

      <ng-template #empty>
        <p class="muted">
          {{(lang == 'ru' || lang == null)
            ? "Профили не найдены." : "No profiles were found." }}
        </p>
      </ng-template>
    </div>
  `,
  styleUrls: ['./profiles-list.component.css']
})
export class ProfilesListComponent implements OnInit {
  profiles: Profile[] = [];
  filtered: Profile[] = [];
  search = '';
  loading = false;
  lang = localStorage.getItem("lang");

  constructor(private ser: SerService) {
    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });
  }

  ngOnInit() {
    this.loading = true;

    this.ser.getAllProfiles()
      .pipe(
        switchMap((profiles) => {
          const requests = profiles.map(p =>
            p.pic
              ? this.ser.getImageById(p.pic).pipe(
                  map(img => ({ ...p, link: img.image })),
                  catchError(() => of({ ...p, link: '' }))
                )
              : of({ ...p, link: '' })
          );
          return forkJoin(requests);
        })
      )
      .subscribe({
        next: (profilesWithImages) => {
          this.profiles = profilesWithImages;
          this.filtered = profilesWithImages;
          this.loading = false;
          //console.log('Профили с линками:', this.profiles);
        },
        error: (err) => {
          //console.error('Ошибка при получении профилей:', err);
          this.loading = false;
        }
      });
  }

  onSearch() {
    const term = this.search.trim().toLowerCase();
    this.filtered = this.profiles.filter(p =>
      p.nickname.toLowerCase().includes(term)
    );
  }
}
