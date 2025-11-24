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
    getListsByBoardId: (boardId: number) => List[];
    getTasksByListId: (listId: number) => Task[];
    updateTask: (updatedTask: Task) => void;
    moveTask: (taskId: number, toListId: number) => void;
    addBoard: (board: Board) => void;
    addList: (list: List) => void;
    deleteList: (id: number) => void;
    updateList: (updatedList: List) => void;
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

    getListsByBoardId: (boardId: number) => {
        if (!boardId) return [];
        return get().lists.filter(list => list.boardId === boardId);
    },

    getTasksByListId: (listId: number) => {
        if (!listId) return [];
        return get().tasks.filter(task => task.listId === listId);
    },

    addBoard: (board: Board) => {
        set({ boards: [...get().boards, board] });
    },
    addList: (list: List) => {
        set({ lists: [...get().lists, list] });
    },
    
    deleteList: (id: number) => {
        set({ lists: get().lists.filter(list => list.id !== id) });
    },

    updateList: (updatedList: List) => {
        set({
            lists: get().lists.map(list =>
                list.id === updatedList.id ? updatedList : list
            ),
        });
    },
    updateTask: (updatedTask: Task) => {
        set({
            tasks: get().tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)),
        });
    },
    moveTask: (taskId: number, toListId: number) => {
        set({
            tasks: get().tasks.map(t => (t.id === taskId ? { ...t, listId: toListId } : t)),
        });
    },
}));
