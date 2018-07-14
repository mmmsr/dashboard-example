<template>
  <ul>

    <q-card
      v-for="inquiry in inquiries"
      :key="inquiry.id"
      >
      <q-card-title>
        {{ inquiry.name }}

        <div slot="right" class="row items-center">
          <!-- <q-icon name="place" /> 250 ft -->
          {{ displayDatetime(inquiry.created_at.$date) }}
        </div>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        {{ inquiry.inquiry }}
      </q-card-main>
    </q-card>

    <!-- <li v-for="inquiry in inquiries">
      {{ inquiry.inquiry }}
      <br> -->
      <!-- <button
        :disabled="!product.inventory"
        @click="addProductToCart(product)">
        Add to cart
      </button> -->
    <!-- </li> -->
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  makeDateDisplayStr,
  makeTimeDisplayStr
} from '../../utils/calendar-util'

export default {
  computed: mapGetters({
    inquiries: 'allInquiries'
  }),
  methods: {
    displayDatetime: function (datetime) {
      return makeDateDisplayStr(datetime) + makeTimeDisplayStr(datetime)
    }
  },
  created () {
    let self = this
    this.$store.dispatch('getAllInquiries', {
      accessToken: this.$store.getters.accessToken,
      router: self.$router
    })
  }
}
</script>
