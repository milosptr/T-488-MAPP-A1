import type { BoardTemplate, List } from '../types/data';

export const BOARD_TEMPLATES: BoardTemplate[] = [
    {
        id: 'everyday',
        name: 'Everyday Kanban',
        description: 'Simple flow for everyday tasks and small projects.',
        lists: [
            { name: 'Inbox', color: '#3949AB' },
            { name: 'Next up', color: '#29B6F6' },
            { name: 'In progress', color: '#8E24AA' },
            { name: 'Waiting on others', color: '#FB8C00' },
            { name: 'Done', color: '#43A047' },
        ],
    },
    {
        id: 'project',
        name: 'Project management',
        description: 'Lightweight workflow for work or school projects.',
        lists: [
            { name: 'Backlog', color: '#00897B' },
            { name: 'Ready', color: '#00ACC1' },
            { name: 'In progress', color: '#3949AB' },
            { name: 'Blocked', color: '#E53935' },
            { name: 'Review', color: '#FDD835' },
            { name: 'Done', color: '#43A047' },
        ],
    },
    {
        id: 'study',
        name: 'Study planner',
        description: 'Track readings and assignments from start to grading.',
        lists: [
            { name: 'To read', color: '#29B6F6' },
            { name: 'Exercises', color: '#8E24AA' },
            { name: 'In progress', color: '#FB8C00' },
            { name: 'Waiting for grading', color: '#D81B60' },
            { name: 'Done', color: '#43A047' },
        ],
    },
    {
        id: 'travel',
        name: 'Trip planner',
        description: 'Plan trips from ideas to post travel tasks.',
        lists: [
            { name: 'Ideas', color: '#8E24AA' },
            { name: 'To book', color: '#00ACC1' },
            { name: 'Booked', color: '#FDD835' },
            { name: 'Packing', color: '#FB8C00' },
            { name: 'On the trip', color: '#43A047' },
            { name: 'After the trip', color: '#3949AB' },
        ],
    },
    {
        id: 'content',
        name: 'Content planning',
        description: 'Plan posts, articles or videos from idea to publish.',
        lists: [
            { name: 'Ideas', color: '#3949AB' },
            { name: 'Drafting', color: '#29B6F6' },
            { name: 'Editing', color: '#FB8C00' },
            { name: 'Scheduled', color: '#FDD835' },
            { name: 'Published', color: '#43A047' },
        ],
    },
];

export function getBoardTemplates(): BoardTemplate[] {
    return BOARD_TEMPLATES;
}

export function getBoardTemplateById(id: string): BoardTemplate | undefined {
    return BOARD_TEMPLATES.find(t => t.id === id);
}

export function createListsFromTemplate(
    boardId: number,
    template: BoardTemplate,
    startId: number
): List[] {
    return template.lists.map((listTemplate, index) => ({
        id: startId + index,
        name: listTemplate.name,
        color: listTemplate.color,
        boardId,
    }));
}
