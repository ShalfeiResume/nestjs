import { Body, Controller, Get, Post, Put, UseGuards, Delete } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

import { RequestCreatingTaskDto, ResponseCreatingTaskDto } from "./dto/creatingTask.dto";
import { RequestUpdatingTaskDto, ResponseUpdatingTaskDto } from './dto/updatingTask.dto';
import { TaskService } from "./task.service";
import { ResponseGetingTaskDto } from "./dto/getingTask.dto";
import { RequestDeletingTaskDto, ResponseDeletingTaskDto } from "./dto/deletingTask.dto";


@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getTask(): Promise<ResponseGetingTaskDto[]> {
    return this.taskService.getTimetable();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTaskTimetable(@Body()requestCreatingTaskDto: RequestCreatingTaskDto): Promise<ResponseCreatingTaskDto> {
    return this.taskService.createTask(requestCreatingTaskDto);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateTaskTimetable(@Body()requestUpdatingTaskDto: RequestUpdatingTaskDto): Promise<ResponseUpdatingTaskDto> {
    return this.taskService.updateTask(requestUpdatingTaskDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteTaskTimetable(@Body()requesDeletingTaskDto: RequestDeletingTaskDto): Promise<ResponseDeletingTaskDto> {
    return this.taskService.deleteTask(requesDeletingTaskDto);
  }
}
