import {Body, Controller, Get, Param, Post, ValidationPipe} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role-dto";
import {IsString} from "class-validator";
import {ValueDto} from "../auth/dto/value-dto";

@Controller('roles')
export class RolesController {
    constructor(private roleService:RolesService) {
    }

    @Post()
    create(@Body() dto:CreateRoleDto){
        return this.roleService.creatRole(dto)
    }

    @Get('/:value')
    getByValue(@Param(
        new ValidationPipe({
        transform: true,
        transformOptions: {enableImplicitConversion: true},
        forbidNonWhitelisted: true
    })) value: ValueDto){
        return this.roleService.getRoleByValue(value.value)
    }
}
