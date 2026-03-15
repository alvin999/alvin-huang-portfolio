<script>
    export let project;
    
    // Formatting stars
    const formattedStars = new Intl.NumberFormat('en-US').format(project.stars);
    
    // Determine language color
    const getLanguageColor = (lang) => {
        const colors = {
            'JavaScript': 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
            'TypeScript': 'bg-blue-400/20 text-blue-400 border-blue-400/30',
            'Python': 'bg-green-400/20 text-green-400 border-green-400/30',
            'Go': 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30',
            'Rust': 'bg-orange-400/20 text-orange-400 border-orange-400/30',
            'HTML': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
            'CSS': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
            'Java': 'bg-red-500/20 text-red-500 border-red-500/30',
            'C++': 'bg-indigo-400/20 text-indigo-400 border-indigo-400/30',
            'C#': 'bg-purple-500/20 text-purple-500 border-purple-500/30',
            'Shell': 'bg-gray-400/20 text-gray-300 border-gray-400/30',
            'Vim Script': 'bg-green-600/20 text-green-500 border-green-600/30',
            'Vue': 'bg-teal-400/20 text-teal-400 border-teal-400/30'
        };
        return colors[lang] || 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    };
</script>

<a 
    href={project.url} 
    target="_blank" 
    rel="noopener noreferrer"
    class="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/3 hover:bg-white/6 border border-white/10 hover:border-indigo-500/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(99,102,241,0.3)] h-full"
>
    <!-- Top section -->
    <div>
        <div class="flex items-start justify-between mb-4">
            <h3 class="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
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
        
        <div class="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        </div>
    </div>
</a>
