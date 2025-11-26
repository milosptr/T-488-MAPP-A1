import { Text, View } from '@/src/components/Themed';
import { borderRadius, spacing } from '@/src/constants/DesignTokens';
import { useTheme } from '@/src/hooks/useTheme';
import type { Task } from '@/src/types/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface TaskCardProps {
    task: Task;
    listColor?: string;
    canMoveNext?: boolean;
    onToggleComplete: () => void;
    onMoveToNext?: () => void;
}

export function TaskCard({
    task,
    listColor,
    canMoveNext = false,
    onToggleComplete,
    onMoveToNext,
}: TaskCardProps) {
    const theme = useTheme();
    const isCompleted = task.isFinished;
    const router = useRouter();

    return (
        <Pressable
            onLongPress={() => router.push(`/modals/edit-task?id=${task.id}`)}
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
                    onPress={onToggleComplete}
                    style={({ pressed }) => [
                        styles.checkbox,
                        {
                            backgroundColor: isCompleted ? listColor || theme.tint : 'transparent',
                            borderColor: isCompleted ? listColor || theme.tint : theme.border,
                            transform: [{ scale: pressed ? 0.9 : 1 }],
                        },
                    ]}
                >
                    {isCompleted && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
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

                {canMoveNext && onMoveToNext && (
                    <Pressable
                        onPress={onMoveToNext}
                        style={({ pressed }) => [
                            styles.moveButton,
                            {
                                backgroundColor: pressed ? theme.border : 'transparent',
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={theme.textMuted}
                        />
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
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
    moveButton: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -4,
        marginRight: -8,
    },
});
