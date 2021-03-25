<template>
  <v-card>
    <v-card-title>Wiki: {{term}}</v-card-title>
    <v-card-text v-if="term === 'Downstream'" style="text-align: left;">
      # ┌────────────── second (optional)<br>
      # │ ┌──────────── minute<br>
      # │ │ ┌────────── hour<br>
      # │ │ │ ┌──────── day of month<br>
      # │ │ │ │ ┌────── month<br>
      # │ │ │ │ │ ┌──── day of week<br>
      # │ │ │ │ │ │<br>
      # │ │ │ │ │ │<br>
      # * &nbsp;* &nbsp;* &nbsp;* &nbsp;* &nbsp;*<br>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => {
    return {
      term: null
    }
  },
  created() {
    this.term = this.$route.params.term.charAt(0).toUpperCase() + this.$route.params.term.slice(1);
  }
}
</script>