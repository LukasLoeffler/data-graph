<template>
  <div class="text-center">
    <v-menu
      v-model="value"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      eager
      :close-on-click="false"
      :close-on-content-click="false"
      v-click-outside="{
        handler: onClickOutside,
        include: include,
      }"
    >
      <v-card width="700" class="included">
        <v-card-title>
          <span class="headline">Add Node</span>
          <v-spacer></v-spacer>
          <v-text-field outlined label="Search Node Type" dense hide-details></v-text-field>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-row v-if="nodeList">
            <v-col class="pb-0" style="max-height: 300px; overflow: scroll">
              <v-chip-group active-class="primary--text" column v-model="selected" mandatory>
                <v-chip
                  v-for="node in nodeList"
                  :key="node.node"
                >
                  {{ node.node }}
                </v-chip>
              </v-chip-group></v-col>
            <v-col class="pb-0" style="text-align: left; max-height: 300px; overflow: scroll">
              <h2 class="mb-3">{{nodeList[selected].node}}</h2>
              <p v-html="nodeList[selected].description" style="font-size: 16px"></p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="green" @click="addNode">
            Add Node
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { Components } from '@baklavajs/plugin-renderer-vue';
import { getDescription } from "../components/dialogs/nodeDescription";

export default {
  extends: Components.ContextMenu,
  created() {
  },
  data: () => {
    return {
      nodeList: null,
      valueCopy: false,
      selected: 0
    }
  },
  methods: {
    traverseSubmenues(submenu) {
      if (submenu.submenu) {
        submenu.submenu.forEach(submenu => {
          this.traverseSubmenues(submenu);
        });
      } else {
        //console.log(`${submenu.label} -> ${submenu.value}`)
        this.nodeList.push({node: submenu.label, callstr: submenu.value, description: getDescription(submenu.label)});
      }
    },
    include () {
      return [document.querySelector('.included')]
    },
    addNode() {
      this.onChildClick(`addNode:${this.nodeList[this.selected].node}`);
    }
  },
  computed: {
    styles() {
        const s = {};
        if (!this.isNested) {
            s.top = (this.flippedY ? this.y - this.height : this.y) + "px";
            s.left = this.x + "px";
        }
        return s;
    },
  },
  watch: {
    value() {
      this.nodeList = [];
      this.traverseSubmenues(this.items[0]);
    },
    items() {
      this.nodeList = [];
      this.traverseSubmenues(this.items[0]);
    },
  }
}
</script>