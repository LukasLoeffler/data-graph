<template>
  <div>
    <v-btn color="blue" class="mr-1" outlined @click.stop="dialog = true">
      <v-icon>mdi-information-outline</v-icon>
    </v-btn>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          Node Info: {{type}}
        </v-card-title>

        <v-card-text>
          {{description}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import {getDescription} from "./nodeDescription.js";

export default {
  data () {
    return {
      dialog: false,
      description: ""
    }
  },
  props: {
    type: String
  },
  created() {
    this.description = getDescription(this.type);
  }
}
</script>