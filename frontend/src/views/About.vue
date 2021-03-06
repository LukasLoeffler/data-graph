<template>
  <v-card dark style="width: 300px" class="ma-2">
    <v-card-title>
      Application 
    </v-card-title>
    <v-card-text>
      Mode: {{mode}}
      Backend Api Url: {{apiBaseUrl}}
    </v-card-text>
  </v-card>
</template>


<script>
import { apiBaseUrl } from '../main';

export default {
  data: (()=> {
    return {
      mode: process.env.VUE_APP_MODE,
      apiBaseUrl: apiBaseUrl,
    }
  })
}
</script>
