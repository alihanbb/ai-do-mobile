/**
 * Base interface for all use cases in the application
 * Follows Command/Query pattern for clear separation
 */
export interface UseCase<TRequest, TResponse> {
    execute(request: TRequest): Promise<TResponse>;
}

/**
 * Use case that doesn't require any input
 */
export interface UseCaseWithoutRequest<TResponse> {
    execute(): Promise<TResponse>;
}

/**
 * Use case that doesn't return any output
 */
export interface UseCaseWithoutResponse<TRequest> {
    execute(request: TRequest): Promise<void>;
}
