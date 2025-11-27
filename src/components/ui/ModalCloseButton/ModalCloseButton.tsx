import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/src/hooks/useTheme';

export const ModalCloseButton = () => {
    const router = useRouter();
    const theme = useTheme();

    if (Platform.OS !== 'android') {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={styles.button}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <MaterialCommunityIcons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 4,
    },
});
