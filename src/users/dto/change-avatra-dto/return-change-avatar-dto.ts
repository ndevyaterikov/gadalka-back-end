export default class ReturnChangeAvatarDto{
    id:number
    accountPicNumber:number


    constructor(model) {
        this.id = model.id
        this.accountPicNumber = model.accountPicNumber
    }
}