<script>
    import ProjectCard from './ProjectCard.svelte';
    import { slide, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    
    export let initialProjects = [];
    
    // State
    let projects = initialProjects;
    let activeLanguage = 'All';
    let searchQuery = '';
    
    // Extract unique languages
    $: languages = ['All', ...new Set(initialProjects
        .map(p => p.language)
        .filter(l => l && l.trim() !== '')
    )].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));
    
    // Filter logic
    $: filteredProjects = projects.filter(p => {
        const matchesLanguage = activeLanguage === 'All' || p.language === activeLanguage;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                             (p.description && p.description.toLowerCase().includes(searchLower)) ||
                             (p.language && p.language.toLowerCase().includes(searchLower));
        return matchesLanguage && matchesSearch;
    });
</script>

<div class="w-full flex flex-col gap-8">
    
    <!-- Controls Section: Global Search & Filter -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/2 border border-white/5 rounded-2xl p-4 backdrop-blur-sm relative z-10">
        <!-- Search input -->
        <div class="relative w-full md:w-72">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input 
                type="text" 
                bind:value={searchQuery}
                placeholder="Search projects..." 
                class="block w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl leading-5 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            >
        </div>
        
        <!-- Language Filter Tags -->
        <div class="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
            {#each languages as lang}
                <button
                    on:click={() => activeLanguage = lang}
                    class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border {activeLanguage === lang 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                        : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-200'}"
                >
                    {lang}
                </button>
            {/each}
        </div>
    </div>
    
    <!-- Projects Grid -->
    {#if filteredProjects.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {#each filteredProjects as project (project.id)}
                <div transition:fade|local="{{ duration: 300 }}">
                    <ProjectCard {project} />
                </div>
            {/each}
        </div>
    {:else}
        <!-- Empty State -->
        <div transition:fade class="w-full py-20 flex flex-col items-center justify-center text-center bg-white/1 border border-white/5 rounded-3xl backdrop-blur-sm">
            <div class="w-16 h-16 mb-4 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-300 mb-2">No projects found</h3>
            <p class="text-gray-500 max-w-sm">We couldn't find any projects matching your search criteria. Try adjusting your filters.</p>
        </div>
    {/if}
</div>
