<template>
    <div class="hint">
        Right-click to add a new node<br />
    </div>
</template>

<style>
.hint {
    position: absolute;
    text-align: left;
    left:50%; top:50%; 
    transform: translate(-50%, -50%);
    z-index: 5;
    padding: 1rem;
    background: #0003;
    color: white;
    pointer-events: none;
}
</style>