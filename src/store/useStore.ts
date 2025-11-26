import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { data } from '../../data/data';
import type { Board, List, Task } from '../types/data';

interface StoreState {
    boards: Board[];
    lists: List[];
    tasks: Task[];
    initializeStore: () => void;
    resetStore: () => void;

    addBoard: (board: Board) => void;
    updateBoard: (updatedBoard: Board) => void;
    deleteBoard: (id: number) => void;

    updateTask: (updatedTask: Task) => void;
    deleteTask: (id: number) => void;
    moveTask: (taskId: number, toListId: number) => void;
    addTask: (
        listId: number,
        task: { name: string; description?: string; isFinished?: boolean }
    ) => number;
    addList: (list: List) => void;
    deleteList: (id: number) => void;
    updateList: (updatedList: List) => void;
}

const useStoreBase = create<StoreState>((set, get) => ({
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

    addBoard: (board: Board) => {
        set({ boards: [...get().boards, board] });
    },

    updateBoard: (updatedBoard: Board) => {
        set({
            boards: get().boards.map(board =>
                board.id === updatedBoard.id ? updatedBoard : board
            ),
        });
    },

    deleteBoard: (id: number) => {
        set({ boards: get().boards.filter(board => board.id !== id) });
    },

    addList: (list: List) => {
        set({ lists: [...get().lists, list] });
    },

    deleteList: (id: number) => {
        set({ lists: get().lists.filter(list => list.id !== id) });
    },

    updateList: (updatedList: List) => {
        set({
            lists: get().lists.map(list => (list.id === updatedList.id ? updatedList : list)),
        });
    },
    updateTask: (updatedTask: Task) => {
        set({
            tasks: get().tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)),
        });
    },
    deleteTask: (id: number) => {
        set({ tasks: get().tasks.filter(task => task.id !== id) });
    },
    moveTask: (taskId: number, toListId: number) => {
        set({
            tasks: get().tasks.map(t => (t.id === taskId ? { ...t, listId: toListId } : t)),
        });
    },
    addTask: (listId: number, task) => {
        const tasks = get().tasks;
        const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        const newTask: Task = {
            id: nextId,
            name: task.name,
            description: task.description || '',
            isFinished: !!task.isFinished,
            listId,
        };
        set({ tasks: [...get().tasks, newTask] });
        return nextId;
    },
}));

export const useStore = useStoreBase;

export function useShallowStore<T>(selector: (state: StoreState) => T): T {
    return useStoreBase(useShallow(selector));
}
