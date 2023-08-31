import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello CouchSurfing team!!';
  }

  async createUser(user: User): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (e) {
      throw new BadRequestException({
        message: 'something bad happened',
      });
    }
  }

  async getUser(id: string): Promise<User> {
    let user = {} as User;

    if (id.includes('@')) {
      user = await this.prismaService.user.findUnique({
        where: {
          email: id,
        },
      });
    } else {
      user = await this.prismaService.user.findUnique({
        where: {
          id: Number(id),
        },
      });
    }
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async updateUser(id: string, updatedUser: User): Promise<User> {
    try {
      const user = await this.prismaService.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      });

      return user;
    } catch {
      throw new NotFoundException('User Not Found');
    }
  }

  async addFriendship(id1: string, id2: string): Promise<boolean> {
    const userId1 = Number(id1);
    const userId2 = Number(id2);

    try {
      // Rely on DB constraints to check if a friendship already exists

      // Create a new friendship
      await this.prismaService.friendship.create({
        data: { userId1: userId1, userId2: userId2 },
      });

      console.log('Friendship added successfully.');
      return true;
    } catch (error) {
      throw new BadRequestException({
        message: 'something bad happened',
      });
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const userId = Number(id);
    try {
      // Find the user's friendships
      const friendships = await this.prismaService.friendship.findMany({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
      });

      // Delete the friendships
      for (const friendship of friendships) {
        await this.prismaService.friendship.delete({
          where: {
            id: friendship.id,
          },
        });
      }

      // Delete the user
      await this.prismaService.user.delete({
        where: {
          id: userId,
        },
      });

      console.log('User and their relationships deleted successfully.');
    } catch (error) {
      throw new BadRequestException({
        message: 'something bad happened',
      });
    }
    return true;
  }

  async getUserFriends(id: string | number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: Number(id) },
      include: {
        friendships1: {
          include: {
            user2: true,
          },
        },
        friendships2: {
          include: {
            user1: true,
          },
        },
      },
    });
    const friends = [
      ...user.friendships1.map((friendship) => friendship.user2),
      ...user.friendships2.map((friendship) => friendship.user1),
    ];

    return friends;
  }

  async findRelationshipDistance(id1: string, id2: string) {
    const userId1 = Number(id1);
    const userId2 = Number(id2);

    let visited = [];
    let queue = [{ userId: userId1, distance: 0 }];

    while (queue.length > 0) {
      let { userId, distance } = queue.shift();

      if (userId === userId2) {
        return distance;
      }

      if (!visited.includes(userId)) {
        visited.push(userId);

        const userFriends = await this.getUserFriends(userId);
        for (const friend of userFriends) {
          queue.push({ userId: friend.id, distance: distance + 1 });
        }
      }
    }

    return false;
  }
}
