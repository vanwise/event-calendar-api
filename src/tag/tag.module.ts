import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
