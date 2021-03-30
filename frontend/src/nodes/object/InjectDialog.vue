<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" outlined dark v-bind="attrs" v-on="on" v-if="injection == null">
          Set Injection
        </v-btn>
        <v-btn color="orange" outlined dark v-bind="attrs" v-on="on" v-else>
          <v-icon>mdi-arrow-bottom-right-bold-outline</v-icon>
          {{injection.name}}
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline lighten-2">
          Create Injection
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field v-model="injectionCopy.name" label="Injection Name"></v-text-field>
          <v-text-field v-model="injectionCopy.type" label="Injection Type"></v-text-field>
          <v-text-field v-model="injectionCopy.value" label="Injection Value"></v-text-field>
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
      injectionCopy: null
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