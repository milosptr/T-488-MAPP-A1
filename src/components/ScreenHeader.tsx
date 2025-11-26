import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';

type Props = {
    title: string;
    rightAction?: () => React.ReactNode;
};

export const ScreenHeader = ({ title, rightAction }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
            {rightAction?.()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    titleContainer: {
        flexShrink: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
