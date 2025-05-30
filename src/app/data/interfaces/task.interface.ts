export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: 'completed' | 'in-progress' | 'pending';
    priority: 'low' | 'medium' | 'high' | 'critical';
    createdAt: Date;
    deadline: Date;
    pinned: boolean;
}
