import { Player } from '@remotion/player';
import { ProjectAnimation } from './ProjectAnimation';
import React from 'react';

export const RemotionProjectPlayer: React.FC<{ 
	imageUrl: string; 
	projectName: string;
}> = ({ imageUrl, projectName }) => {
	const [frame, setFrame] = React.useState(0);
	const [isHovered, setIsHovered] = React.useState(false);
	const [isInView, setIsInView] = React.useState(false);
	const totalFrames = 60;
	const containerRef = React.useRef<HTMLDivElement>(null);

	// Scroll Trigger: Intersection Observer
	React.useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true);
					// 一次性觸發進場動畫或是只要在視區就播放? 
					// 通常是進入視區播放一次，或是保持播放。
				}
			},
			{ threshold: 0.2 }
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => observer.disconnect();
	}, []);

	React.useEffect(() => {
		let interval: NodeJS.Timeout;
		// 只要在視區內或是被懸停，就繼續播放到結束
		if (isHovered || isInView) {
			interval = setInterval(() => {
				setFrame(f => {
					if (f < totalFrames) return f + 1;
					// 如果播完了且不在懸停狀態，就停在最後一幀
					return f;
				});
			}, 1000 / 30);
		}
		return () => clearInterval(interval);
	}, [isHovered, isInView]);

	return (
		<div 
			ref={containerRef}
			className="w-full aspect-video rounded-xl overflow-hidden bg-gb-bg-hard/40 border border-white/5 shadow-lg group-hover:border-gb-orange/30 transition-all duration-500"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Player
				component={ProjectAnimation}
				inputProps={{ imageUrl, projectName, frame }}
				durationInFrames={totalFrames}
				fps={30}
				compositionWidth={800}
				compositionHeight={450}
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
