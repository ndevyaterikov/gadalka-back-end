export default class UserDto{
    id:number
    email:string
    userName:string
    accountPicNumber:number
    isFirstTimeAfterActivation:boolean

    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.userName = model.userName
        this.accountPicNumber = model.accountPicNumber
        this.isFirstTimeAfterActivation = model.isFirstTimeAfterActivation
    }
}