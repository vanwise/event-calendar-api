import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addTimeout(name: string, milliseconds: number, callback: () => void): void {
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  deleteTimeout(name: string): void {
    this.schedulerRegistry.deleteTimeout(name);
  }

  getTimeouts(): string[] {
    return this.schedulerRegistry.getTimeouts();
  }
}
