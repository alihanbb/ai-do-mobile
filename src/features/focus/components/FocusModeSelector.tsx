import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { ChevronRight, Settings, Plus } from 'lucide-react-native';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';

interface FocusModeSelectorProps {
    onSettingsPress: () => void;
    onAddRecordPress: () => void;
}

export const FocusModeSelector: React.FC<FocusModeSelectorProps> = ({
    onSettingsPress,
    onAddRecordPress,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const [menuVisible, setMenuVisible] = useState(false);

    const styles = createStyles(colors);

    return (
        <View>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setMenuVisible(true)}
            >
                <Text style={styles.selectorText}>Odaklanma</Text>
                <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setMenuVisible(false);
                                onSettingsPress();
                            }}
                        >
                            <Settings size={20} color={colors.textPrimary} />
                            <Text style={styles.menuText}>Odak Ayarları</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setMenuVisible(false);
                                onAddRecordPress();
                            }}
                        >
                            <Plus size={20} color={colors.textPrimary} />
                            <Text style={styles.menuText}>Kayıt Ekle</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        selector: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
        },
        selectorText: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 150,
        },
        menuContainer: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.md,
            paddingVertical: spacing.sm,
            minWidth: 180,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
        },
        menuText: {
            fontSize: 14,
            color: colors.textPrimary,
        },
    });
