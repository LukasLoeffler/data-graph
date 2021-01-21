<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="150" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" @mousedown.self.prevent.stop="" block dark>
          {{nodeData.name}}
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar :color="color" size="56">
              <v-icon>{{typeIcon}}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="text-left align-self-start">
              <v-list-item-title >Name: {{nodeData.name}}</v-list-item-title>
              <v-list-item-subtitle>Type: {{nodeData.type}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon color="green" @click="deleteNode">mdi-play-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-col class="d-flex justify-center">
            <v-color-picker v-model="color" hide-mode-switch hide-inputs></v-color-picker>
        </v-col>
        <v-divider></v-divider>


        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data: () => ({
        fav: true,
        menu: false,
        message: false,
        hints: true,
        color: "white",
        icons: [
          {type: "logging", icon: "mdi-math-log"},
          {type: "info", icon: "mdi-information-outline"}
        ]
    }),
    props: {
      nodeData: Object
    },
    inject: ['editor'],
    created() {
        if (this.nodeData.options.has("color")) {
            this.color = this.nodeData.getOptionValue("color");
        }
    },
    methods: {
      save() {
        this.$emit("colorChange", this.color);
      },
      deleteNode() {
        this.$store.commit("deleteNode", this.nodeData);
      }
    },
    watch: {

    },
    computed: {
      typeIcon() {
        let icon = this.icons.find((icon) => icon.type === this.nodeData.type);
        if (!icon) {
          return "mdi-help-circle-outline"
        }
        return icon.icon;
      }
    }
  }
</script>