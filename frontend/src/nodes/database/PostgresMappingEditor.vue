<template>
  <v-card-text class="pa-1">
    <v-simple-table>
      <thead>
        <tr>
          <td>Input Source Property</td>
          <td style="width: 20px"></td>
          <td style="text-align: left"><b>Target Column</b> | Primary Key | Datatype | Nullable</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td>
            <v-text-field v-if="!lastValueKeys" v-model="row.source" :rules="[required(row)]"  outlined dense></v-text-field>
            <v-combobox v-else outlined dense v-model="row.source" :rules="[required(row)]" :items="lastValueKeys"></v-combobox>
          </td>
          <td>
            <v-icon class="mb-6">mdi-ray-start-arrow</v-icon>
          </td>
          <td>
            <p class="mb-6" style="text-align: left"><b>{{row.name}}</b> | {{row.identity}} | {{row.dataType}} | {{row.nullable}}</p>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card-text>
</template>

<script>
import {apiBaseUrl} from "../../main.js";

export default {
  name: 'PostgresMappingEditor',
  data: function () {
    return {
      lastValueKeys: null,
    }
  },
  props: {
    visible: Boolean,
    rows: Array,
    node: Object,
  },
  methods: {
    fetchData() {
      let lastValueUrl = `${apiBaseUrl}/last-value/${this.node.id}`;
      this.axios.get(lastValueUrl).then((response) => {
        this.lastValueKeys = Object.keys(response.data);
      })

      // Fill the input source property field per row
      let mappings = this.node.getOptionValue("mapping");
      this.rows.forEach(row => {
        let mapping = mappings.find((mapping) => row.name === mapping.column);
        if (mapping) {
          row.source = mapping.source;
        }
      });
    },
    required(value) { 
      if (value.nullable === "YES") {
        return true;
      }
      if (!!value.source && value.identityGeneration === "ALWAYS") {
        return "Column is autoincremented in mode ALWAYS."
      } else if (!value.source && value.identityGeneration === "ALWAYS") {
        return true
      } else {
        return !!value.source || "Column is not nullable."
      }
    },
    getMapping() {
      return this.rows
        .filter((row) => row.source && row.name)
        .map((row) => {
            return {
              source: row.source,
              column: row.name
            }
        });
    }
  },
  watch: {
    visible(newValue) {
      if(newValue) {
        this.fetchData();
      }
    },
  },
}
</script>


<style scoped>
</style>