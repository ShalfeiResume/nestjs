export class ErrorCreatingTask {
  dateError: string[];
  timeError: string[];
  descriptionError: string[];
}

export class ResponseCreatingTaskDto {
  errors: ErrorCreatingTask;
  message: string;
}

export class RequestCreatingTaskDto {
  date: number;
  time: number;
  description: string;
}
