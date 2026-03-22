<script>
    import { onMount } from 'svelte';
    import { getProjectScreenshot, getProjectReleaseUrl } from '../lib/github';
    import RemotionProjectPlayerWrapper from './RemotionProjectPlayerWrapper.svelte';

    let { project } = $props();
    
    // Formatting stars with Svelte 5 reactivity
    let formattedStars = $derived(new Intl.NumberFormat('en-US').format(project.stars));

    // Dynamic screenshot URL state
    let screenshotUrl = $state('');
    let releaseUrl = $state(null);

    onMount(async () => {
        // 優先讀取 Firestore 快取的截圖，避免觸發 GitHub API 限制
        if (project.screenshot_url) {
            screenshotUrl = project.screenshot_url;
        } else {
            screenshotUrl = await getProjectScreenshot(project.name, project.screenshot);
        }

        // 檢查是否有 Release
        releaseUrl = await getProjectReleaseUrl(project.name);
    });
    
    // Determine language color
    const getLanguageColor = (lang) => {
        const colors = {
            'JavaScript': 'bg-gb-yellow/20 text-gb-yellow border-gb-yellow/30',
            'TypeScript': 'bg-gb-blue/20 text-gb-blue border-gb-blue/30',
            'Python': 'bg-gb-green/20 text-gb-green border-gb-green/30',
            'Go': 'bg-gb-aqua/20 text-gb-aqua border-gb-aqua/30',
            'Rust': 'bg-gb-orange/20 text-gb-orange border-gb-orange/30',
            'HTML': 'bg-gb-orange/20 text-gb-orange border-gb-orange/30',
            'CSS': 'bg-gb-blue/20 text-gb-blue border-gb-blue/30',
            'Java': 'bg-gb-red/20 text-gb-red border-gb-red/30',
            'C++': 'bg-gb-purple/20 text-gb-purple border-gb-purple/30',
            'C#': 'bg-gb-purple/20 text-gb-purple border-gb-purple/30',
            'Shell': 'bg-gb-fg/20 text-gb-fg border-gb-fg/30',
            'Vim Script': 'bg-gb-green/20 text-gb-green border-gb-green/30',
            'Vue': 'bg-gb-aqua/20 text-gb-aqua border-gb-aqua/30'
        };
        return colors[lang] || 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    };

    // 判斷是否為主要首頁連結 (如果 url 跟 github 不同)
    const homepageUrl = $derived(project.url && project.url !== project.github_repo ? project.url : null);
    const githubUrl = $derived(project.github_repo || project.url);
</script>

<div 
    class="group relative flex flex-col justify-between p-6 rounded-2xl bg-gb-bg-soft/30 hover:bg-gb-bg-soft/50 border border-white/10 hover:border-gb-orange/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(254,128,25,0.3)] h-full overflow-hidden"
>
    <!-- Remotion Animation Section (Clickable Area) -->
    <a href={githubUrl} target="_blank" rel="noopener noreferrer" class="mb-6 -mx-6 -mt-6 block overflow-hidden">
        <RemotionProjectPlayerWrapper 
            imageUrl={screenshotUrl} 
            projectName={project.name} 
        />
    </a>

    <!-- Top section -->
    <div class="grow">
        <div class="flex items-start justify-between mb-4">
            <h3 class="text-xl font-semibold text-white group-hover:text-gb-orange transition-colors">
                {project.name}
            </h3>
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 shrink-0 ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="text-yellow-500">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                {formattedStars}
            </div>
        </div>
        
        <p class="text-gray-400 line-clamp-3 mb-6 text-sm leading-relaxed">
            {project.description || 'No description provided for this repository.'}
        </p>

        <!-- Links Container -->
        <div class="flex flex-wrap gap-2 mb-6">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" 
               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
            </a>
            
            {#if homepageUrl}
                <a href={homepageUrl} target="_blank" rel="noopener noreferrer" 
                   class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gb-orange/10 border border-gb-orange/30 text-xs font-bold text-gb-orange hover:bg-gb-orange hover:text-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Homepage
                </a>
            {/if}

            {#if releaseUrl}
                <a href={releaseUrl} target="_blank" rel="noopener noreferrer" 
                   class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gb-green/10 border border-gb-green/30 text-xs font-bold text-gb-green hover:bg-gb-green hover:text-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                        <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                        <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    Release
                </a>
            {/if}
        </div>
    </div>
    
    <!-- Bottom section -->
    <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        {#if project.language}
            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLanguageColor(project.language)} transition-colors duration-300`}>
                {project.language}
            </span>
        {:else}
            <span></span>
        {/if}
        
        <div class="text-gb-orange opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        </div>
    </div>

    <!-- Hover Shine Effect Overlay -->
    <div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20">
        <div class="absolute -inset-full bg-linear-to-r from-transparent via-white/10 to-transparent rotate-45 -translate-x-full group-hover:animate-shine"></div>
    </div>
</div>

<style>
    @keyframes shine {
        from { transform: translateX(-100%) rotate(45deg); }
        to { transform: translateX(100%) rotate(45deg); }
    }
    :global(.group:hover .group-hover\:animate-shine) {
        animation: shine 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
</style>
