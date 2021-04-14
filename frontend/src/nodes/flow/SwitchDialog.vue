<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
          <v-spacer></v-spacer>
          <v-btn outlined color="green" @click="addExpression">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pb-1">
          <v-form v-model="valid">
            <v-row v-for="(expression, index) in valueCopy.expressions" :key="index">
              <v-col cols="3">
                <v-text-field v-model="expression.property" label="Property" outlined dense hide-details></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-combobox v-model="expression.statement" label="Statement" :items="statements" outlined dense hide-details></v-combobox>
              </v-col>
              <v-col cols="2">
                <v-text-field v-model="expression.value" label="Value" outlined dense hide-details></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="expression.port" label="Output Port" outlined dense hide-details></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn icon color="red" @click="removeExpression(index)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-textarea
          outlined label="Notes" class="px-5 py-2" rows="3" hide-details v-model="valueCopy.notes"
        ></v-textarea>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" :disabled="!valid" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import EventBus from '@/event-bus';

export default {
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    rules: {
      required: value => !!value || 'Required.',
    },
    valid: false,
    statements: ["==", ">=", "<=", ">", "<"]
  }),
  props: ["option", "node", "value"],
  created() {
    this.init();
    EventBus.$on("OPEN_SETTINGS", (nodeId) => {
      if (nodeId === this.node.id) {
        this.dialog = true;
        this.init();
      }
    });
  },
  methods: {
    save() {
      // Create port if not existing
      console.log("save");
      this.valueCopy.expressions.forEach((expression) => {
        try {
          this.node.getInterface(expression.port)
        } catch (error) {
          this.node.addOutputInterface(expression.port);
        }
      });

      for (const [key, value] of Object.entries(this.node.outputInterfaces)) {
        if (!this.valueCopy.expressions.some(expr => expr.port === key)) {
          this.node.removeInterface(key);
        }
      }

      console.log("save");
      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
    addExpression() {
      this.valueCopy.expressions.push({
        statement: "",
        port: ""
      })
    },
    removeExpression(index) {
      this.valueCopy.expressions.splice(index, 1);
    },
    init() {
      this.nodeCopy = {...this.node};
      this.valueCopy = JSON.parse(JSON.stringify(this.node.getOptionValue("settings")));
    }
  }
}
</script>