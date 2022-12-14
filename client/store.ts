import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    likes: [], // All liked freets
    flags: [], // All flagged freets
    pin: [], //Holds pinned freet
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */

      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
        state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshLikes(state) {
      /**
       * Update if a user likes or dislikes a freet
       */
      if (state.username !== null) {
        const url = `/api/liked?author=${state.username}`;
        const res = await fetch(url).then(async r => r.json());
        state.likes = res;
      }
    },
    async refreshFlags(state) {
      /**
       * Update if a user likes or dislikes a freet
       */
      if (state.username !== null) {
        const url = `/api/flagged?author=${state.username}`;
        const res = await fetch(url).then(async r => r.json());
        state.flags = res;
      }
    },
    async refreshPin(state) {
      /**
       * Update if a user likes or dislikes a freet
       */
      if (state.username !== null) {
        const url = `/api/pin?author=${state.username}`;
        const res = await fetch(url).then(async r => r.json());
        state.pin = res;
      }
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
