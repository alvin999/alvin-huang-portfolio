import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import React from 'react';

export const HeroAnimation: React.FC<{ projectCount: number; frame?: number }> = ({ projectCount, frame: externalFrame }) => {
	const currentFrame = useCurrentFrame();
	const frame = typeof externalFrame !== 'undefined' ? externalFrame : currentFrame;
	const { fps } = useVideoConfig(); // width, height 暫不使用

	// 彈簧動畫效果：專案數字
	const scale = spring({
		frame,
		fps,
		config: {
			stiffness: 100,
		},
	});

	// 文字透明度淡入 (在 0-40 幀完成)
	const opacity = interpolate(frame, [0, 40], [0, 1]);

	return (
		<div style={{
			flex: 1,
			backgroundColor: 'transparent',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontFamily: 'system-ui, -apple-system, sans-serif',
			color: 'white',
			flexDirection: 'column',
		}}>
			<div style={{
				fontSize: 80,
				fontWeight: 'bold',
				transform: `scale(${scale})`,
				background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)',
				WebkitBackgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
			}}>
				{projectCount}+
			</div>
			<div style={{
				fontSize: 24,
				marginTop: 20,
				opacity,
				color: '#9ca3af',
				letterSpacing: '0.1em',
				textTransform: 'uppercase',
			}}>
				Open Source Projects
			</div>
			
			{/* 裝飾性漂浮點 */}
			{[...Array(5)].map((_, i) => {
				const drift = interpolate(frame, [0, 120], [0, 50 * (i + 1)]);
				return (
					<div 
						key={i}
						style={{
							position: 'absolute',
							width: 10 + i * 5,
							height: 10 + i * 5,
							borderRadius: '50%',
							backgroundColor: 'rgba(99, 102, 241, 0.2)',
							left: `${20 + i * 15}%`,
							top: `${30 + i * 10}%`,
							transform: `translateY(-${drift}px)`,
							filter: 'blur(5px)',
						}}
					/>
				);
			})}
		</div>
	);
};
