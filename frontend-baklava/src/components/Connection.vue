<template>
    <connection-view :x1="d.x1" :y1="d.y1" :x2="d.x2" :y2="d.y2" :state="state" :connection="connection"></connection-view>
</template>

<script>
import ConnectionView from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/src/components/connection/ConnectionView.vue.d.ts"
export default {
    components: {
        ConnectionView
    },
    data() {
        return {
            d: { x1: 0, y1: 0, x2: 0, y2: 0 },
            state: 0
        }
    },
    props: {
        connection: Object,
    },
    created() {
        console.log(this.connection);
    },
    async mounted() {
        await this.$nextTick();
        this.updateCoords();
    },
    methods: {
        getDomElements(ni){

            const nodeDOM = document.getElementById(ni.parent.id);
            const interfaceDOM = document.getElementById(ni.id);
            const portDOM = interfaceDOM?.getElementsByClassName("__port");

            return {
                node: nodeDOM,
                interface: interfaceDOM,
                port: (portDOM && portDOM.length > 0) ? portDOM[0]: null
            };
        },
        updateCoords() {
            const from = this.getDomElements(this.connection.from);
            const to = this.getDomElements(this.connection.to);
            if (from.node && to.node) {
                if (!this.resizeObserver) {
                    this.resizeObserver = new ResizeObserver(() => { this.updateCoords(); });
                    this.resizeObserver.observe(from.node);
                    this.resizeObserver.observe(to.node);
                }
            }
            const [x1, y1] = this.getPortCoordinates(from);
            const [x2, y2] = this.getPortCoordinates(to);
            this.d = { x1, y1, x2, y2 };
            console.log(this.d);
        },
        getPortCoordinates(resolved) {
        if (resolved.node && resolved.interface && resolved.port) {
            return [
                resolved.node.offsetLeft + resolved.interface.offsetLeft + resolved.port.offsetLeft + resolved.port.clientWidth / 2,
                resolved.node.offsetTop + resolved.interface.offsetTop + resolved.port.offsetTop + resolved.port.clientHeight / 2
            ];
        } else {
            return [0, 0];
        }
    }
    },
    watch: {
        "connection.from.parent.position": {
            handler(){ 
                this.updateCoords();
            },
            deep: true
        },
        "connection.to.parent.position": {
            handler(){ 
                this.updateCoords();
            },
            deep: true
        }
    }
}
</script>>
