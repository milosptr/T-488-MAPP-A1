import { Text, View } from '@/src/components/Themed';
import { useTheme } from '@/src/hooks/useTheme';
import type { Board } from '@/src/types/data';
import React from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';

interface BoardCardProps {
    board: Board;
    style?: ViewStyle;
}

export function BoardCard({ board, style }: BoardCardProps) {
    const theme = useTheme();

    return (
        <View style={[styles.card, style, { borderColor: theme.border }]}>
            <Image
                source={{ uri: board.thumbnailPhoto }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={[styles.content, { backgroundColor: theme.surface }]}>
                <Text style={styles.name}>{board.name}</Text>
                <Text style={styles.description}>{board.description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
    },
    thumbnail: {
        width: '100%',
        height: 200,
    },
    content: {
        padding: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        opacity: 0.7,
    },
});
