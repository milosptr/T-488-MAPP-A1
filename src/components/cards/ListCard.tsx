import { Text, View } from '@/src/components/Themed';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import type { List } from '@/src/types/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface ListCardProps {
    list: List;
    onPress?: () => void;
}

export function ListCard({ list, onPress }: ListCardProps) {
    const theme = useTheme();
    const deleteList = useStore(state => state.deleteList);
    const allTasks = useStore(state => state.tasks);
    const tasks = React.useMemo(() => allTasks.filter(t => t.listId === list.id), [allTasks, list.id]);
    const router = useRouter();

    const handleDelete = () => {
        deleteList(list.id);
    };

    const handlePress = () => {
        if (onPress) return onPress();
        router.push(`/single-list?id=${list.id}`);
    };

    return (
        <View
            style={[
                styles.card,
                { borderColor: theme.border },
            ]}
        >
            <View style={styles.row}>
                <Pressable onPress={handlePress} style={styles.pressArea}>
                    {({ pressed }) => (
                        <View style={[styles.innerPress, { opacity: pressed ? 0.9 : 1 }]}>
                            <View
                                style={[styles.swatch, { backgroundColor: list.color || theme.tint }]}
                            />

                            <Text style={styles.name}>{list.name}</Text>
                        </View>
                    )}
                </Pressable>

                <View style={styles.spacer} />

                <Text style={styles.count}>{tasks.length}</Text>

                <Pressable onPress={handleDelete} style={styles.iconButton}>
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.text} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pressArea: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    innerPress: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    swatch: {
        width: 20,
        height: 20,
        borderRadius: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    spacer: {
        flex: 1,
    },
    count: {
        fontSize: 14,
        opacity: 0.8,
        marginRight: 8,
    },
    iconButton: {
        padding: 6,
        borderRadius: 6,
    },
});
