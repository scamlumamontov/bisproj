
import { Component } from '@angular/core';
import { Picture } from '../interfaces';
import { SerService } from '../ser.service';
import { Observable } from 'rxjs';
import { NgFor } from '@angular/common';
import { PictureComponent } from '../picture/picture.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourites',
  imports: [NgFor, PictureComponent],
  template: `

      <div class="btn-container">
        <div></div>
        <button class="cool-btn gallery-btn" (click)="gallery()">
          {{ (lang == "ru" || lang == null) ? "📷 Галерея" : "📷 Gallery" }}
        </button>
        <button class="upload-btn" (click)="upload()">
          {{ (lang == "ru" || lang == null) ? "⬆️ Загрузить" : "⬆️ Upload" }}
        </button>
        <button class="cool-btn fav-btn" (click)="favourites()">
          {{ (lang == "ru" || lang == null) ? "❤️ Понравившиеся" : "❤️ Favourites" }}
        </button>
        <div></div>
      </div>

    <div class="box">
        <app-picture 
          *ngFor="let k of pics" 
          [pic]="k"
          [liked]="liked[k.id]"
          (likePress)="onLikePressed($event)">
        </app-picture>
    </div>
  `,
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent {
  pics: Picture[] = [];
  liked: { [id: number]: boolean } = {};
  lang = localStorage.getItem("lang");

  gallery(){ this.router.navigate(['/gallery']); }
  favourites(){ this.router.navigate(['/favourites']); }
  upload(){ this.router.navigate(['/upload']); }

  constructor(private ser: SerService, private router: Router) {
    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });
  }

  ngOnInit() {
    this.ser.getFavourite().subscribe(pics => {
      this.pics = pics;

      this.pics.forEach(pic => {
        this.ser.getLikeStatus(pic.id).subscribe(res => {
          this.liked[pic.id] = res.liked;
          pic.likes = res.likes;

          this.liked = { ...this.liked };
        });
      });
    });
  }

  onLikePressed(id: number) {
    this.ser.toggleLike(id).subscribe({
      next: (res: any) => {
        const pic = this.pics.find(p => p.id === id);
        if (pic) {
          pic.likes = res.likes;
          this.liked[id] = res.liked;
          this.liked = { ...this.liked };
        }
      },
      error: err => {
        console.error("Ошибка лайка:", err);
      }
    });
  }
}
