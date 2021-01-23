<template>
        <v-simple-table dense dark style="overflow: hidden;">
            <tbody @click="viewDetails" @contextmenu.prevent="resetInfo">
                <tr>
                    <td>Events</td>
                    <td>{{executionCount}}</td>
                </tr>
                <tr>
                    <td>Bytes</td>
                    <td>{{totalBytes}}</td>
                </tr>
                <tr>
                    <td>Time</td>
                    <td>{{lastTime}}</td>
                </tr>
                <tr>
                    <td>Date</td>
                    <td>{{lastDate}}</td>
                </tr>
            </tbody>
        </v-simple-table>
</template>

<script>
export default {
    props: ["option", "node", "value"],
    data: () => {
        return {
            executionCount: 0,
            totalBytes: 0,
            lastTime: null,
            lastDate: null,
        }
    },
    created() {
        this.$options.sockets.onmessage = (message) => {
            try {
                let data = JSON.parse(message.data);
                if (data.nodeId === this.node.id && data.type === "InfoNode") {
                    this.executionCount = data.executionCount;
                    this.totalBytes = data.executionByte;
                    this.lastTime = data.lastTime;
                    this.lastDate = data.lastDate;
                }
            } catch (error) {
                // console.log("Message")
            }
        }
    },
    methods: {
        viewDetails() {
            console.log("viewDetails");
        },
        resetInfo() {
            let url = `http://localhost:3000/reset-exec-count/${this.node.id}`;
            this.axios.get(url).then(() => {
                console.log("%cSuccessfully reset counter for", "color: green; font-weight: bold", this.node.name)
            });
        }
    }
}
</script>