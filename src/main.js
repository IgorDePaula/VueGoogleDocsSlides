import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import VueGAPI from "vue-gapi";

// create the 'options' object
const apiConfig = {
  apiKey: "AIzaSyCTrU266mWLQjD9D4NyGUQl9CY3Tm-idgA",
  clientId: "284342642848-v9v15bmo0dvmqoh9ejp2krp19kc5dh2v.apps.googleusercontent.com",
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scope: "https://www.googleapis.com/auth/presentations"
  // see all available scopes here: https://developers.google.com/identity/protocols/googlescopes'
};

// Use the plugin and pass along the configuration
Vue.use(VueGAPI, apiConfig);
new Vue({
  render: h => h(App),
}).$mount('#app')
