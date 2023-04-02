import UserDto from "../dto/user-dto";

export type Tokens  ={
    access_token: string,
    refresh_token: string
}


export type ReturnObj ={
    access_token: string,
    refresh_token: string,
    userDTO:UserDto
}