import { create } from 'zustand';
import { data } from '../../data/data';
import type { Board, List, Task } from '../types/data';

interface StoreState {
    boards: Board[];
    lists: List[];
    tasks: Task[];
    initializeStore: () => void;
    resetStore: () => void;
}

export const useStore = create<StoreState>(set => ({
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
}));
