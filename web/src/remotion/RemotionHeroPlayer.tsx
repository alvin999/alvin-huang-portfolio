import { Player } from '@remotion/player';
import { HeroAnimation } from './HeroAnimation';
import React from 'react';

export const RemotionHeroPlayer: React.FC<{ projectCount: number }> = ({ projectCount }) => {
	const [frame, setFrame] = React.useState(0);
	const totalFrames = 120;

	React.useEffect(() => {
		const handleScroll = (e: any) => {
			if (e.detail !== undefined) {
				const progress = e.detail; // 0 to 1
				setFrame(Math.floor(progress * totalFrames));
			}
		};

		window.addEventListener('hero-scroll', handleScroll as any);
		return () => window.removeEventListener('hero-scroll', handleScroll as any);
	}, []);

	return (
		<div className="w-full max-w-[500px] aspect-square mx-auto rounded-3xl overflow-hidden bg-black/20 border border-white/5 shadow-2xl">
			<Player
				component={HeroAnimation}
				inputProps={{ projectCount, frame }}
				durationInFrames={totalFrames}
				fps={30}
				compositionWidth={500}
				compositionHeight={500}
				style={{
					width: '100%',
					height: '100%',
				}}
				controls={false}
				autoPlay={false}
				loop={false}
			/>
		</div>
	);
};
