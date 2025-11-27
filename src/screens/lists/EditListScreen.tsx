import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaScreen, ScreenHeader } from '@/src/components/layout';
import { Button, ColorPicker, ModalCloseButton, TextInput } from '@/src/components/ui';
import { PRESET_COLORS } from '@/src/constants/Colors';
import { useStore } from '@/src/store/useStore';

export const EditListScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const lists = useStore(state => state.lists);
    const updateList = useStore(state => state.updateList);

    const list = lists.find(l => l.id === Number(id));

    const [name, setName] = useState('');
    const [color, setColor] = useState(PRESET_COLORS[0]);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        if (list) {
            setName(list.name);
            setColor(list.color || PRESET_COLORS[0]);
        }
    }, [list]);

    const handleSave = useCallback(() => {
        if (!list) return;

        if (!name.trim()) {
            setNameError('List name is required');
            return;
        }

        updateList({
            ...list,
            name: name.trim(),
            color: color || PRESET_COLORS[0],
        });

        router.back();
    }, [name, color, list, updateList, router]);

    if (!list) {
        return <Redirect href="/+not-found" />;
    }

    return (
        <SafeAreaScreen edges={['bottom']} paddingTop={Platform.OS === 'android' ? 48 : 24}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScreenHeader title="Edit List" rightAction={() => <ModalCloseButton />} />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    <TextInput
                        label="List Name"
                        placeholder="Enter list name"
                        value={name}
                        onChangeText={text => {
                            setName(text);
                            if (text.trim()) setNameError('');
                        }}
                        error={nameError}
                        returnKeyType="next"
                    />

                    <ColorPicker selectedColor={color} onSelectColor={setColor} />

                    <View style={styles.buttonContainer}>
                        <Button title="Save Changes" onPress={handleSave} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 16,
    },
    buttonContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
});
