// import something here

// leave the export, even if you don't use it
// export default ({ app, router, Vue }) => {
//   // something to do
// }
// import Vue from 'vue';
import TextHighlight from 'vue-text-highlight'
// import Vuelidate from 'vuelidate'

export default ({ Vue }) => {
  Vue.component('text-highlight', TextHighlight)
  // Vue.use(Vuelidate)
}
