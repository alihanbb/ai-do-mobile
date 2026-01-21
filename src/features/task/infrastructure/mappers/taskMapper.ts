import { Task, TaskProps } from '../../domain/entities/Task';
import { TaskDto } from '../api/taskApi';

/**
 * Maps backend TaskDto to mobile TaskProps
 */
export function mapTaskDtoToProps(dto: TaskDto): TaskProps {
    return {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        completed: dto.isCompleted,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        dueTime: dto.dueTime,
        category: dto.category,
        priority: dto.priority,
        estimatedDuration: dto.estimatedDuration,
        tags: dto.tags,
        subtasks: dto.subtasks.map(s => ({
            id: s.id,
            title: s.title,
            completed: s.isCompleted,
        })),
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        aiSuggested: dto.aiSuggested,
        aiParsedFrom: dto.aiParsedFrom,
    };
}

/**
 * Maps mobile TaskProps to backend CreateTaskRequest format
 */
export function mapPropsToCreateRequest(props: Omit<TaskProps, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'status'>) {
    return {
        title: props.title,
        description: props.description,
        startDate: undefined, // TODO: add start date to mobile entity if needed
        startTime: undefined,
        dueDate: props.dueDate ? formatDateToString(props.dueDate) : undefined,
        dueTime: props.dueTime,
        allDay: !props.dueTime,
        category: props.category,
        priority: props.priority,
        estimatedDuration: props.estimatedDuration,
        tags: props.tags,
        subtasks: props.subtasks?.map(s => ({ title: s.title })),
    };
}

/**
 * Maps mobile TaskProps to backend UpdateTaskRequest format
 */
export function mapPropsToUpdateRequest(props: Partial<TaskProps>) {
    return {
        title: props.title,
        description: props.description,
        dueDate: props.dueDate ? formatDateToString(props.dueDate) : undefined,
        dueTime: props.dueTime,
        allDay: props.dueTime ? false : true,
        category: props.category,
        priority: props.priority,
        estimatedDuration: props.estimatedDuration,
        tags: props.tags,
    };
}

function formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
