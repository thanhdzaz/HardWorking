
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


export interface CheckLog{
    id: string;
	taskId: string;
	field: string;
	newValue: string;
	action: string;
	oldValue: string;
	userId: string;
    time: {
        seconds: number;
        nanoseconds: number;
    };
}

export const TYPE_LEAVE = [
    {
        key: 'day',
        name: 'Ngày',
        total: 1,
    },
    {
        key: 'week',
        name: 'Tuần',
        total: 7,
    },
    {
        key: 'month',
        name: 'Tháng',
        total: 30,
    },
];

export interface ProjectDto{
    id: string;
    title: string;
    description?: string;
    members?: UserProjectDto[];
}

export interface UserProjectDto{
    id: string;
    userId: string;
    projectId: string;
}

export interface StatusDto{
    id: string;
    title: string;
    projectId: string;
    color: string;
    order: number;
}

