export interface Board {
    id: number;
    name: string;
    description: string;
    thumbnailPhoto: string;
}

export interface List {
    id: number;
    name: string;
    color: string;
    boardId: number;
}

export interface Task {
    id: number;
    name: string;
    description: string;
    isFinished: boolean;
    listId: number;
}

export interface Data {
    boards: Board[];
    lists: List[];
    tasks: Task[];
}

export interface ListTemplate {
    name: string;
    color: string;
}

export interface BoardTemplate {
    id: string;
    name: string;
    description?: string;
    lists: ListTemplate[];
}
