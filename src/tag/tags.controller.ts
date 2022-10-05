import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Getting all tags' })
  @ApiResponse({ status: HttpStatus.OK, type: Tag, isArray: true })
  getAllTags() {
    return this.tagsService.getAllTags();
  }
}
