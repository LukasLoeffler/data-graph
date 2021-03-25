<template>
  <v-tooltip left :color="status ? 'green' : 'red'">
    <template v-slot:activator="{ on, attrs }" color="primary">
      <v-icon :color="status ? 'green' : 'red'" v-bind="attrs" v-on="on">mdi-connection</v-icon>
    </template>
    <span>{{status ? 'Connected with server' : 'No server connection'}}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ["status"]
}
</script>

