<template>
  <v-card-text class="pa-1">
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Name" v-model="node.name" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field label="Host" v-model="connection.host" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field type="number" label="Port" v-model="connection.port" :rules="[rules.required, rules.positive]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field label="User" v-model="connection.user" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field type="password" label="Password" v-model="connection.password" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field label="Database" v-model="connection.database" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field label="Table" v-model="connection.table" :rules="[rules.required]"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script>
export default {
  name: 'PostgresConnectionEditor',
  data: function () {
    return {
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
        positive: value => value > 0 || 'Positive number required.'
      },
    }
  },
  props: {
    connection: Object,
    node: Object
  },
  methods: {
    isPositive(number) {
      if (number && number > 0) {
        return true;
      }
      return false;
    }
  },
  watch: {
    valid(newValidity) {
      this.$emit('validityChange', newValidity);
    },
  }
}
</script>