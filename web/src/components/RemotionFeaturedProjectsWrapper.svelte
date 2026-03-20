<script>
    import { onMount, onDestroy } from 'svelte';
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { RemotionFeaturedProjectsPlayer } from '../remotion/RemotionFeaturedProjectsPlayer';

    export let title = 'Featured Projects';
    export let subtitle = 'A collection of technical experiments and tools.';

    let container;
    let root;

    onMount(() => {
        root = createRoot(container);
        
        root.render(
            React.createElement(RemotionFeaturedProjectsPlayer, { title, subtitle })
        );
    });

    onDestroy(() => {
        if (root) {
            root.unmount();
        }
    });
</script>

<div bind:this={container} class="w-full"></div>
