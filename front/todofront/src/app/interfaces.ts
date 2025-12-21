export interface Interfaces {
}

export interface TokenInt{
    refresh: string,
    access: string
}
export interface LoginInt {
    username:string,
    password:string
}

export interface Picture{
    id:number,
    name:string,
    image:string,
    likes:number
}

export interface imageStatus{
    liked:boolean,
    likes:number
}

export interface TaskInt {
    "id": number,
    "user": number,
    "title": string,
    "description": string,
    "created_at": Date,
    "completed": boolean,
    "end_time": String,
    "start_time": String
}

export interface id{
    "user_id":number
}

export interface JwtPayload {
    "user_id": number,
    "username": string,
    "exp": number,
    "iat": number,
}

export interface Profile{
    id:number,
    pic:number,
    nickname:String,
    desc:String,
    link:String
}

export interface Blocked{
    blocked:Boolean;
}