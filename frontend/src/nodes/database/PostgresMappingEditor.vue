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
            <v-text-field @change="changeHandler($event, row.name)" v-if="!lastValueKeys" v-model="row.source" :rules="[required(row)]"  outlined dense></v-text-field>
            <v-combobox @change="changeHandler($event, row.name)" outlined dense v-else v-model="row.source" :rules="[required(row)]" :items="lastValueKeys"></v-combobox>
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
      mappings: new Map()
    }
  },
  props: {
    visible: Boolean,
    rows: Array,
    node: Object,
  },
  methods: {
    fetchData() {
      console.log("FetchData");
      let lastValueUrl = `${apiBaseUrl}/last-value/${this.node.id}`;
      this.axios.get(lastValueUrl).then((response) => {
        this.lastValueKeys = Object.keys(response.data);
      })
    },
    required(value) { 
      if (value.nullable === "YES") {
        return true;
      }
      if (!!value.source && value.identityGeneration === "ALWAYS") {
        return "Column is autoincremented."
      } else if (!value.source && value.identityGeneration === "ALWAYS") {
        return true
      } else {
        return !!value.source || "Column is not nullable."
      }
    },
    changeHandler(data, row) {
      console.log(`${data} --> ${row}`)
      this.mappings.set(data, row);
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