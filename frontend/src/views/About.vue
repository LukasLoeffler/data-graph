<template>
  <v-card dark style="width: 300px" class="ma-2">
    <v-card-title>
      Application 
    </v-card-title>
    <v-card-text>
      Mode: {{mode}}
      Backend Api Url: {{apiBaseUrl}}
      Websocket Api Url: {{wsUrl}}
    </v-card-text>
  </v-card>
</template>


<script>
import { wsUrl } from '../main';
import { apiBaseUrl } from '../main';

export default {
  data: (()=> {
    return {
      mode: process.env.VUE_APP_MODE,
      wsUrl: wsUrl,
      apiBaseUrl: apiBaseUrl,
    }
  })
}
</script>
