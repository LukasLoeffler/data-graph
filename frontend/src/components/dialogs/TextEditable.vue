<template>
  <div v-if="!editMode">
    {{text}}
    <v-btn color="grey" style="float: right" dark icon x-small @click="editMode = true">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </div>
  <div v-else v-click-outside="clickOutside">
    <v-text-field v-model="textCopy" dense hide-details="" autofocus>
      <template v-slot:append>
        <v-btn icon x-small color="primary" @click="save">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script>
  export default {
    props: ["text"],
    data () {
      return {
        editMode: false,
        textCopy: null
      }
    },
    created() {
      this.textCopy = `${this.text}`
    },
    methods: {
      save() {
        this.$emit("changeText", this.textCopy);
        this.editMode = false;
      },
      clickOutside() {
        this.editMode = false;
      }
    },
  }
</script>