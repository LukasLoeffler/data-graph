<template>
  <v-tooltip left v-if="status" color="green darken-2">
    <template v-slot:activator="{ on, attrs }">
      <v-icon color="green lighten-3" v-bind="attrs" v-on="on">mdi-connection</v-icon>
    </template>
    <span>Connected with server</span>
  </v-tooltip>
  <v-tooltip left v-else color="red">
    <template v-slot:activator="{ on, attrs }" color="primary">
      <v-icon  color="orange" v-bind="attrs" v-on="on">mdi-connection</v-icon>
    </template>
    <span>No server connection</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ["status"]
}
</script>

