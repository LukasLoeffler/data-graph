<template>
  <v-list-item dense @click="click">
    <v-list-item-icon>
    <v-icon :color="color">{{icon}}</v-icon>
    </v-list-item-icon>
    <v-list-item-action-text>
    <v-list-item-title>{{title}}</v-list-item-title>
    </v-list-item-action-text>
  </v-list-item>
</template>

<script>
export default {
  props: ["color", "icon", "title", "attrs"],
  methods: {
    click(evt) {
      this.$emit("click", evt);
    }
  }
}
</script>