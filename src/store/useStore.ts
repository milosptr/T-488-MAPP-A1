import { create } from 'zustand';
import { data } from '../../data/data';
import type { Board, List, Task } from '../types/data';

interface StoreState {
    boards: Board[];
    lists: List[];
    tasks: Task[];
    initializeStore: () => void;
    resetStore: () => void;
    getTasksByBoardId: (boardId: number) => Task[];
}

export const useStore = create<StoreState>((set, get) => ({
    boards: [],
    lists: [],
    tasks: [],

    initializeStore: () => {
        set({
            boards: data.boards,
            lists: data.lists,
            tasks: data.tasks,
        });
    },

    resetStore: () => {
        set({
            boards: data.boards,
            lists: data.lists,
            tasks: data.tasks,
        });
    },

    getTasksByBoardId: (boardId: number) => {
        if (!boardId) {
            return [];
        }

        const lists = get().lists.filter(list => list.boardId === boardId);
        const listIds = new Set(lists.map(list => list.id));
        return get().tasks.filter(task => listIds.has(task.listId));
    },
}));
