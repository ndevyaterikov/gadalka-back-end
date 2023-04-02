export default class UserDto{
    id:number
    email:string
    userName:string
    accountPicNumber:number


    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.userName = model.userName
        this.accountPicNumber = model.accountPicNumber
    }
}