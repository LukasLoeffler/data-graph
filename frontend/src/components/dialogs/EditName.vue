<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="grey" dark v-bind="attrs" v-on="on" icon x-small>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          Rename Node: {{name}} <v-icon>mdi-arrow-right</v-icon> {{nodeNameCopy}}
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-text-field v-model="nodeNameCopy" outlined class="mt-2" dense hide-details=""></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: ["name"],
    data () {
      return {
        dialog: false,
        nodeNameCopy: null
      }
    },
    created() {
      this.nodeNameCopy = `${this.name}`
    },
    methods: {
      save() {
        this.dialog = false;
        this.$emit("changeName", this.nodeNameCopy);
      }
    },
    watch: {
      dialog(newValue){
        if (newValue) this.nodeNameCopy = `${this.name}`;
      }
    }
  }
</script>