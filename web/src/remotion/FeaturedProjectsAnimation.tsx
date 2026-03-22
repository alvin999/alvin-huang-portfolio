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

    // 響應式字級
    let fontSize = 96;
    if (width < 768) fontSize = 60;
    else if (width < 1024) fontSize = 72;

    // 基礎動畫參數 (與 FPS 掛鉤)
    const entryDuration = 1.5 * fps;
    
    // 總體 3D 傾斜與位移 (Parallax)
    const containerRotateX = interpolate(frame, [0, entryDuration], [45, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const containerRotateY = interpolate(frame, [0, entryDuration], [-10, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const containerTranslateY = interpolate(frame, [0, entryDuration], [60, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const opacity = interpolate(frame, [0.8 * fps, 1.5 * fps], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const lineWidth = interpolate(frame, [1.2 * fps, 2 * fps], [0, 140], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const words = (title || "Featured Projects").split(" ");

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
            perspective: '1200px',
        }}>
            {/* 多層級背景發光裝飾 (Layered Glow) */}
            {[0, 1, 2].map((i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: 700 - i * 100,
                    height: 250 - i * 50,
                    background: i === 0 
                        ? 'radial-gradient(circle, rgba(234, 111, 40, 0.15) 0%, transparent 70%)'
                        : i === 1
                        ? 'radial-gradient(circle, rgba(250, 189, 47, 0.1) 0%, transparent 65%)'
                        : 'radial-gradient(circle, rgba(131, 165, 152, 0.08) 0%, transparent 60%)',
                    filter: `blur(${100 - i * 20}px)`,
                    borderRadius: '50%',
                    opacity: opacity * (1 - i * 0.2),
                    transform: `translateY(${containerTranslateY * (1 + i * 0.2)}px) 
                                translateX(${interpolate(frame, [0, 90], [i * 20, -i * 20])}px)
                                scale(${interpolate(frame, [0, 60], [0.6, 1.2 + i * 0.1])})`,
                }} />
            ))}

            {/* 主標題容器 */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                maxWidth: 1100,
                transform: `rotateX(${containerRotateX}deg) rotateY(${containerRotateY}deg) translateY(${containerTranslateY}px)`,
                transformStyle: 'preserve-3d',
                gap: '0.25em',
            }}>
                {words.map((word, wordIndex) => {
                    const chars = word.split("");
                    // 基於單自索引計算起始偏移，修正 side-effect 議題
                    const wordStartCharIndex = words.slice(0, wordIndex).join("").length;

                    return (
                        <div key={wordIndex} style={{
                            display: 'flex',
                            whiteSpace: 'nowrap',
                            transformStyle: 'preserve-3d',
                        }}>
                            {chars.map((char, charIndex) => {
                                const absoluteIndex = wordStartCharIndex + charIndex;
                                const charSpring = spring({
                                    frame: frame - absoluteIndex * (fps / 15), // stager 速度與 fps 掛鉤
                                    fps,
                                    config: {
                                        stiffness: 100,
                                        damping: 15,
                                        mass: 0.8,
                                    },
                                    durationRestThreshold: 0.001, // 消除生硬停頓
                                });

                                const charY = interpolate(charSpring, [0, 1], [50, 0]);
                                const charRotate = interpolate(charSpring, [0, 1], [20, 0]);
                                const charOpacity = interpolate(charSpring, [0, 0.4], [0, 1]);
                                
                                // 動態發光陰影
                                const glowIntensity = interpolate(charSpring, [0.8, 1], [0, 20]);

                                return (
                                    <span key={charIndex} style={{
                                        fontSize: `${fontSize}px`, 
                                        fontWeight: 900,
                                        color: '#fabd2f',
                                        display: 'inline-block',
                                        fontFamily: "'Outfit', sans-serif",
                                        transform: `translateY(${charY}px) rotateX(${charRotate}deg) scale(${charSpring})`,
                                        opacity: charOpacity,
                                        textShadow: `0 ${glowIntensity}px ${glowIntensity * 2}px rgba(234, 111, 40, ${interpolate(charSpring, [0.8, 1], [0, 0.3])})`,
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
                backgroundColor: '#ea6928',
                marginTop: 32,
                opacity,
                borderRadius: 4,
                boxShadow: '0 8px 24px rgba(234, 105, 40, 0.4)',
                transform: `translateZ(50px)`, // 稍微浮出
            }} />

            {/* 副標題 */}
            <p style={{
                fontSize: 24,
                color: '#928374',
                marginTop: 40,
                maxWidth: 650,
                lineHeight: 1.6,
                opacity,
                fontFamily: "'Inter', sans-serif",
                transform: `translateY(${interpolate(frame, [fps, 2 * fps], [20, 0], { extrapolateRight: 'clamp' })}px)`,
                letterSpacing: '0.04em',
            }}>
                {subtitle}
            </p>
        </div>
    );
};
