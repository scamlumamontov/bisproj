import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Picture } from '../interfaces';

@Component({
  selector: 'app-picture',
  template: `
    <div class="card">
    <a class="img-wrap" [href]="pic.image" target="_blank" rel="noopener">
      <img [src]="pic.image" [alt]="pic.name" />
    </a>

    <div class="info">
      <div class="id">ID: {{ pic.id }}</div> <!-- теперь внутри карточки -->

      <div class="title">
        {{ pic.name }}
      </div>

      <div class="meta">
        <button class="like-btn" aria-label="like" (click)="onLike()">
          {{ (liked || liked2) ? '❤️' : '🤍' }}
          <span class="likes-count">{{ pic.likes }}</span>
        </button>

        <a class="open-link" [href]="pic.image" target="_blank" rel="noopener">Open</a>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./picture.component.css']
})
export class PictureComponent {
  @Input() pic!: Picture;
  @Input() liked!: boolean;
  @Output() likePress = new EventEmitter<number>();
  liked2!: boolean;

  onLike() {
    if(typeof this.liked != 'undefined'){
      this.liked2 = this.liked;
    }
    this.liked2 = !this.liked2

    this.likePress.emit(this.pic.id);
    this.liked = this.liked2
  }
}