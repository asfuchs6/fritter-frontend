<template>
  <div class="flag">
    <button class="button"
            v-if="$store.state.flags.map(flag => flag.content).indexOf(freet._id) < 0"
            @click="flagFreet">
      ⭕ Flag this Freet!
    </button>
    <button class="button"
            v-else
            @click="unflagFreet">
      🚫 Freet has been flagged!
    </button>
  </div>
</template>

<script>
export default {
  name: "FlagComponent",
  props: {
    // freet being flagged
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
    flagFreet() {
      /**
       * Enables user to flag a freet
       */
      const params = {
        method: 'POST',
        message: 'Successfully flagged freet!',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    unflagFreet() {
      /**
       * Enables a user to unflag freet
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully unflagged freet!',
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
        const r = await fetch(`/api/flagged/${this.freet._id}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('refreshFlags');
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
