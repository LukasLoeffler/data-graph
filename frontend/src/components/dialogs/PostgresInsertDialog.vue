<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{node.name}}</span>
        </v-card-title>
        <v-card-text>
          <PostgresConnectionEditor :connection="valueCopy" :node="node"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="abort">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import PostgresConnectionEditor from './PostgresConnectionEditor.vue';
export default {
  components: { PostgresConnectionEditor },
  data: () => ({
    dialog: false,
  }),
  props: ["option", "node", "value"],
  created() {
    this.nodeCopy = {...this.node};
    this.valueCopy = {...this.value};
  },
  methods: {
    save() {
      this.node.setOptionValue("connection", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
    },
    abort() {
      this.node = this.nodeCopy;
      this.value = this.valueCopy;
      this.dialog = false;
    }
  },

  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.dialog = true;
        }
      }
    }
  }
}
</script>