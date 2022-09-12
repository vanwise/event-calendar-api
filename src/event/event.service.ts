import { ExceptionService } from './../exception/exception.service';
import { Tag } from './../tag/entities/tag.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly exceptionService: ExceptionService,
  ) {}

  getAllEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = new Event();

    event.title = createEventDto.title;
    event.description = createEventDto.description;
    event.tagId = await this.checkAndGetCorrectTagId(createEventDto.tagId);
    event.startDateISO = new Date(createEventDto.startDateISO);
    event.endDateISO = new Date(createEventDto.endDateISO);

    return await this.eventRepository.save(event);
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const eventForUpdate = await this.eventRepository.findOneBy({ id });

    eventForUpdate.title = updateEventDto.title;
    eventForUpdate.description = updateEventDto.description;
    eventForUpdate.tagId = await this.checkAndGetCorrectTagId(
      updateEventDto.tagId,
    );
    eventForUpdate.startDateISO = new Date(updateEventDto.startDateISO);
    eventForUpdate.endDateISO = new Date(updateEventDto.endDateISO);

    return await this.eventRepository.save(eventForUpdate);
  }

  async removeEvent(id: string) {
    const eventForRemove = await this.eventRepository.findOneBy({ id });
    await this.eventRepository.remove(eventForRemove);
  }

  private async checkAndGetCorrectTagId(newTagId = '') {
    const existedTag = await this.tagRepository.findOneBy({
      id: newTagId,
    });

    if (!existedTag) {
      this.exceptionService.throwTagNotFound();
    }

    return newTagId;
  }
}
