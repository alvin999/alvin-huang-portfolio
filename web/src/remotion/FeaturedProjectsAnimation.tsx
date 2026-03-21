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
    const { fps, width } = useVideoConfig();

    // 模擬 Tailwind 字級邏輯
    let fontSize = 96; // 預設 (lg/xl)
    if (width < 768) {
        fontSize = 60; // 行動版 (text-5xl 左右)
    } else if (width < 1024) {
        fontSize = 72; // 平板版 (text-7xl 左右)
    }

    // 總體 3D 傾斜與位移
    const containerRotateX = interpolate(frame, [0, 50], [45, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const containerTranslateY = interpolate(frame, [0, 50], [50, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // 副標題與裝飾線透明度
    const opacity = interpolate(frame, [30, 60], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // 裝飾線寬度動畫 (延後一點)
    const lineWidth = interpolate(frame, [40, 70], [0, 120], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // 將標題拆分為單字處理，以支援正確換行
    const words = (title || "Featured Projects").split(" ");
    let charCounter = 0; // 用於計算 staggered 延遲

    return (
        <div style={{
            flex: 1,
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Inter', sans-serif",
            textAlign: 'center',
            overflow: 'hidden',
            perspective: '1000px', // 建立 3D 空間
        }}>
            {/* 背景發光裝飾 */}
            <div style={{
                position: 'absolute',
                width: 600,
                height: 200,
                background: 'radial-gradient(circle, rgba(234, 111, 40, 0.25) 0%, transparent 70%)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                opacity,
                transform: `translateY(${containerTranslateY}px) scale(${interpolate(frame, [0, 60], [0.5, 1.2])})`,
            }} />

            {/* 主標題容器 (3D 傾斜 + 單字級換行支援) */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                maxWidth: 1100,
                transform: `rotateX(${containerRotateX}deg) translateY(${containerTranslateY}px)`,
                transformStyle: 'preserve-3d',
                gap: '0.2em', // 單字間距
            }}>
                {words.map((word, wordIndex) => {
                    const chars = word.split("");
                    return (
                        <div key={wordIndex} style={{
                            display: 'flex',
                            whiteSpace: 'nowrap', // 確保單字內部不換行
                            transformStyle: 'preserve-3d',
                        }}>
                            {chars.map((char, charIndex) => {
                                const index = charCounter++;
                                // 為每個字元計算 staggered spring
                                const charSpring = spring({
                                    frame: frame - index * 2, // 逐字延遲 2 幀
                                    fps,
                                    config: {
                                        stiffness: 120,
                                        damping: 12,
                                    },
                                });

                                // 每個字元的微小位移與縮放
                                const charY = interpolate(charSpring, [0, 1], [40, 0]);
                                const charOpacity = interpolate(charSpring, [0, 0.5], [0, 1]);

                                return (
                                    <span key={charIndex} style={{
                                        fontSize: `${fontSize}px`, 
                                        fontWeight: 900,
                                        color: '#fabd2f', // Gruvbox Yellow
                                        display: 'inline-block',
                                        fontFamily: "'Outfit', sans-serif",
                                        transform: `translateY(${charY}px) scale(${charSpring})`,
                                        opacity: charOpacity,
                                        textShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    }}>
                                        {char}
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* 裝飾底線 */}
            <div style={{
                height: 6,
                width: lineWidth,
                backgroundColor: '#ea6928', // Gruvbox Orange
                marginTop: 24,
                opacity,
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(234, 105, 40, 0.3)',
            }} />

            {/* 副標題 */}
            <p style={{
                fontSize: 24,
                color: '#928374', // Gruvbox Gray
                marginTop: 32,
                maxWidth: 600,
                lineHeight: 1.5,
                opacity,
                fontFamily: "'Inter', sans-serif",
                transform: `translateY(${interpolate(frame, [30, 60], [20, 0], { extrapolateRight: 'clamp' })}px)`,
                letterSpacing: '0.05em',
            }}>
                {subtitle}
            </p>
        </div>
    );
};
