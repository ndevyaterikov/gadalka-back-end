import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const WsGetCurrentUserId = createParamDecorator(
    (data:string|undefined, context: ExecutionContext):number=>{
        console.log('claclacla1')
    const request =context.switchToWs().getClient().handshake

    return  request.user['sub']
})