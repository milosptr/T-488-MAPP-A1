import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { SafeAreaScreen, ScreenHeader } from '@/src/components/layout';
import { Button, ModalCloseButton, Text, TextInput, View } from '@/src/components/ui';
import { useTheme } from '@/src/hooks/useTheme';
import { useStore } from '@/src/store/useStore';
import { createListsFromTemplate, getBoardTemplateById, getBoardTemplates } from '@/src/templates';
import { BoardTemplate } from '@/src/types/data';

interface FormErrors {
    name: string;
    description: string;
    thumbnail: string;
}

const INITIAL_ERRORS: FormErrors = {
    name: '',
    description: '',
    thumbnail: '',
};

const ERROR_MESSAGES = {
    NAME_REQUIRED: 'Board name is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    THUMBNAIL_REQUIRED: 'Please select a thumbnail image',
    PERMISSION_DENIED: 'Sorry, we need camera roll permissions to select an image.',
} as const;

const IMAGE_PICKER_CONFIG: ImagePicker.ImagePickerOptions = {
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.8,
} as const;

const templates = getBoardTemplates();

interface TemplateCardProps {
    template: BoardTemplate | null;
    isSelected: boolean;
    onSelect: () => void;
}

const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
    const theme = useTheme();

    const handleSelect = useCallback(() => {
        Haptics.selectionAsync();
        onSelect();
    }, [onSelect]);

    return (
        <TouchableOpacity
            onPress={handleSelect}
            style={[
                styles.templateCard,
                {
                    backgroundColor: theme.surface,
                    borderColor: isSelected ? theme.tint : theme.border,
                    borderWidth: 1,
                },
            ]}
            activeOpacity={0.7}
        >
            {template ? (
                <>
                    <Text style={[styles.templateName, { color: theme.text }]} numberOfLines={1}>
                        {template.name}
                    </Text>
                    {template.description && (
                        <Text
                            style={[styles.templateDescription, { color: theme.textMuted }]}
                            numberOfLines={2}
                        >
                            {template.description}
                        </Text>
                    )}
                    <View style={styles.templateListsPreview}>
                        {template.lists.slice(0, 4).map((list, index) => (
                            <View
                                key={index}
                                style={[styles.listDot, { backgroundColor: list.color }]}
                            />
                        ))}
                        {template.lists.length > 4 && (
                            <Text style={[styles.moreListsText, { color: theme.textMuted }]}>
                                +{template.lists.length - 4}
                            </Text>
                        )}
                    </View>
                </>
            ) : (
                <>
                    <Text style={[styles.templateName, { color: theme.text }]}>None</Text>
                    <Text style={[styles.templateDescription, { color: theme.textMuted }]}>
                        Start from scratch
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export const AddBoardScreen = () => {
    const theme = useTheme();
    const router = useRouter();
    const boards = useStore(state => state.boards);
    const lists = useStore(state => state.lists);
    const addBoard = useStore(state => state.addBoard);
    const addList = useStore(state => state.addList);

    const [boardName, setBoardName] = useState('');
    const [boardDescription, setBoardDescription] = useState('');
    const [boardThumbnailPhoto, setBoardThumbnailPhoto] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);

    const pickImage = useCallback(async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', ERROR_MESSAGES.PERMISSION_DENIED);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_CONFIG);

        if (!result.canceled && result.assets[0]) {
            setBoardThumbnailPhoto(result.assets[0].uri);
            setErrors(prev => ({ ...prev, thumbnail: '' }));
        }
    }, []);

    const handleNameChange = useCallback((text: string) => {
        setBoardName(text);
        if (text.trim()) {
            setErrors(prev => ({ ...prev, name: '' }));
        }
    }, []);

    const handleDescriptionChange = useCallback((text: string) => {
        setBoardDescription(text);
        if (text.trim()) {
            setErrors(prev => ({ ...prev, description: '' }));
        }
    }, []);

    const handleTemplateSelect = useCallback((templateId: string | null) => {
        setSelectedTemplateId(templateId);
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = { ...INITIAL_ERRORS };
        let isValid = true;

        if (!boardName.trim()) {
            newErrors.name = ERROR_MESSAGES.NAME_REQUIRED;
            isValid = false;
        }

        if (!boardDescription.trim()) {
            newErrors.description = ERROR_MESSAGES.DESCRIPTION_REQUIRED;
            isValid = false;
        }

        if (!boardThumbnailPhoto) {
            newErrors.thumbnail = ERROR_MESSAGES.THUMBNAIL_REQUIRED;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [boardName, boardDescription, boardThumbnailPhoto]);

    const handleAddBoard = useCallback(() => {
        if (!validateForm()) {
            return;
        }

        // Generate new board ID
        const newBoardId = boards.length > 0 ? Math.max(...boards.map(b => b.id)) + 1 : 1;

        // Create the board
        addBoard({
            id: newBoardId,
            name: boardName.trim(),
            description: boardDescription.trim(),
            thumbnailPhoto: boardThumbnailPhoto,
        });

        // If a template is selected, create lists from the template
        if (selectedTemplateId) {
            const template = getBoardTemplateById(selectedTemplateId);
            if (template) {
                // Calculate the starting list ID
                const startListId = lists.length > 0 ? Math.max(...lists.map(l => l.id)) + 1 : 1;

                // Create lists from template
                const newLists = createListsFromTemplate(newBoardId, template, startListId);

                // Add each list to the store
                newLists.forEach(list => addList(list));
            }
        }

        // Navigate to the new board
        router.replace(`/boards/${newBoardId}`);
    }, [
        validateForm,
        boards,
        lists,
        addBoard,
        addList,
        boardName,
        boardDescription,
        boardThumbnailPhoto,
        selectedTemplateId,
        router,
    ]);

    return (
        <SafeAreaScreen edges={['bottom']} paddingTop={Platform.OS === 'android' ? 48 : 24}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScreenHeader title="Add New Board" rightAction={() => <ModalCloseButton />} />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    <TextInput
                        label="Board Name"
                        placeholder="Enter board name"
                        value={boardName}
                        onChangeText={handleNameChange}
                        error={errors.name}
                        returnKeyType="next"
                    />

                    <TextInput
                        label="Description"
                        placeholder="Enter board description"
                        value={boardDescription}
                        onChangeText={handleDescriptionChange}
                        error={errors.description}
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                        returnKeyType="done"
                    />

                    <View style={styles.imageSection}>
                        <Text style={styles.label}>Thumbnail Image</Text>

                        {boardThumbnailPhoto ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: boardThumbnailPhoto }}
                                    style={[styles.imagePreview, { borderColor: theme.border }]}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={[
                                        styles.changeImageButton,
                                        { backgroundColor: theme.surface },
                                    ]}
                                >
                                    <Text style={styles.changeImageText}>Change Image</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={pickImage}
                                style={[
                                    styles.imagePlaceholder,
                                    {
                                        backgroundColor: theme.surface,
                                        borderColor: errors.thumbnail ? theme.error : theme.border,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.imagePlaceholderText,
                                        { color: theme.textMuted },
                                    ]}
                                >
                                    Tap to select an image
                                </Text>
                            </TouchableOpacity>
                        )}

                        {errors.thumbnail ? (
                            <Text style={[styles.errorText, { color: theme.error }]}>
                                {errors.thumbnail}
                            </Text>
                        ) : null}
                    </View>

                    <View style={styles.templateSection}>
                        <Text style={styles.label}>Template</Text>
                        <Text style={[styles.templateHint, { color: theme.textMuted }]}>
                            Choose a template to start with predefined lists
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.templateScrollView}
                            contentContainerStyle={styles.templateScrollContent}
                        >
                            <TemplateCard
                                template={null}
                                isSelected={selectedTemplateId === null}
                                onSelect={() => handleTemplateSelect(null)}
                            />
                            {templates.map(template => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    isSelected={selectedTemplateId === template.id}
                                    onSelect={() => handleTemplateSelect(template.id)}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button title="Add Board" onPress={handleAddBoard} />
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
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    imageSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    imagePlaceholder: {
        height: 200,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        fontSize: 14,
    },
    imagePreviewContainer: {
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        borderWidth: 1,
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    changeImageText: {
        fontSize: 12,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
    templateSection: {
        marginBottom: 16,
    },
    templateHint: {
        fontSize: 12,
        marginBottom: 12,
    },
    templateScrollView: {
        marginHorizontal: -16,
    },
    templateScrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    templateCard: {
        width: 160,
        padding: 12,
        borderRadius: 12,
        minHeight: 100,
    },
    templateName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    templateDescription: {
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 8,
    },
    templateListsPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 'auto',
    },
    listDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    moreListsText: {
        fontSize: 10,
        marginLeft: 2,
    },
    buttonContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
});
