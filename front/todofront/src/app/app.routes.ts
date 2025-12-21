import { Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreatetaskComponent } from './createtask/createtask.component';
import { TaskbyidComponent } from './taskbyid/taskbyid.component';
import { MypostsComponent } from './myposts/myposts.component';
import { UpdatepostComponent } from './updatepost/updatepost.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { UploadComponent } from './upload/upload.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ProfilesListComponent } from './profiles-list/profiles-list.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MessagesComponent } from './messages/messages.component';

export const routes: Routes = [
    {path:"login", component:LoginpageComponent},
    {path:"tasks", component:TasksComponent},
    {path:"createtask", component:CreatetaskComponent},
    {path:"taskbyid", component:TaskbyidComponent},
    {path:"myposts", component:MypostsComponent},
    {path:"myposts/:id", component:UpdatepostComponent},
    {path:"gallery", component:GalleryComponent},
    {path: "favourites", component:FavouritesComponent},
    {path: "upload", component:UploadComponent},
    {path: "myprofile", component:MyProfileComponent},
    {path: "profiles", component:ProfilesListComponent },
    {path: "home", component:HomeComponent},
    { path: 'profile/:id', component: ProfileComponent },
    { path: "schedule", component:ScheduleComponent},
    { path: "messages", component:MessagesComponent }
];
