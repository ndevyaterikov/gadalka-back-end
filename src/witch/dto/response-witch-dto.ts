export default class ResponseWitchDto{
    witchNick:string
    witchName:string
    witchId:number
    desctription:string
    viewers:number
    linkToCover:string
    isOnLine: boolean
    isPrivate: boolean
    isMicMuted: boolean
    rating:number


    constructor(model) {
        this.witchNick = model.pathLink
        this.witchName = model.owner.userName
        this.witchId = model.userId
        this.desctription = model.desctription
        this.viewers = model.viewers
        this.linkToCover = model.linkToCover
        this.isOnLine = model.isOnLine
        this.isPrivate = model.isPrivate
        this.isMicMuted = model.isMicMuted
        this.rating = model.rating
    }
}