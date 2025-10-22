import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ApiResponse } from '../types/api-response.types';

export async function executeService<T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Something is UNUSUAL.',
    successCode: HttpStatus = HttpStatus.OK
): Promise<ApiResponse<T>> {
    try {
        const result = await operation();
        return {
            success: true,
            data: result,
            message: 'Operation completed successfully.',
            statusCode: successCode,
        };
    } catch (error) {
        if (error.status) {
            // If it's a NestJS exception, rethrow it with timestamp
            throw new error.constructor({
                success: false,
                message: error.message,
                statusCode: error.status,
            });
        }
        console.error('Error occurred:', error.message);
        throw new InternalServerErrorException({
            success: false,
            message: errorMessage,
            statusCode: 500,
        });
    }
}