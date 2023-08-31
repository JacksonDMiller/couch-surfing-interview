import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // This of course should be in it's own user controller and service but I skipped that in the interest of time.

  // accepts an id or email address
  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.appService.getUser(id);
  }

  @Post('new')
  createUser(@Body() user: User) {
    return this.appService.createUser(user);
  }

  @Put('update/:id')
  updateUser(@Param('id') id: string, @Body() updatedUser: User) {
    return this.appService.updateUser(id, updatedUser);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(id);
  }

  @Get('friends/:id')
  getUserFriends(@Param('id') id: string) {
    return this.appService.getUserFriends(id);
  }

  @Put('addFriendship/:userId1/:userId2')
  addFriendship(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.appService.addFriendship(userId1, userId2);
  }

  @Get('relationship-distance/:userId1/:userId2')
  findRelationShipDistance(
    @Param('userId1') id1: string,
    @Param('userId2') id2: string,
  ) {
    return this.appService.findRelationshipDistance(id1, id2);
  }
}
