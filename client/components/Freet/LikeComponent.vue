<template>
  <div class="like">
    <button class="button"
            v-if="$store.state.likes.map(like => like.content).indexOf(freet._id) < 0"
            @click="likeFreet">
      🖤 Like this Freet!
    </button>
    <button class="button"
            v-else
            @click="unlikeFreet">
      💙 Freet has been liked!
    </button>
  </div>
</template>

<script>
export default {
  name: "LikeComponent",
  props: {
    // freet being liked
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
    likeFreet() {
      /**
       * Enables user to like a freet
       */
      const params = {
        method: 'POST',
        message: 'Successfully liked freet!',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    unlikeFreet() {
      /**
       * Enables a user to unlike a freet
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully unliked freet!',
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
        const r = await fetch(`/api/liked/${this.freet._id}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('refreshLikes');
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
