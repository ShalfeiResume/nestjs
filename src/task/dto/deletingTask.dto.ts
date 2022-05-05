import { Timestamp } from "typeorm";

export class ErrorDeletingTask {
  idError: string[];
}

export class ResponseDeletingTaskDto {
  errors: ErrorDeletingTask;
  message: string;
}

export class RequestDeletingTaskDto {
  id: number;
}
