<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="800">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" outlined dark v-bind="attrs" v-on="on" v-if="!functionCopy.name">
          Create Function
        </v-btn>
        <v-btn color="orange" outlined dark v-bind="attrs" v-on="on" v-else>
          <v-icon>mdi-function</v-icon>
          {{functionCopy.name}}
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline lighten-2">
          Create Function
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-2">
          <v-text-field outlined dense v-model="functionCopy.name" label="Function Name" hide-details></v-text-field>
          <v-card class="px-1 mt-1" dark>
            <prism-editor v-model="functionCopy.function" :highlight="highlighter" :tabSize="4" line-numbers style="max-height: 500px" class="mt-2"></prism-editor>
          </v-card>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="createFunction">
            Set Function
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

export default {
  props: ["function"],
  data () {
    return {
      dialog: false,
      functionCopy: null
    }
  },
  components: {
    PrismEditor
  },
  created() {
    this.functionCopy = {...this.function};
  },
  computed: {

  },
  methods: {
    createFunction() {
      this.$emit("createFunction", this.functionCopy)
      this.dialog = false;
    },
    highlighter(code) {
      return highlight(code, languages.javascript); // languages.<insert language> to return html with markup
    },
  },
}
</script>

<style>

</style>