// components/ui/CachedImage.tsx
// Image component with built-in caching and loading states

import React, { useState, useCallback } from 'react';
import {
    Image,
    ImageProps,
    View,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, borderRadius } from '../../constants/colors';
import { ImageOff } from 'lucide-react-native';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
    uri: string;
    fallbackUri?: string;
    showLoading?: boolean;
    showError?: boolean;
    borderRadius?: number;
}

export const CachedImage = React.memo(function CachedImage({
    uri,
    fallbackUri,
    showLoading = true,
    showError = true,
    borderRadius: radius = borderRadius.md,
    style,
    ...props
}: CachedImageProps) {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoadStart = useCallback(() => {
        setIsLoading(true);
        setHasError(false);
    }, []);

    const handleLoadEnd = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleError = useCallback(() => {
        setIsLoading(false);
        setHasError(true);
    }, []);

    // Use fallback if primary source fails
    const imageSource = hasError && fallbackUri
        ? { uri: fallbackUri }
        : { uri };

    return (
        <View style={[styles.container, { borderRadius: radius }, style]}>
            <Image
                {...props}
                source={imageSource}
                style={[styles.image, { borderRadius: radius }]}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
            />

            {/* Loading indicator */}
            {isLoading && showLoading && (
                <View style={[styles.overlay, { backgroundColor: colors.surfaceSolid }]}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            )}

            {/* Error state */}
            {hasError && !fallbackUri && showError && (
                <View style={[styles.overlay, { backgroundColor: colors.surfaceSolid }]}>
                    <ImageOff size={24} color={colors.textMuted} />
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
