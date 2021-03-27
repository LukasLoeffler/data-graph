<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{nodeCopy.name}}</span>
        </v-card-title>
        <v-card-text class="pb-1">
          <v-form v-model="valid">
            <v-row>
              <v-col cols="6">
                <v-text-field label="Name" v-model="nodeCopy.name" :rules="[rules.required]" hide-details></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field 
                  label="Path" required v-model="valueCopy.path"
                  :rules="[rules.required]" hide-details>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select 
                  label="Filetype" required v-model="valueCopy.filetype" :items="fileTypes"
                  :rules="[rules.required]" hide-details>
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field 
                  label="Filename" required v-model="valueCopy.filename"
                  :rules="[rules.required]" hide-details>
                </v-text-field>
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
export default {
  data: () => ({
    dialog: false,
    nodeCopy: null,
    valueCopy: null,
    rules: {
      required: value => !!value || 'Required.',
    },
    valid: false,
    fileTypes: ["json", "csv"]
  }),
  props: ["option", "node", "value"],
  created() {
    this.nodeCopy = {...this.node};
    this.valueCopy = {...this.value};
  },
  methods: {
    save() {
      this.node.setOptionValue("settings", this.valueCopy);
      this.node.name = this.nodeCopy.name;
      this.$store.commit("saveNodeConfig", this.node.id);
      this.dialog = false;
    },
  },

  watch: {
    "$store.getters.optionNode": {
      handler(nodeId) {
        if (nodeId === this.node.id) {
          this.dialog = true;
          this.nodeCopy = {...this.node};
          this.valueCopy = {...this.value};
        }
      }
    }
  }
}
</script>