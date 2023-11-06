import { Injectable } from '@nestjs/common';
import db from 'src/db';

@Injectable()
export class InternService {
  async findByUsername(username: string) {
    return await db.chef.findUnique({
      where: { username },
    });
  }

  async store(username: string, hash: string, salt: string) {
    await db.chef.create({
      data: {
        username,
        hash,
        salt,
      },
    });
  }
}
