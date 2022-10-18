import { TAGS } from '../constants/tags.constant';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Tag } from '../../src/tags/entities/tag.entity';

export default class CreateTags implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(TAGS)
      .execute();
  }
}
