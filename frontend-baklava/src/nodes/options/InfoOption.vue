<template>
        <v-simple-table dense dark style="overflow: hidden;">
            <tbody @click="viewDetails" @contextmenu.prevent="resetInfo">
                <tr v-if="options.count">
                    <td>Events</td>
                    <td>{{executionCount}}</td>
                </tr>
                <tr v-if="options.bytes">
                    <td>Bytes</td>
                    <td>{{totalBytes}}</td>
                </tr>
                <tr v-if="options.time">
                    <td>Time</td>
                    <td>{{lastTime}}</td>
                </tr>
                <tr v-if="options.date">
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
            let resetUrl = `http://localhost:3000/reset/${this.node.id}`;
            this.axios.get(resetUrl).then(() => {
                console.log("%cSuccessfully resetted ", this.node.name);
            });
        }
    },
    computed: {
        options() {
            let options = {
                count: this.node.options.get("settings").value[0],
                bytes: this.node.options.get("settings").value[3],
                time: this.node.options.get("settings").value[1],
                date: this.node.options.get("settings").value[2],
            }
            return options;
        }
    }
}
</script>