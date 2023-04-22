export default class CreateUserDtoFromwitch{
    email: string
    password: string
    userName: string

    constructor(witch) {
        this.email = witch.email
        this.password = witch.password
        this.userName =witch.userName
    }
}