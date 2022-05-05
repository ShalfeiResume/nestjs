import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { ResponseGetingTaskDto } from "./dto/getingTask.dto";
import { RequestCreatingTaskDto, ResponseCreatingTaskDto } from "./dto/creatingTask.dto";
import { TaskEntity } from "./task.entity";
import { RequestUpdatingTaskDto, ResponseUpdatingTaskDto } from "./dto/updatingTask.dto";
import { RequestDeletingTaskDto, ResponseDeletingTaskDto } from "./dto/deletingTask.dto";

@Injectable()
export class TaskService {
  constructor(@InjectRepository(TaskEntity) private readonly taskRepository :Repository<TaskEntity>) {}
  
  async getTimetable (): Promise<ResponseGetingTaskDto[]> {
    const timetable = await this.taskRepository.find();
    return timetable;
  }

  async createTask (requestCreatingTaskDto: RequestCreatingTaskDto): Promise<ResponseCreatingTaskDto> {
    const resultValidation = await this.validateCreatingTask(requestCreatingTaskDto);
    if(!resultValidation.errors){
      const newTask = new TaskEntity();
      await this.taskRepository.save({...newTask, ...requestCreatingTaskDto })
    }
    return resultValidation
  }

  async updateTask (requestUpdatingTaskDto: RequestUpdatingTaskDto): Promise<ResponseUpdatingTaskDto> {
    const resultValidation = await this.validateUpdatingTask(requestUpdatingTaskDto);
    if(!resultValidation.errors){
      const newTask = new TaskEntity();
      await this.taskRepository.save({...newTask, ...requestUpdatingTaskDto })
    }

    return resultValidation
  }

  async deleteTask (requesDeletingTaskDto: RequestDeletingTaskDto): Promise<ResponseDeletingTaskDto> {
    const resultValidation = await this.validateDeletingUser(requesDeletingTaskDto);
    await this.taskRepository.delete({id: requesDeletingTaskDto.id})
    return resultValidation
  }

  async validateCreatingTask (requestCreatingTaskDto: RequestCreatingTaskDto): Promise<ResponseCreatingTaskDto> {
    const creatingTask = {
      errors: null,
      message:'Task successfully created',
    }
    // Description validation

    if (!requestCreatingTaskDto.description) {
      creatingTask.errors = {...creatingTask?.errors, descriptionError: [...creatingTask?.errors?.descriptionError ?? [], "Description can't be empty"]};
      creatingTask.message = 'Error creating task';
    }

    if (!/^[a-zA-ZА-Яа-я]{3,16}$/.test(requestCreatingTaskDto.description)) {
      creatingTask.errors = {...creatingTask?.errors, descriptionError: [...creatingTask?.errors?.descriptionError ?? [], "Maximum description length must be 3-16 characters. Valid characters 'a-zA-ZА-Яа-я'"]};
      creatingTask.message = 'Error creating task';
    }

    // Date validation
    if (!requestCreatingTaskDto.date) {
      creatingTask.errors = {...creatingTask?.errors, dateError: [...creatingTask?.errors?.dateError ?? [], "Date can't be empty"]};
      creatingTask.message = 'Error creating task';
    }

    // Time validationid

    if (!requestCreatingTaskDto.time) {
      creatingTask.errors = {...creatingTask?.errors, timeError: [...creatingTask?.errors?.timeError ?? [], "Time can't be empty"]};
      creatingTask.message = 'Error creating task';
    }

    return creatingTask
  }

  async validateUpdatingTask (requestUpdatingTaskDto: RequestUpdatingTaskDto): Promise<ResponseUpdatingTaskDto> {
    const updatingTask = {
      errors: null,
      message:'Task successfully updated',
    }
    // Description validation

    if (!requestUpdatingTaskDto.description) {
      updatingTask.errors = {...updatingTask?.errors, descriptionError: [...updatingTask?.errors?.descriptionError ?? [], "Description can't be empty"]};
      updatingTask.message = 'Error updating task';
    }

    if (!/^[a-zA-ZА-Яа-я]{3,16}$/.test(requestUpdatingTaskDto.description)) {
      updatingTask.errors = {...updatingTask?.errors, descriptionError: [...updatingTask?.errors?.descriptionError ?? [], "Maximum description length must be 3-16 characters. Valid characters 'a-zA-ZА-Яа-я'"]};
      updatingTask.message = 'Error updating task';
    }

    // Date validation
    if (!requestUpdatingTaskDto.date) {
      updatingTask.errors = {...updatingTask?.errors, dateError: [...updatingTask?.errors?.dateError ?? [], "Date can't be empty"]};
      updatingTask.message = 'Error updating task';
    }

    // Time validationid

    if (!requestUpdatingTaskDto.time) {
      updatingTask.errors = {...updatingTask?.errors, timeError: [...updatingTask?.errors?.timeError ?? [], "Time can't be empty"]};
      updatingTask.message = 'Error updating task';
    }

     // Id validationid

     if (!requestUpdatingTaskDto.id) {
      updatingTask.errors = {...updatingTask?.errors, idError: [...updatingTask?.errors?.idError ?? [], "Time can't be empty"]};
      updatingTask.message = 'Error updating task';
    }

    const taskById = await this.taskRepository.findOne({ id: requestUpdatingTaskDto.id });

    if (!taskById) {
      updatingTask.errors = {...updatingTask?.errors, idError: [...updatingTask?.errors?.idError ?? [], "Id doesn't exist"]};
      updatingTask.message = 'Error updating task';
    }

    return updatingTask
  }

  async  validateDeletingUser(requestDeletingTaskDto: RequestDeletingTaskDto): Promise<ResponseDeletingTaskDto> {

    const deletingTask = {
      errors: null,
      message:'Task successfully deleted',
    }

    // Id validationid

    if (!requestDeletingTaskDto.id) {
      deletingTask.errors = {...deletingTask?.errors, idError: [...deletingTask?.errors?.idError ?? [], "Id can't be empty"]};
      deletingTask.message = 'Error deleting task';
    }

    const taskById = await this.taskRepository.findOne({ id: requestDeletingTaskDto.id });

    if (!taskById) {
      deletingTask.errors = {...deletingTask?.errors, idError: [...deletingTask?.errors?.idError ?? [], "Id doesn't exist"]};
      deletingTask.message = 'Error deleting task';
    }

    return deletingTask
  }
}