import { Text, View } from '@/src/components/ui/Themed';
import { borderRadius, spacing } from '@/src/constants/DesignTokens';
import { useTheme } from '@/src/hooks/useTheme';
import { Draggable } from '@/src/lib/dnd';
import type { Task } from '@/src/types/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';

interface TaskCardProps {
    task: Task;
    listColor?: string;
    onToggleComplete: () => void;
}

export function TaskCard({ task, listColor, onToggleComplete }: TaskCardProps) {
    const theme = useTheme();
    const isCompleted = task.isFinished;
    const router = useRouter();
    const isDraggingRef = useRef(false);

    const handlePress = () => {
        if (!isDraggingRef.current) {
            router.push(`/modals/edit-task?id=${task.id}`);
        }
    };

    const handleToggle = useCallback(() => {
        if (task.isFinished) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        onToggleComplete();
    }, [task.isFinished, onToggleComplete]);

    return (
        <Draggable
            data={{ id: task.id }}
            style={styles.draggable}
            onDragStart={() => {
                isDraggingRef.current = true;
            }}
            onDragEnd={() => {
                // Small delay to prevent press from firing after drag ends
                setTimeout(() => {
                    isDraggingRef.current = false;
                }, 100);
            }}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePress}
                style={[
                    styles.card,
                    {
                        backgroundColor: theme.surface,
                        shadowColor: theme.text,
                    },
                ]}
            >
                <View
                    style={[
                        styles.accentStrip,
                        {
                            backgroundColor: listColor || theme.tint,
                            opacity: isCompleted ? 0.4 : 1,
                        },
                    ]}
                />

                <View style={styles.cardContent}>
                    <Pressable
                        onPress={handleToggle}
                        style={({ pressed }) => [
                            styles.checkbox,
                            {
                                backgroundColor: isCompleted
                                    ? listColor || theme.tint
                                    : 'transparent',
                                borderColor: isCompleted ? listColor || theme.tint : theme.border,
                                transform: [{ scale: pressed ? 0.9 : 1 }],
                            },
                        ]}
                    >
                        {isCompleted && (
                            <MaterialCommunityIcons name="check" size={14} color="#fff" />
                        )}
                    </Pressable>

                    <View style={styles.textContent}>
                        <Text
                            style={[
                                styles.taskName,
                                {
                                    color: theme.text,
                                    textDecorationLine: isCompleted ? 'line-through' : 'none',
                                    opacity: isCompleted ? 0.5 : 1,
                                },
                            ]}
                            numberOfLines={2}
                        >
                            {task.name}
                        </Text>
                        {task.description ? (
                            <Text
                                style={[
                                    styles.taskDescription,
                                    {
                                        color: theme.textMuted,
                                        textDecorationLine: isCompleted ? 'line-through' : 'none',
                                        opacity: isCompleted ? 0.5 : 1,
                                    },
                                ]}
                                numberOfLines={2}
                            >
                                {task.description}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
        </Draggable>
    );
}

const styles = StyleSheet.create({
    draggable: {
        width: '100%',
    },
    card: {
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    accentStrip: {
        height: 3,
        width: '100%',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.md,
        gap: spacing.md,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    textContent: {
        flex: 1,
        gap: spacing.xs,
    },
    taskName: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
    },
    taskDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
});
