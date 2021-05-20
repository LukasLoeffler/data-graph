<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" outlined dark v-bind="attrs" v-on="on" v-if="formatting == null">
          Set Formatting
        </v-btn>
        <v-btn color="orange" outlined dark v-bind="attrs" v-on="on" v-else>
          <v-icon>mdi-arrow-right</v-icon>
          {{formatting.name}}
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline lighten-2">
          Create Formatting
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
           <v-text-field v-model="formattingCopy.name" label="Name" outlined hide-details dense class="mt-2"></v-text-field>
            <v-text-field v-model="formattingCopy.source" label="Source Property" outlined hide-details dense class="mt-2"></v-text-field>
          <v-select v-model="formattingCopy.type" label="Formatting method" outlined hide-details dense class="mt-2" :items="formattingMethods"></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="createFormatting">
            Set Formatting
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["formatting"],
  data () {
    return {
      dialog: false,
      formattingCopy: null,
      formattingMethods: [
        {text: "Parse Float", value: "parse_float"},
        {text: "Parse Int", value: "parse_int"},
        {text: "To String", value: "to_string"},
        {text: "Boolean To String", value: "bool_to_string"},
        {text: "Date To String", value: "date_to_string"},
        {text: "Boolean To Number", value: "bool_to_number"},
        {text: "Date To Number", value: "date_to_number"},
        {text: "Unix To Date", value: "unix_to_date"},
        {text: "Remove whitespace", value: "rm_whitespace"},
      ]
    }
  },
  created() {
    this.formattingCopy = {...this.formatting} || {};
  },
  computed: {

  },
  methods: {
    createFormatting() {
      this.$emit("createFormatting", this.formattingCopy)
      this.dialog = false;
    }
  },
}
</script>

<style>

</style>