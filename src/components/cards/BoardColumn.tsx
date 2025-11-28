import { EditListBottomSheetModal } from '@/src/components/bottom-sheet';
import { Text, View } from '@/src/components/ui/Themed';
import { borderRadius, spacing } from '@/src/constants/DesignTokens';
import { useTheme } from '@/src/hooks/useTheme';
import { Droppable } from '@/src/lib/dnd';
import { useStore } from '@/src/store/useStore';
import type { List, Task } from '@/src/types/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { TaskCard } from './TaskCard';

interface BoardColumnProps {
    list: List;
    tasks: Task[];
}

export function BoardColumn({ list, tasks }: BoardColumnProps) {
    const theme = useTheme();
    const moveTask = useStore(state => state.moveTask);
    const router = useRouter();
    const updateTask = useStore(state => state.updateTask);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (a.isFinished === b.isFinished) return 0;
            return a.isFinished ? 1 : -1;
        });
    }, [tasks]);

    const completedCount = tasks.filter(t => t.isFinished).length;
    const totalCount = tasks.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const listColor = list.color || theme.tint;

    const handleToggleComplete = (task: Task) => {
        updateTask({ ...task, isFinished: !task.isFinished });
    };

    const handleOpenMenu = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        bottomSheetRef.current?.present();
    }, []);

    const handleAddTask = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/modals/add-task?listId=${list.id}`);
    }, [router, list.id]);

    return (
        <>
            <Droppable
                droppableId={`list-${list.id}`}
                onDrop={data => {
                    const taskId = Number(data.id);
                    if (!Number.isNaN(taskId)) {
                        moveTask(taskId, list.id);
                    }
                }}
                style={[
                    styles.column,
                    {
                        backgroundColor: `${theme.surface}f8`,
                        borderColor: theme.border,
                    },
                ]}
                activeStyle={{
                    backgroundColor: `${listColor}15`,
                    borderColor: listColor,
                }}
            >
                <View style={styles.header}>
                    <View style={[styles.colorDot, { backgroundColor: listColor }]} />
                    <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
                        {list.name}
                    </Text>
                    <View style={styles.headerRight}>
                        <View style={[styles.countBadge, { backgroundColor: `${listColor}20` }]}>
                            <Text style={[styles.countText, { color: listColor }]}>
                                {totalCount}
                            </Text>
                        </View>
                        <Pressable
                            onPress={handleOpenMenu}
                            style={({ pressed }) => [
                                styles.moreButton,
                                { opacity: pressed ? 0.6 : 1 },
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="dots-vertical"
                                size={20}
                                color={theme.textMuted}
                            />
                        </Pressable>
                    </View>
                </View>

                {totalCount > 0 && (
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        backgroundColor: listColor,
                                        width: `${progressPercent}%`,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={[styles.progressText, { color: theme.textMuted }]}>
                            {completedCount}/{totalCount} done
                        </Text>
                    </View>
                )}

                <Pressable
                    onPress={handleAddTask}
                    style={({ pressed }) => [
                        styles.addTaskButton,
                        {
                            borderColor: theme.border,
                            backgroundColor: pressed ? `${theme.border}40` : 'transparent',
                        },
                    ]}
                >
                    <MaterialCommunityIcons name="plus" size={18} color={theme.textMuted} />
                    <Text style={[styles.addTaskText, { color: theme.textMuted }]}>Add Task</Text>
                </Pressable>

                <ScrollView
                    style={[styles.tasksList, styles.visibleOverflow]}
                    contentContainerStyle={[styles.tasksListContent, styles.visibleOverflow]}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                >
                    {sortedTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            listColor={listColor}
                            onToggleComplete={() => handleToggleComplete(task)}
                        />
                    ))}

                    {totalCount === 0 && (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="clipboard-text-outline"
                                size={32}
                                color={theme.textMuted}
                            />
                            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                                No tasks yet
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </Droppable>

            <EditListBottomSheetModal ref={bottomSheetRef} listId={list.id} />
        </>
    );
}

const styles = StyleSheet.create({
    column: {
        width: 300,
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginRight: spacing.md,
        maxHeight: '100%',
        overflow: 'visible',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    countBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    countText: {
        fontSize: 13,
        fontWeight: '600',
    },
    moreButton: {
        padding: spacing.xs,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    progressTrack: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 11,
        fontWeight: '500',
    },
    addTaskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: borderRadius.sm,
        marginBottom: spacing.md,
    },
    addTaskText: {
        fontSize: 14,
        fontWeight: '500',
    },
    tasksList: {
        flex: 1,
    },
    tasksListContent: {
        paddingBottom: spacing.lg,
    },
    visibleOverflow: {
        overflow: 'visible',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl,
        gap: spacing.sm,
    },
    emptyText: {
        fontSize: 14,
    },
});
