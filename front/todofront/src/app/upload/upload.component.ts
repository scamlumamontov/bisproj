import { Component } from '@angular/core';
import { SerService } from '../ser.service';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
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

    <div class="upload-box">
      <input type="text" [(ngModel)]="name" placeholder="Название картинки" class="upload-input" />
      <input type="file" (change)="onFileSelected($event)" class="upload-input" />
      <button class="upload-btn2" (click)="onUpload()">⬆️ Upload</button>
    </div>

  `,
  imports: [FormsModule],
  styleUrl: `./upload.component.css`
})
export class UploadComponent {
  selectedFile!: File;
  name: string = "";

  gallery(){ this.router.navigate(['/gallery']); }
  favourites(){ this.router.navigate(['/favourites']); }
  upload(){ this.router.navigate(['/upload']); }
  lang = localStorage.getItem("lang");

  constructor(private ser: SerService, private router: Router) {
    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      this.ser.uploadImage(this.selectedFile, this.name).subscribe({
        //next: res => console.log("Success", res),
        //error: err => console.error("Error", err)
      });
    }
    this.router.navigate(['/gallery']);
  }
}