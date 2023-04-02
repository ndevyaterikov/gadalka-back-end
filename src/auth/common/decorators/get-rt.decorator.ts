import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const GetRT = createParamDecorator(

    (data:string|undefined, context: ExecutionContext)=>{
            const request =context.switchToHttp().getRequest()
            const rt = request.user['refreshToken']
            return  rt
    })