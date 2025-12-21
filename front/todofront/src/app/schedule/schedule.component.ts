import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerService } from '../ser.service';
import { OnInit } from '@angular/core';
import { buffer } from 'stream/consumers';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  schedule: any = {
    /*Monday: {
      "8-9": { name: "Math", room: 404, teacher: "Jiang" },
      "9-10": { name: "Physics", room: 302, teacher: "Lee" },
      "10-11": { name: "English", room: 210, teacher: "Smith" },
    },
    Tuesday: {
      "8-9": { name: "Biology", room: 305, teacher: "Khan" },
      "9-10": { name: "Chemistry", room: 401, teacher: "Kim" },
      "10-11": { name: "PE", room: "Gym", teacher: "Brown" },
    },
    Wednesday: {
      "8-9": { name: "Programming", room: 507, teacher: "Ivanov" },
      "9-10": { name: "Algorithms", room: 509, teacher: "Petrova" },
      "10-11": { name: "Discrete Math", room: 404, teacher: "Jiang" },
    },
    Thursday: {
      "8-9": { name: "History", room: 202, teacher: "Omar" },
      "9-10": { name: "Economics", room: 301, teacher: "Zhang" },
      "10-11": { name: "Art", room: 110, teacher: "Taylor" },
    },
    Friday: {
      "8-9": { name: "Physics Lab", room: "Lab 3", teacher: "Lee" },
      "9-10": { name: "Math", room: 404, teacher: "Jiang" },
      "10-11": { name: "English", room: 210, teacher: "Smith" },
    }*/
  };
  
  lang = localStorage.getItem("lang");
  ru_days:String[] = [];
  buf_days:String[] = ["monday", "tuesday", "wednesday","thursday","friday"];

  constructor(private ser: SerService){
    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
      this.ru_days = this.getRuDays();
    });
  }

  ngOnInit(){
    this.ser.getSchedule().subscribe(
      (cur) => {
        this.schedule = cur[0].json;        
      }
    );
  }

ru_days_map: Record<string, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье'
};

getDays() {
  if (!this.schedule) {
    return [];
  }
  return Object.keys(this.schedule);
}

getDayLabel(day: string): string {
  if (this.lang === 'ru' || this.lang === null) {
    return this.ru_days_map[day.toLowerCase()] ?? day;
  }
  return day;
}

getRuDays(): string[]{
  const days = Object.keys(this.schedule);

    if (this.lang === 'ru' || this.lang === null) {
      return days.map(day =>
        this.ru_days_map[day.toLowerCase()] ?? day
      );
    }

    console.log(days);

    return days;
}


  getTimes(): string[] {
    return ["8-9", "9-10", "10-11", "11-12"];
  }

  formatTime(slot: string): string {
    const [start, end] = slot.split('-');
    return `${start}:00–${end}:00`;
  }
}
