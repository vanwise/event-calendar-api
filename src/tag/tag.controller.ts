import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tags')
@ApiTags('Tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Getting all tags' })
  @ApiResponse({ status: HttpStatus.OK, type: Tag, isArray: true })
  getAllTags() {
    return this.tagService.getAllTags();
  }
}
