<template>
        <v-simple-table dense dark style="overflow: hidden;">
            <tbody @click="viewDetails" @contextmenu.prevent="reset">
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
        reset() {
            console.log("reset");
        },
        viewDetails() {
            console.log("viewDetails");
        },
    }
}
</script>