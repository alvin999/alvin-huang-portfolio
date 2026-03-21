import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * 初始化首頁 GSAP 動畫
 */
export function initHomeAnimations() {
	gsap.registerPlugin(ScrollTrigger);

	// 1. Hero 整體縮放與位移 (頭像 + 標題)
	const heroTrigger = document.getElementById("hero-trigger");
	const projectCountEl = document.getElementById("project-count");

	if (!heroTrigger) return;

	const heroTl = gsap.timeline({
		scrollTrigger: {
			trigger: "#hero-trigger",
			start: "top top",
			end: "bottom bottom",
			scrub: 1.5,
			onUpdate: (self) => {
				// 從 DOM 讀取專案總數，再依捲動進度計算當前顯示值
				const totalProjects = parseInt(
					heroTrigger.dataset.count ?? "0",
					10,
				);
				const current = Math.round(self.progress * totalProjects);
				if (projectCountEl) projectCountEl.textContent = String(current);
			},
		},
	});

	heroTl.to(
		"#avatar-container",
		{
			scale: 0.4,
			y: -250,
			opacity: 0,
		},
		0,
	);

	heroTl.to(
		"#hero-text",
		{
			y: -300,
		},
		0,
	);

	heroTl.to(
		"#profile-badge",
		{
			x: 60,
			scale: 0.9,
		},
		0,
	);

	// 2. 獨立的掃光動畫 (一捲動就出現)
	gsap.to("#badge-shine", {
		scrollTrigger: {
			trigger: "#hero-trigger",
			start: "top top",
			end: "15% top",
			scrub: 1,
		},
		x: "150%",
		ease: "none",
	});

	// 3. 標題與 CTA 進場
	gsap.from("#hero-title", {
		opacity: 0,
		y: 30,
		duration: 1.2,
		delay: 0.2,
		ease: "expo.out",
	});
	gsap.from("#hero-desc", {
		opacity: 0,
		y: 20,
		duration: 1.2,
		delay: 0.4,
		ease: "expo.out",
	});
	gsap.from("#hero-cta", {
		opacity: 0,
		scale: 0.9,
		duration: 1.2,
		delay: 0.6,
		ease: "expo.out",
	});

	// 4. 內容區塊揭露動畫
	gsap.utils.toArray(".gsap-reveal").forEach((elem: any) => {
		gsap.from(elem, {
			scrollTrigger: {
				trigger: elem,
				start: "top 85%",
				toggleActions: "play none none reverse",
			},
			y: 50,
			opacity: 0,
			duration: 1,
			ease: "power3.out",
		});
	});

	// 5. 專案列表交錯揭露
	gsap.from(".gsap-reveal-stagger", {
		scrollTrigger: {
			trigger: ".gsap-reveal-stagger",
			start: "top 80%",
			toggleActions: "play none none reverse",
		},
		y: 100,
		opacity: 0,
		duration: 1.5,
		ease: "power4.out",
	});

	// 6. Featured Projects Remotion 同步動畫
	const projectsAnimationContainer = document.getElementById("projects-animation-container");
	if (projectsAnimationContainer) {
		gsap.to(projectsAnimationContainer, {
			scrollTrigger: {
				trigger: projectsAnimationContainer,
				start: "top 90%",
				end: "bottom 20%",
				scrub: true,
				onUpdate: (self) => {
					window.dispatchEvent(new CustomEvent('projects-scroll', { 
						detail: { progress: self.progress } 
					}));
				}
			}
		});
	}
}
