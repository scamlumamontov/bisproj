import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SerService } from '../ser.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  lang = localStorage.getItem("lang");
  username = localStorage.getItem('username') || ((this.lang == "ru" || this.lang == null) ? "Гость" 
  : "guest");

  constructor(private ser: SerService){
    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });
  }
}