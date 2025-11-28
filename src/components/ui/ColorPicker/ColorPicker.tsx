import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PRESET_COLORS } from '@/src/constants/Colors';
import { useTheme } from '@/src/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { Text } from '../Themed';

interface ColorPickerProps {
    selectedColor: string;
    onSelectColor: (color: string) => void;
    label?: string;
}

export function ColorPicker({ selectedColor, onSelectColor, label = 'Color' }: ColorPickerProps) {
    const theme = useTheme();

    const handleColorSelect = useCallback(
        (color: string) => {
            Haptics.selectionAsync();
            onSelectColor(color);
        },
        [onSelectColor]
    );

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: theme.onSurface }]}>{label}</Text>
            <View style={styles.grid}>
                {PRESET_COLORS.map(color => {
                    const isSelected = selectedColor.toUpperCase() === color.toUpperCase();
                    return (
                        <View key={color} style={styles.colorItem}>
                            <Pressable
                                onPress={() => handleColorSelect(color)}
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: color },
                                    isSelected && { borderColor: theme.onSurface },
                                ]}
                            >
                                {isSelected && (
                                    <View style={styles.checkmark}>
                                        <Text
                                            style={[
                                                styles.checkmarkText,
                                                { color: theme.onSurface },
                                            ]}
                                        >
                                            ✓
                                        </Text>
                                    </View>
                                )}
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 12,
    },
    colorItem: {
        width: '16.666%',
        alignItems: 'center',
    },
    colorCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
