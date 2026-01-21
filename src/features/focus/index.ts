/**
 * Focus Module
 * Feature-First Clean Architecture
 * 
 * Structure:
 * - domain/       - Entities, Value Objects, Repository Interfaces
 * - application/  - Use Cases, DTOs
 * - infrastructure/ - Repository Implementations
 * - presentation/ - Stores, Hooks, Components
 */

// Public API
export * from './domain';
export * from './application';
export * from './presentation';
