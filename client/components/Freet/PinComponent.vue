<template>
  <div class="pin">
    <button class="button"
            v-if="$store.state.pin.map(pin => pin.content).indexOf(freet._id) < 0"
            @click="pinFreet">
      ⭐️ Pin this Freet!
    </button>
    <button class="button"
            v-else
            @click="unpinFreet">
      🌟 Freet has been pinned!
    </button>
  </div>
</template>

<script>
export default {
  name: "PinComponent",
  props: {
    // freet being pinned
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {}
    };
  },
  methods: {
    pinFreet() {
      /**
       * Enables user to pin a freet
       */
      const params = {
        method: 'POST',
        message: 'Successfully pinned freet!',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    unpinFreet() {
      /**
       * Enables a user to unpin a freet
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully unpinned freet!',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submit a request to the like endpoint
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }
      try {
        const r = await fetch(`/api/pin/${this.freet._id}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('refreshPin');
        this.$store.commit('refreshFreets',  res);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
