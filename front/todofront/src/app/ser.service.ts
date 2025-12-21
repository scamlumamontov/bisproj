import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { $locationShim } from '@angular/common/upgrade';
import { LoginInt, TokenInt, TaskInt, Picture, Profile, Blocked } from './interfaces';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from './interfaces';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SerService {
  constructor(private http: HttpClient) {
    
  }
  private tasks = new BehaviorSubject<TaskInt[]>([]);


  private likesMap = new Map<number, BehaviorSubject<boolean>>();

  changeLang(lang: string) {
    localStorage.setItem('lang', lang);
    window.dispatchEvent(new Event('langChange'));
  }

  getLang(): string | null {
    return localStorage.getItem('lang');
  }

  getLikeStatusSer(id: number): Observable<boolean> {
    if (!this.likesMap.has(id)) {
      this.likesMap.set(id, new BehaviorSubject<boolean>(false));
    }
    return this.likesMap.get(id)!.asObservable();
  }

  setLikeStatusSer(id: number, liked: boolean) {
    if (!this.likesMap.has(id)) {
      this.likesMap.set(id, new BehaviorSubject<boolean>(liked));
    } else {
      this.likesMap.get(id)!.next(liked);
    }
  }
  
  getMyProfile(): Observable<any> {
    const baseUrl = "http://localhost:8000/api";
    return this.http.get<{ id: number }>(`${this.baseUrl}/myid`)
      .pipe(
        switchMap(data => this.http.get(`${this.baseUrl}/profile/${data.id}`))
      );
  }

  updateProfile(id: number, data: Profile) {
    const baseUrl = 'http://localhost:8000/api';
    const cleanData = { ...data };
    delete (cleanData as any).link;

    return this.http.put(`${baseUrl}/profile/${id}`, cleanData);
  }

  getProfileById(id: number): Observable<Profile> {
    return this.http.get<Profile>(`http://127.0.0.1:8000/api/profile/${id}`);
  }

getImageById(id: number): Observable<{ id: number; image: string }> {
  return this.http.get<{ id: number; image: string }>(`http://127.0.0.1:8000/api/pictures/${id}/`);
}

getBlockStatus(user1: number, user2: number) {
  let apiUrl = "http://localhost:8000/api";
  return this.http.get<Blocked>(`${apiUrl}/isblocked/${user1}/${user2}/`);
}

toggleBlock(user1: number, user2: number) {
  let apiUrl = "http://localhost:8000/api";
  return this.http.post<Blocked>(`${apiUrl}/block/${user1}/${user2}/`, {});
}

getDialogs(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/dialogs/${userId}/`);
}

getSchedule(): Observable<any> {
  console.log(this.http.get(`${this.baseUrl}/schedule/`) );
    return this.http.get(`${this.baseUrl}/schedule/`);
}

getMessages(user1: number, user2: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/messages/${user1}/${user2}/`);
}

sendMessage(user1: number, user2: number, content: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/messages/`, { user1, user2, content });
}

uploadImage(file: File, name: string) {
  const url = "http://localhost:8000/api/upload/";

  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", name);

  return this.http.post(url, formData);
}

  getAllProfiles(): Observable<Profile[]>{
    let url = "http://localhost:8000/api/profiles"
    return this.http.get<Profile[]>(url)
  }

  private pics = new BehaviorSubject<Picture[]>([]);
  getImages(): Observable<Picture[]>{
    let url = "http://localhost:8000/api/upload/"
    return this.http.get<Picture[]>(url)
  }

  getFavourite(): Observable<Picture[]>{
    let url = "http://localhost:8000/api/pictures/favourite"
    return this.http.get<Picture[]>(url)
  }

  toggleLike(id: number) {
    const url = `http://localhost:8000/api/pictures/${id}/like/`;
    return this.http.post<{ detail: string; likes: number }>(url, {});
  }

  private baseUrl = "http://localhost:8000/api";
  getLikeStatus(id: number): Observable<{ liked: boolean; likes: number }> {
    return this.http.get<{ liked: boolean; likes: number }>(
      `${this.baseUrl}/pictures/${id}/isliked/`
    );
  }

  getUserId():number{
    let cur = localStorage.getItem('refresh');
    if(!cur){
      window.location.href = '/login';
      return 0;
    }

    const decoded = jwtDecode<JwtPayload>(cur) as JwtPayload;
    return decoded.user_id;
  }

  private taskUrl:string = "http://localhost:8000/api/tasks/";
  getTasks(): Observable<TaskInt[]> {
    return this.http.get<TaskInt[]>(this.taskUrl);
  }

  getmyTasks(): Observable<TaskInt[]> {
    let cur = localStorage.getItem('refresh');
    if(!cur) return new Observable<TaskInt[]>;
    let myurl = this.taskUrl + this.getUserId() + "/user/";
    return this.http.get<TaskInt[]>(myurl);
  }

  getTask(id: number): Observable<TaskInt> {
    console.log(this.taskUrl + id + "/");
    return this.http.get<TaskInt>(this.taskUrl + id + "/");
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.taskUrl}${id}/`);
  }

  updateTask(task: TaskInt): Observable<TaskInt> {
    return this.http.put<TaskInt>(`${this.taskUrl}${task.id}/`, task);
  }
  
  private loginUrl:string = "http://localhost:8000/api/auth/login/";
  login(authModel: LoginInt): Observable<TokenInt>{
    return this.http.post<TokenInt>(this.loginUrl, authModel);
  }

  private postUrl:string = "http://localhost:8000/api/tasks/create/";
  createtask(cur: TaskInt) {
    return this.http.post<TaskInt>(this.postUrl, cur);
  }
}
