import { HttpStatus } from "@nestjs/common";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: HttpStatus;
}