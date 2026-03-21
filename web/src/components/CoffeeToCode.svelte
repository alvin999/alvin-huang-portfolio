<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import lottie from "lottie-web";
  import animationData from "../assets/animations/tea-cup.json";

  let container: HTMLDivElement;
  let lottieContainer: HTMLDivElement;
  let keywordContainer: HTMLDivElement;
  let codeBackground: HTMLDivElement;
  let isMobile = false;

  const coffeeKeywords = ["Extraction", "Roast", "Coffee"];
  const techKeywords = ["TypeScript", "C++", "Astro", "Go", "Python", "Svelte"];
  const codeSnippets = [
    "const brew = new Coffee();",
    "if (temp > 92) flow();",
    "while(isCoding) { drink(); }",
    'import { Energy } from "caffeine";',
    "export default function DevLife() {}",
    'git commit -m "add passion"',
  ];

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lottie
    const anim = lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: animationData,
    });

    // Main Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=2000", // Smooth scroll length
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 1. Coffee Keywords sliding in with different start points simultaneously
    isMobile = window.innerWidth < 768;
    const xBase = isMobile ? window.innerWidth * 0.25 : 400; // 更激進的縮小 (25% 視窗寬度)

    tl.from(".coffee-keyword", {
      x: (i) => [xBase, xBase * 0.5, xBase * 0.8][i], 
      y: (i) => (isMobile ? [-20, 0, 30][i] : [-50, 20, 80][i]), 
      opacity: 0.3,
      stagger: 0, 
      duration: 3,
      ease: "power2.out",
    });

    // 2. Converge to center and disappear into cup
    tl.to(
      ".coffee-keyword",
      {
        x: 0,
        y: 0,
        scale: 0.1,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
      },
      "+=0.3",
    );

    // 3. Lottie Animation playback
    tl.to(
      {},
      {
        duration: 1.5,
        onUpdate: function () {
          const progress = this.progress();
          const frame = Math.floor(progress * anim.totalFrames);
          anim.goToAndStop(frame, true);
        },
      },
    );

    // 4. Tech Keywords bursting out to left
    tl.fromTo(
      ".tech-keyword",
      {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
      },
      {
        x: (i) => (isMobile ? -60 - i * 20 : -150 - i * 50),
        y: (i) => (i % 2 === 0 ? -1 : 1) * (isMobile ? 40 : 100) * (Math.random() + 0.5),
        scale: 1,
        opacity: 0.8,
        stagger: 0.1,
        duration: 1.2,
        ease: "expo.out",
      },
    );

    // 5. Code Background Subtle Movement
    gsap.to(".code-snippet", {
      scrollTrigger: {
        trigger: container,
        scrub: 2,
      },
      y: (i) => -50 - i * 20,
      opacity: 0.15,
      ease: "none",
    });

    // 等待所有動畫初始化完畢，強制重新計算版面（避免影響到下方 index.astro 裡的 gsap-reveal）
    setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      anim.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  });
</script>

<div
  bind:this={container}
  class="relative w-full h-screen overflow-hidden flex items-center justify-center border-y border-white/5"
>
  <!-- Code Background Decor -->
  <div
    bind:this={codeBackground}
    class="absolute inset-0 z-0 pointer-events-none p-4 md:p-10 select-none overflow-hidden"
  >
    {#each codeSnippets as snippet, i}
      <div
        class="code-snippet absolute text-gb-orange font-mono text-[10px] md:text-sm whitespace-nowrap"
        style="top: {15 * (i + 1)}%; left: {i % 2 === 0 ? (isMobile ? '5%' : '10%') : (isMobile ? '50%' : '60%')};"
      >
        {snippet}
      </div>
    {/each}
  </div>

  <div class="relative z-10 flex flex-col items-center">
    <!-- Center Point Content -->
    <div class="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
      <!-- Lottie Container -->
      <div
        bind:this={lottieContainer}
        class="lottie-container w-full h-full opacity-80"
      ></div>

      <!-- Keywords Layers -->
      <div
        bind:this={keywordContainer}
        class="absolute inset-0 flex items-center justify-center"
      >
        <!-- Coffee Keywords (Entry) -->
        {#each coffeeKeywords as word}
          <span
            class="coffee-keyword absolute text-3xl md:text-6xl font-black text-gb-orange tracking-tighter whitespace-nowrap"
          >
            {word}
          </span>
        {/each}

        <!-- Tech Keywords (Exit) -->
        {#each techKeywords as word}
          <span
            class="tech-keyword absolute text-2xl md:text-5xl font-black text-gb-aqua/70 tracking-tighter whitespace-nowrap"
          >
            {word}
          </span>
        {/each}
      </div>
    </div>

    <!-- Description Text (Appears at the end) -->
    <div class="mt-8 text-center gsap-reveal">
      <h2
        class="text-2xl md:text-4xl font-bold text-white/50 tracking-widest uppercase"
      >
        Tech Enthusiast <span class="mx-4 text-gb-red">/</span> Coffee Expert
      </h2>
    </div>
  </div>
</div>

<style>
  /* Ensure keywords are centered initially */
  .coffee-keyword,
  .tech-keyword {
    transform-origin: center;
  }

  /* Force Lottie SVG paths to be white */
  :global(.lottie-container svg path) {
    stroke: white !important;
  }

  :global(.lottie-container svg g) {
    stroke: white !important;
  }
</style>
