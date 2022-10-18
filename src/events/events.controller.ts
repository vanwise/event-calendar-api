import { User } from '../users/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Event } from './entities/event.entity';
import { Request } from 'express';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Getting all events' })
  @ApiResponse({ status: HttpStatus.OK, type: Event, isArray: true })
  getAllEvents(@Req() req: Request) {
    const userId = (req.user as User).id;
    return this.eventsService.getAllEvents(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creating one event' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Event })
  @Header('Content-Type', 'application/json')
  createEvent(@Body() createEventDto: CreateEventDto, @Req() req: Request) {
    const userLogin = (req.user as User).login;
    return this.eventsService.createEvent(createEventDto, userLogin);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updating one event' })
  @ApiResponse({ status: HttpStatus.OK, type: Event })
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: Request,
  ) {
    const userLogin = (req.user as User).login;
    return this.eventsService.updateEvent(id, updateEventDto, userLogin);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting one event' })
  @ApiResponse({ status: HttpStatus.OK })
  removeEvent(@Param('id') id: string) {
    this.eventsService.removeEvent(id);
  }
}
