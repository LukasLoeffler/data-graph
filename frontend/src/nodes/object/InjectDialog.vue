<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" outlined dark v-bind="attrs" v-on="on" v-if="injection == null">
          Set Injection
        </v-btn>
        <v-btn color="orange" outlined dark v-bind="attrs" v-on="on" v-else>
          <v-icon>mdi-arrow-right</v-icon>
          {{injection.name}}
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline lighten-2">
          Create Injection
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field v-model="injectionCopy.name" label="Injection Name" outlined hide-details dense class="mt-2"></v-text-field>
          <v-select v-model="injectionCopy.type" label="Injection Type" outlined hide-details dense class="mt-2" :items="injectionTypes"></v-select>
          <v-text-field v-model="injectionCopy.value" label="Injection Value" outlined hide-details dense class="mt-2"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="createInjection">
            Set Injection
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["injection"],
  data () {
    return {
      dialog: false,
      injectionCopy: null,
      injectionTypes: [
        {text: "Time", value: "time"},
        {text: "Data", value: "data"},
      ]
    }
  },
  created() {
    this.injectionCopy = {...this.injection} || {};
  },
  computed: {

  },
  methods: {
    createInjection() {
      this.$emit("createInjection", this.injectionCopy)
      this.dialog = false;
    }
  },
}
</script>

<style>

</style>