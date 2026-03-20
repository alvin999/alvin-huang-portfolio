import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import React from 'react';

export const FeaturedProjectsAnimation: React.FC<{ 
    title?: string; 
    subtitle?: string;
}> = ({ 
    title = "Featured Projects", 
    subtitle = "A collection of technical experiments and tools."
}) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // 標題進場動畫 (彈簧)
    const titleSpring = spring({
        frame,
        fps,
        config: {
            stiffness: 100,
            damping: 10,
        },
    });

    // 標題上升動畫
    const titleY = interpolate(frame, [0, 30], [20, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // 副標題與裝飾線透明度
    const opacity = interpolate(frame, [15, 45], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // 裝飾線寬度動畫
    const lineWidth = interpolate(frame, [20, 50], [0, 80], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <div style={{
            flex: 1,
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center',
            overflow: 'hidden',
        }}>
            {/* 背景發光裝飾 */}
            <div style={{
                position: 'absolute',
                width: 400,
                height: 150,
                background: 'rgba(234, 111, 40, 0.25)', // Gruvbox Orange, increased opacity
                filter: 'blur(80px)',
                borderRadius: '50%',
                opacity,
                transform: `scale(${titleSpring})`,
            }} />

            {/* 主標題 */}
            <h2 style={{
                fontSize: 64,
                fontWeight: 900,
                color: '#fabd2f', // Gruvbox Yellow for better visibility
                margin: 0,
                letterSpacing: '-0.02em',
                transform: `scale(${titleSpring}) translateY(${titleY}px)`,
                textShadow: '0 10px 30px rgba(0,0,0,0.8)',
            }}>
                {title}
            </h2>

            {/* 裝飾底線 */}
            <div style={{
                height: 4,
                width: lineWidth,
                backgroundColor: '#ea6928', // Gruvbox Orange
                marginTop: 16,
                opacity,
            }} />

            {/* 副標題 */}
            <p style={{
                fontSize: 24,
                color: '#928374', // Gruvbox Gray
                marginTop: 24,
                maxWidth: 600,
                lineHeight: 1.5,
                opacity,
                transform: `translateY(${interpolate(frame, [15, 45], [10, 0], { extrapolateRight: 'clamp' })}px)`,
            }}>
                {subtitle}
            </p>
        </div>
    );
};
