import { UsersService } from '../user/users.service';
import { Notification } from '../notifications/entities/notification.entity';
import { MS_IN_ONE_MINUTE } from '../time/time.constants';
import { EVENT_NOTIFICATION_START_TIME_IN_MINUTES } from './events.constants';
import { TimeService } from '../time/time.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ExceptionsService } from '../exception/exceptions.service';
import { Tag } from '../tag/entities/tag.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly usersService: UsersService,
    private readonly exceptionsService: ExceptionsService,
    private readonly timeService: TimeService,
    private readonly notificationService: NotificationsService,
  ) {}

  getAllEvents(userId: string): Promise<Event[]> {
    return this.eventRepository.findBy({
      user: { id: userId },
    });
  }

  async createEvent(
    createEventDto: CreateEventDto,
    userLogin: string,
  ): Promise<Omit<Event, 'user'>> {
    const storedUser = await this.usersService.getUserByLogin(userLogin);
    const event = this.eventRepository.create({
      title: createEventDto.title,
      description: createEventDto.description,
      tagId: await this.checkAndGetCorrectTagId(createEventDto.tagId),
      startDateISO: new Date(createEventDto.startDateISO),
      endDateISO: new Date(createEventDto.endDateISO),
      user: storedUser,
    });

    if (createEventDto.hasReminder) {
      const createdNotification = await this.createEventNotification(
        event,
        userLogin,
      );
      event.notificationId = createdNotification.id;
    }

    const { user, ...savedEvent } = await this.eventRepository.save(event);
    return savedEvent;
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
    userLogin: string,
  ): Promise<Event | void> {
    const eventForUpdate = await this.eventRepository.findOneBy({ id });

    if (!eventForUpdate) {
      return this.exceptionsService.throwEventNotFound();
    }

    eventForUpdate.title = updateEventDto.title;
    eventForUpdate.description = updateEventDto.description;
    eventForUpdate.tagId = await this.checkAndGetCorrectTagId(
      updateEventDto.tagId,
    );
    eventForUpdate.startDateISO = new Date(updateEventDto.startDateISO);
    eventForUpdate.endDateISO = new Date(updateEventDto.endDateISO);

    const hasStoredReminder = Boolean(eventForUpdate.notificationId);
    const isDeletingReminder = hasStoredReminder && !updateEventDto.hasReminder;

    if (isDeletingReminder) {
      eventForUpdate.notification = null;
    }

    if (isDeletingReminder) {
      await this.notificationService.removeNotification(
        eventForUpdate.notificationId,
        eventForUpdate.id,
      );
    } else if (!hasStoredReminder && updateEventDto.hasReminder) {
      const createdNotification = await this.createEventNotification(
        eventForUpdate,
        userLogin,
      );
      eventForUpdate.notificationId = createdNotification.id;
    }

    return await this.eventRepository.save(eventForUpdate);
  }

  async removeEvent(id: string): Promise<void> {
    const eventForRemove = await this.eventRepository.findOneBy({ id });
    await this.eventRepository.remove(eventForRemove);

    if (eventForRemove.notificationId) {
      await this.notificationService.removeNotification(
        eventForRemove.notificationId,
        eventForRemove.id,
      );
    }
  }

  private async checkAndGetCorrectTagId(newTagId = ''): Promise<string> {
    const existedTag = await this.tagRepository.findOneBy({
      id: newTagId,
    });

    if (!existedTag) {
      this.exceptionsService.throwTagNotFound();
    }

    return newTagId;
  }

  private async createEventNotification(
    event: Event,
    userLogin: string,
  ): Promise<Notification | undefined> {
    const eventStartDate = this.timeService.getDate(event.startDateISO);
    const diffFromNowToStartEvent = Math.abs(
      eventStartDate.diff(this.timeService.getDate(), 'minutes'),
    );
    const isEventReadyForNotification =
      diffFromNowToStartEvent > EVENT_NOTIFICATION_START_TIME_IN_MINUTES;

    if (!isEventReadyForNotification) return;

    const notification = {
      title: event.title,
      body: `Event will start in ${EVENT_NOTIFICATION_START_TIME_IN_MINUTES} minutes`,
      startDateISO: eventStartDate
        .subtract(EVENT_NOTIFICATION_START_TIME_IN_MINUTES, 'minutes')
        .toDate(),
    };
    const delayInMs =
      (diffFromNowToStartEvent - EVENT_NOTIFICATION_START_TIME_IN_MINUTES) *
      MS_IN_ONE_MINUTE;

    return await this.notificationService.createNotification({
      userLogin,
      delayInMs,
      notification,
      taskName: event.id,
    });
  }
}
