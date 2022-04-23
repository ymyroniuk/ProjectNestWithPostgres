import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly rolesService: RolesService
    ) { }

    async createUser(dto: CreateUserDto){
        const user = await this.userModel.create(dto);
        const role = await this.rolesService.getRoleByValue('USER');
        await user.$set('roles', [role.id])
        user.roles = [role]
        return user;
    }

    async getAllUsers() {
        const users = await this.userModel.findAll({ include: { all: true } });
        return users;
    }

    async getUser(email: string) {
        const user = await this.userModel.findOne({ where: { email }, include: { all: true } });
        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userModel.findByPk(dto.userId);
        const role = await this.rolesService.getRoleByValue(dto.value);
        if(user && role) {
            await user.$add('role', role.id);
            return dto
        }
        throw new HttpException('User or Roke not found', HttpStatus.NOT_FOUND)
    }

    async banUser(dto: BanUserDto) {
        const user = await this.userModel.findByPk(dto.userId);
        if(!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }

}
