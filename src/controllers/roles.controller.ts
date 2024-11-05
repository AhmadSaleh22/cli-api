import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateRoleDto } from 'src/dto/create-role.dto';
import { RolesService } from 'src/services/roles.service';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Post()
    create(@Body('name') name: string) {
        return this.rolesService.create(name);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.rolesService.findOne(id);
    }
}
