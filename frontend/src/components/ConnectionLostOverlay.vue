<template>
    <div class="container-hint">
        <div class="hint">
            Server connection lost
        </div>
    </div>
</template>

<style scoped>
.container-hint {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 5;
    background: rgba(255, 0, 0, 0.4);
    color: white;
    pointer-events: none;
}

.hint {
    position: absolute;
    text-align: left;
    left:50%; top:50%; 
    transform: translate(-50%, -50%);
    z-index: 5;
    padding: 1rem;
    background: rgba(255, 0, 0, 0.4);
    color: white;
    pointer-events: none;
}
</style>