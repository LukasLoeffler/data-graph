<template>
  <div>
    <h1>This is an about page</h1>


    <p>Mode: {{mode}}</p>
    <p>Api: {{apiBaseUrl}}</p>
    <p>Api: {{wsUrl}}</p>
  </div>
</template>


<script>
import { wsUrl } from '../main';
import { apiBaseUrl } from '../main';

export default {
  data: (()=> {
    return {
      mode: process.env.VUE_APP_MODE,
      wsUrl: wsUrl,
      apiBaseUrl: apiBaseUrl
    }
  })
}
</script>
