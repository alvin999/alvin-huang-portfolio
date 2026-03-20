import { spring, useCurrentFrame, useVideoConfig, interpolate, Img, AbsoluteFill } from 'remotion';
import React from 'react';

export const ProjectAnimation: React.FC<{ 
	imageUrl: string; 
	projectName: string;
	frame?: number;
}> = ({ imageUrl, projectName, frame: externalFrame }) => {
	const currentFrame = useCurrentFrame();
	const frame = typeof externalFrame !== 'undefined' ? externalFrame : currentFrame;
	const { fps, width, height } = useVideoConfig();

	// 彈簧動畫：圖片縮放與進入
	const scale = spring({
		frame,
		fps,
		config: {
			stiffness: 100,
			damping: 20,
		},
	});

	// 透明度淡入
	const opacity = interpolate(frame, [0, 20], [0, 1]);

	// 背景裝飾性漸層動畫
	const bgGradientPos = interpolate(frame, [0, 120], [0, 100]);

	const [imgError, setImgError] = React.useState(false);

	// 當 imageUrl 改變時，重設錯誤狀態以重新嘗試載入
	React.useEffect(() => {
		setImgError(false);
	}, [imageUrl]);

	return (
		<AbsoluteFill style={{
			backgroundColor: '#1d2021', // gb-bg-hard
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			overflow: 'hidden',
		}}>
			{/* 背景漸層 */}
			<div style={{
				position: 'absolute',
				inset: 0,
				background: `linear-gradient(${45 + bgGradientPos}deg, rgba(254, 128, 25, 0.08) 0%, rgba(250, 189, 47, 0.08) 50%, rgba(211, 134, 155, 0.08) 100%)`,
			}} />

			{/* 圖片或字卡展示 */}
			<div style={{
				width: '85%',
				height: '70%',
				borderRadius: 16,
				overflow: 'hidden',
				boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
				border: '1px solid rgba(255,255,255,0.12)',
				transform: `scale(${scale})`,
				opacity,
				display: 'flex',
				backgroundColor: '#282828', // gb-bg
				position: 'relative',
			}}>
				{!imgError && imageUrl ? (
					<Img 
						src={imageUrl} 
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
						onError={() => setImgError(true)}
					/>
				) : (
					/* 預質字卡效果 (Premium Text Card) */
					<div style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						padding: 20,
						background: 'linear-gradient(135deg, #282828 0%, #1d2021 100%)',
						textAlign: 'center',
					}}>
						<div style={{
							fontSize: 42,
							fontWeight: 900,
							background: 'linear-gradient(to bottom, #fff 0%, #666 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							letterSpacing: '-0.02em',
							lineHeight: 1.1,
							marginBottom: 10,
						}}>
							{projectName.toUpperCase()}
						</div>
						<div style={{
							fontSize: 14,
							color: '#fe8019', // gb-orange
							fontWeight: 600,
							letterSpacing: '0.4em',
							opacity: 0.8,
						}}>
							SNAPSHOT PENDING
						</div>
					</div>
				)}
			</div>

			{/* 裝飾性粒子 (延續 Hero 風格) */}
			{[...Array(3)].map((_, i) => {
				const drift = interpolate(frame, [0, 120], [0, 30 * (i + 1)]);
				return (
					<div 
						key={i}
						style={{
							position: 'absolute',
							width: 10 + i * 5,
							height: 10 + i * 5,
							borderRadius: '50%',
							backgroundColor: 'rgba(254, 128, 25, 0.1)',
							left: `${15 + i * 25}%`,
							bottom: `${10 + i * 15}%`,
							transform: `translateY(-${drift}px)`,
							filter: 'blur(4px)',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
