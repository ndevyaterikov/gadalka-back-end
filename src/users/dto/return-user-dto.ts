export default class ReturnUserDto{
    id:number
    email:string
    userName:string


    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.userName = model.userName
    }
}