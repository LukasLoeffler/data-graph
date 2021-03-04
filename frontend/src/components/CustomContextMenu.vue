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
      <v-card :width="width" class="included" transition="scale-transition" origin="center center">
        <v-card-title>
          <span class="headline">Add Node</span>
          <v-spacer></v-spacer>
          <v-text-field outlined label="Search Node Type" dense hide-details v-model="search" clearable></v-text-field>
          <v-btn class="ml-2" dark @click="maxed = !maxed">
            <v-icon v-if="maxed">mdi-window-maximize</v-icon>
            <v-icon v-else>mdi-window-minimize</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-row v-if="nodeListFiltered && nodeListFiltered.length !== 0">
            <v-col :cols="cols" class="pb-0" style="max-height: 300px; overflow: scroll">
              <v-chip-group active-class="primary--text" column v-model="selected" mandatory>
                <v-chip
                  v-for="(node, index) in nodeListFiltered"
                  :key="index"
                >
                  {{ node.type }}
                </v-chip>
              </v-chip-group></v-col>
            <v-col class="pb-0" style="text-align: left; max-height: 300px; overflow: scroll">
              <h2 class="mb-3">{{nodeListFiltered[selected].type}}</h2>
              <p v-html="nodeListFiltered[selected].description" style="font-size: 16px"></p>
              <v-spacer></v-spacer>
              <v-chip
                label small :key="tag" v-for="tag in nodeListFiltered[selected].tags" class="mr-1 mb-1"
                style="cursor: default" @click="search = tag" :class="{tagselected: tag === search}"
              >      
                <v-icon left>
                  mdi-tag-text-outline
                </v-icon>
                {{ tag }}
              </v-chip>
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
import { getDescription, getTags } from "../components/dialogs/nodeDescription";

export default {
  extends: Components.ContextMenu,
  created() {
  },
  data: () => {
    return {
      nodeList: null,
      valueCopy: false,
      selected: 0,
      search: "",
      maxed: false,
      addList: []
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
        this.nodeList.push({
          type: submenu.label, 
          callstr: submenu.value, 
          description: getDescription(submenu.label),
          tags: getTags(submenu.label)
        });
      }
    },
    include () {
      return [document.querySelector('.included')]
    },
    addNode() {
      this.onChildClick(`addNode:${this.nodeListFiltered[this.selected].type}`);
    },
  },
  watch: {
    value() {
      this.nodeList = [];
      this.addList = [];
      this.traverseSubmenues(this.items[0]);
    },
    items() {
      this.nodeList = [];
      this.traverseSubmenues(this.items[0]);
    },
    search(newValue) {
      this.selected = 0;
      if (newValue === null) this.search = "";
    }
  },
  computed: {
    nodeListFiltered() {
      if (this.nodeList) return this.nodeList.filter(node => node.type.includes(this.search) || node.tags.some(tag  => tag.includes(this.search) ));
      else return null;
    },
    width() {
      return (this.maxed ? 600 : 1200)
    },
    cols() {
      return (this.maxed ? 6 : 4)
    },
  }
}
</script>


<style>
.tagselected {
  background-color: lightpink !important;
}
</style>