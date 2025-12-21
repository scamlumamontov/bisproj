import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerService } from '../ser.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  private readonly BASE_URL = 'http://localhost:8000';

  userId = Number(localStorage.getItem('user_id'));
  receiverId: number | null = null;

  dialogs: any[] = [];
  messages: any[] = [];
  newMessage = '';
  loading = false;
  blockWarning = "";

  lang = localStorage.getItem("lang");
  constructor(private ser: SerService, private route: ActivatedRoute) {
    window.addEventListener('langChange', () => {
      this.lang = localStorage.getItem("lang");
    });
  }

  ngOnInit() {
    this.loadDialogs();
    console.log(this.dialogs);

    this.route.queryParams.subscribe(params => {
      const targetId = Number(params['user']);
      if (targetId) {
        this.waitForDialogsAndSelect(targetId);
      }
    });
  }

  /** Имя собеседника */
  get receiverName() {
    const found = this.dialogs.find(d => d.id === this.receiverId);
    return found?.nickname || 'пользователем';
  }
  
  private normalizeImageUrl(imgField: any): string {
    if (!imgField) return '';

    const str = String(imgField).trim();
    if (!str) return '';

    if (str.startsWith('http://') || str.startsWith('https://')) {
      return str;
    }

    if (str.startsWith('/')) {
      return this.BASE_URL + str;
    }

    return this.BASE_URL + '/' + str;
  }

  loadDialogs() {
    this.loading = true;

    this.ser.getDialogs(this.userId).pipe(
      switchMap((users: any[]) => {
        const reqs = users.map(u =>
          this.ser.getProfileById(u.id).pipe(
            switchMap(profile => {
              const nick = profile?.nickname || u.username || 'Неизвестно';

              if (profile?.pic) {
                return this.ser.getImageById(profile.pic).pipe(
                  map(img => {
                    const raw = img?.image || img;
                    const link = this.normalizeImageUrl(raw);
                    return {
                      id: u.id,
                      nickname: nick,
                      link: link
                    };
                  }),
                  catchError(() => of({
                    id: u.id,
                    nickname: nick,
                    link: ''
                  }))
                );
              }

              // нет картинки у профиля
              return of({
                id: u.id,
                nickname: nick,
                link: '' // пустая строка — в шаблоне используем fallback image
              });
            }),
            catchError(() => of({
              id: u.id,
              nickname: u.username || 'Неизвестно',
              link: ''
            }))
          )
        );

        return forkJoin(reqs);
      })
    ).subscribe({
      next: dialogs => {
        this.dialogs = dialogs;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  /** Автоподбор собеседника из URL */
  private waitForDialogsAndSelect(targetId: number) {
    const timer = setInterval(() => {
      if (this.dialogs.length > 0 || !this.loading) {
        clearInterval(timer);

        const found = this.dialogs.find(d => d.id === targetId);
        if (found) {
          this.selectReceiver(found);
          return;
        }

        // Если профиля нет среди диалогов — подгружаем
        this.ser.getProfileById(targetId).pipe(
          switchMap(profile => {
            const nick = profile?.nickname || 'Пользователь';
            if (profile?.pic) {
              return this.ser.getImageById(profile.pic).pipe(
                map(img => {
                  const raw = img?.image || img;
                  const link = this.normalizeImageUrl(raw);
                  return {
                    id: targetId,
                    nickname: nick,
                    link: link
                  };
                }),
                catchError(() => of({
                  id: targetId,
                  nickname: nick,
                  link: ''
                }))
              );
            }

            return of({
              id: targetId,
              nickname: nick,
              link: ''
            });
          }),
          catchError(() => of({
            id: targetId,
            nickname: 'Пользователь',
            link: ''
          }))
        ).subscribe(dialog => {
          this.dialogs.push(dialog);
          this.selectReceiver(dialog);
        });
      }
    }, 200);
  }

  /** Выбор собеседника */
  selectReceiver(user: any) {
    this.receiverId = user.id;
    this.loadMessages();
    setTimeout(() => this.checkBlockStatus(), 20);
  }

  /** Сообщения */
  loadMessages() {
    if (!this.receiverId) return;

    this.ser.getMessages(this.userId, this.receiverId).subscribe({
      next: msgs => (this.messages = msgs),
      error: err => console.error("Ошибка загрузки сообщений", err)
    });
  }

  /** Проверяем блокировки */
  checkBlockStatus() {
    if (!this.receiverId) return;

    forkJoin({
      meBlockedHim: this.ser.getBlockStatus(this.userId, this.receiverId),
      heBlockedMe: this.ser.getBlockStatus(this.receiverId, this.userId),
    })
    .subscribe(({ meBlockedHim, heBlockedMe }) => {
      if (meBlockedHim?.blocked) {
        if(this.lang == "ru" || this.lang == null) this.blockWarning = "Вы заблокировали этого пользователя.";
        else this.blockWarning = "You have blocked this user.";
      } else if (heBlockedMe?.blocked) {
        if(this.lang == "ru" || this.lang == null) this.blockWarning = "Этот пользователь заблокировал вас.";
        else this.blockWarning = "This user has blocked you.";
      } else {
        this.blockWarning = "";
      }
    });
  }

  /** Отправка сообщения */
  sendMessage() {
    //console.log("SENDMESSAGECLICKED");
    //console.log(this.newMessage);
    if (!this.newMessage.trim() || !this.receiverId) return;

    if (this.blockWarning) {
      alert(this.blockWarning);
      return;
    }

    this.ser.sendMessage(this.userId, this.receiverId, this.newMessage).subscribe({
      next: msg => {
        this.messages.push(msg);
        this.newMessage = '';
      },
      error: err => console.error("Ошибка отправки:", err)
    });
  }
}
