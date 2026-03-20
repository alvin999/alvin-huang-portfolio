import { Player, type PlayerRef } from '@remotion/player';
import { FeaturedProjectsAnimation } from './FeaturedProjectsAnimation';
import React, { useEffect, useRef } from 'react';

export const RemotionFeaturedProjectsPlayer: React.FC<{ 
    title?: string;
    subtitle?: string;
}> = ({ title, subtitle }) => {
    const totalFrames = 90;
    const playerRef = useRef<PlayerRef>(null);

    useEffect(() => {
        const handleScroll = (e: any) => {
            const progress = e.detail?.progress || 0;
            const currentFrame = Math.round(progress * totalFrames);
            
            if (playerRef.current) {
                playerRef.current.seekTo(currentFrame);
            }
        };

        window.addEventListener('projects-scroll', handleScroll);
        return () => window.removeEventListener('projects-scroll', handleScroll);
    }, []);

    return (
        <div className="w-full h-[400px] md:h-[500px] relative flex items-center justify-center z-50">
            <Player
                ref={playerRef}
                component={FeaturedProjectsAnimation}
                inputProps={{ title, subtitle }}
                durationInFrames={totalFrames}
                fps={30}
                compositionWidth={1200}
                compositionHeight={600}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                }}
                controls={false}
                autoPlay={false}
                loop={false}
            />
        </div>
    );
};
