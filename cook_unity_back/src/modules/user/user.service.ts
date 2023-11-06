import { Injectable } from '@nestjs/common';
import db from 'src/db';

@Injectable()
export class UserService {
  // This method is used to find a user by its username
  async findByUsername(username: string) {
    return await db.user.findUnique({
      where: { username },
    });
  }

  // This method is used to store a new user
  async store(username: string, hash: string, salt: string) {
    await db.user.create({
      data: {
        username,
        hash,
        salt,
      },
    });
  }
}
