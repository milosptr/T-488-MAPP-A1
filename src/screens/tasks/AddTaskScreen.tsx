import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button, ModalCloseButton, TextInput } from '@/src/components/ui';
import { SafeAreaScreen, ScreenHeader } from '@/src/components/layout';
import { useStore } from '@/src/store/useStore';

export const AddTaskScreen = () => {
    const router = useRouter();
    const { listId } = useLocalSearchParams();
    const addTask = useStore(state => state.addTask);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState('');

    const handleAdd = useCallback(() => {
        if (!name.trim()) {
            setNameError('Task name is required');
            return;
        }

        addTask(Number(listId), {
            name: name.trim(),
            description: description.trim() || undefined,
        });

        router.back();
    }, [name, description, listId, addTask, router]);

    return (
        <SafeAreaScreen edges={['bottom']} paddingTop={Platform.OS === 'android' ? 48 : 24}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScreenHeader title="Add New Task" rightAction={() => <ModalCloseButton />} />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    <TextInput
                        label="Task Name"
                        placeholder="Enter task name"
                        value={name}
                        onChangeText={text => {
                            setName(text);
                            if (text.trim()) setNameError('');
                        }}
                        error={nameError}
                        returnKeyType="next"
                    />

                    <TextInput
                        label="Description (optional)"
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        returnKeyType="done"
                    />

                    <View style={styles.buttonContainer}>
                        <Button title="Add Task" onPress={handleAdd} />
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
