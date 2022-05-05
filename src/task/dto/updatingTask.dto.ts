export class ErrorUpdatingTask {
  dateError: string[];
  timeError: string[];
  descriptionError: string[];
  idError: string[];
}

export class ResponseUpdatingTaskDto {
  errors: ErrorUpdatingTask;
  message: string;
}

export class RequestUpdatingTaskDto {
  id: number;
  date: number;
  time: number;
  description: string;
}
