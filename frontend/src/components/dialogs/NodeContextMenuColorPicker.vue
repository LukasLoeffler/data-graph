<template>
  <div class="text-center">
    <v-menu offset-x :close-on-content-click="false" v-model="menu">
      <template v-slot:activator="{ on, attrs }">
        <NodeContextMenuListItem title="Change Color" :color="color" icon="mdi-palette-outline" v-bind="attrs" @click="on.click"/>
      </template>
      <v-card width="300px">
        <v-color-picker v-model="colorCopy" hide-mode-switch hide-inputs></v-color-picker>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="menu = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="save">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  import NodeContextMenuListItem from "./NodeContextMenuListItem"

  export default {
    props: ["color"],
    components: {
      NodeContextMenuListItem
    },
    data: () => ({
      menu: false,
      colorCopy: null
    }),
    created() {
      this.colorCopy = `${this.color}`;
    },
    methods: {
      save() {
        this.$emit("colorChange", this.colorCopy);
        this.menu = false;
      }
    }
  }
</script>