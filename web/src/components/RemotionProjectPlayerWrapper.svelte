<script>
    import { onMount, onDestroy } from 'svelte';
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { RemotionProjectPlayer } from '../remotion/RemotionProjectPlayer';

    export let imageUrl = '';
    export let projectName = '';

    let container;
    let root;

    $: if (root && (imageUrl || projectName)) {
        root.render(
            React.createElement(RemotionProjectPlayer, { imageUrl, projectName })
        );
    }

    onMount(() => {
        root = createRoot(container);
        root.render(
            React.createElement(RemotionProjectPlayer, { imageUrl, projectName })
        );
    });

    onDestroy(() => {
        if (root) {
            root.unmount();
        }
    });
</script>

<div bind:this={container} class="w-full"></div>
