<script>
    import { onMount } from 'svelte';
    import { getProjectScreenshot } from '../lib/github';
    import RemotionProjectPlayerWrapper from './RemotionProjectPlayerWrapper.svelte';

    let { project } = $props();
    
    // Formatting stars with Svelte 5 reactivity
    let formattedStars = $derived(new Intl.NumberFormat('en-US').format(project.stars));

    // Dynamic screenshot URL state
    let screenshotUrl = $state('');

    onMount(async () => {
        screenshotUrl = await getProjectScreenshot(project.name, project.screenshot);
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
</script>

<a 
    href={project.url} 
    target="_blank" 
    rel="noopener noreferrer"
    class="group relative flex flex-col justify-between p-6 rounded-2xl bg-gb-bg-soft/30 hover:bg-gb-bg-soft/50 border border-white/10 hover:border-gb-orange/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(254,128,25,0.3)] h-full overflow-hidden"
>
    <!-- Remotion Animation Section -->
    <div class="mb-6 -mx-6 -mt-6">
        <RemotionProjectPlayerWrapper 
            imageUrl={screenshotUrl} 
            projectName={project.name} 
        />
    </div>

    <!-- Top section -->
    <div>
        <div class="flex items-start justify-between mb-4">
            <h3 class="text-xl font-semibold text-white group-hover:text-gb-orange transition-colors">
                {project.name}
            </h3>
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="text-yellow-500">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                {formattedStars}
            </div>
        </div>
        
        <p class="text-gray-400 line-clamp-3 mb-6 text-sm leading-relaxed">
            {project.description || 'No description provided for this repository.'}
        </p>
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
</a>

<style>
    @keyframes shine {
        from { transform: translateX(-100%) rotate(45deg); }
        to { transform: translateX(100%) rotate(45deg); }
    }
    :global(.group:hover .group-hover\:animate-shine) {
        animation: shine 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
</style>
