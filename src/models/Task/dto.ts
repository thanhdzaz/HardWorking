export interface TaskDto{
    id: string;
    title: string;
    description?: string;
    progress: number;
    assignmentDate?: Date;
    startTime: Date;
    endTime: Date;
    priority: number;
    status: number;
    assignBy: string;
    assignTo?: string;
    projectId: string;
    parentId?: string;
    // tagId?: string;
}


export interface ProjectDto{
    id: string;
    title: string;
    description?: string;
}

export interface UserProjectDto{
    id: string;
    userId: string;
    projectId: string;
    members: object;
}

export interface StatusDto{
    id: string;
    title: string;
    projectId: string;
    color: string;
    order: number;
}

