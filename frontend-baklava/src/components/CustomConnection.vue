<template>
    <svg>
        <path :d="d" :class="classes"  />
    </svg>
</template>

<script>
export default {
    props: {
        connection: Object
    },
    data: function() {
        return {
            d: "",
            count: 0,
            connectionActive: false
        }
    },
    inject: ["plugin"],
    async mounted() {
        await this.$nextTick();
        this.updateCoords();
        
    },
    watch: {
        "connection.from.parent.position": {
            handler: function() {
                this.updateCoords();
            },
            deep: true
        },
        "connection.to.parent.position": {
            handler: function() {
                this.updateCoords();
            },
            deep: true
        },
        "plugin.scaling": {
            handler: function() {
                this.updateCoords();
            },
            deep: true
        },
        "plugin.panning": {
            handler: function() {
                this.updateCoords();
            },
            deep: true
        }
    },
    methods: {
        transform(x, y) {
            const tx = (x + this.plugin.panning.x) * this.plugin.scaling;
            const ty = (y + this.plugin.panning.y) * this.plugin.scaling;
            return [tx, ty];
        },
        updateCoords() {
            const from = this.resolveDom(this.connection.from);
            const to = this.resolveDom(this.connection.to);

            const [x1, y1] = this.getPortCoordinates(from);
            const [x2, y2] = this.getPortCoordinates(to);

            const [tx1, ty1] = this.transform(x1, y1);
            const [tx2, ty2] = this.transform(x2, y2);

            const dx = 0.3 * Math.abs(tx1 - tx2);
            this.d = `M ${tx1} ${ty1} C ${tx1 + dx} ${ty1}, ${tx2 - dx} ${ty2}, ${tx2} ${ty2}`;
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
        },
        resolveDom(ni) {
            const nodeDOM = document.getElementById(ni.parent.id);
            const interfaceDOM = document.getElementById(ni.id);
            const portDOM = interfaceDOM?.getElementsByClassName("__port");

            return {
                node: nodeDOM,
                interface: interfaceDOM,
                port: (portDOM && portDOM.length > 0) ? portDOM[0]: null
            };
        }
    },
    computed: {
        state() {
            return this.connection.isInDanger ?
                "" :
                "";
        },
        classes() {
            return {
                "connection": true,
                "active": this.connectionActive
            };
        }
    },
    created() {
        window.addEventListener("resize", () => {
            this.updateCoords();
        });

        let timeOut = null;
        this.$options.sockets.onmessage = (message) => {
            try {
                let data = JSON.parse(message.data);
                if (data.type === "ConnectionExecution") {
                    // Check if connection is right one by gettomg from and to nodes and compare nodeIds
                    if (data.data.from === this.connection.from.parent.id && data.data.to === this.connection.to.parent.id) {
                        this.connectionActive = true; // Activate animation

                        clearTimeout( timeOut ); // Reset timeout if called
                        timeOut = setTimeout(() => {
                            this.connectionActive = false; // Deactivate animation if method is not called within interval.
                        }, 750)
                    }
                }
            } catch (error) {
                // console.log("Message")
            }
        }
    }
}
</script>


<style scoped>
.active {
    stroke-dasharray: 20;
    animation: dash 5s linear infinite;
}


@keyframes dash {
    to {
        stroke-dashoffset: -1000;
    }
}
</style>