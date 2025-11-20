<template>
  <div class="autocomplete" @keydown.down.prevent="highlight(+1)" @keydown.up.prevent="highlight(-1)" @keydown.enter.prevent="selectHighlighted">
    <label class="form-label">Search for existing user:</label>
    <input
      v-model="searchTerm"
      type="text"
      class="form-control"
      @input="onInput"
      @focus="show = true"
      @blur="onBlur"
      autocomplete="off"
      required
    />

    <ul v-if="show && results.length" class="autocomplete-list">
      <li
        v-for="(cust, idx) in results"
        :key="cust.customerID"
        :class="{ highlighted: idx === highlightedIndex }"
        @mousedown.prevent="select(cust)"
      >
        {{ cust.firstName }} {{ cust.lastName }}
      </li>
    </ul>

    <div v-if="loading" class="loading-spinner">Loading…</div>
  </div>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash.debounce';

export default {
  name: 'AutocompleteCustomer',
  props: {
    // you can emit the full object up to the parent
    value: { type: Object, default: null }
  },
  data() {
    return {
      searchTerm: '',
      results: [],
      loading: false,
      show: false,
      highlightedIndex: -1,
    };
  },
  methods: {
    onInput: debounce(function () {
      if (this.searchTerm.length < 2) {
        this.results = [];
        return;
      }
      this.loading = true;
      axios
        .get('/wp-json/myplugin/v1/customers', {
          params: { search: this.searchTerm }
        })
        .then((res) => {
          this.results = res.data.customers || [];
          this.highlightedIndex = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    }, 300),

    highlight(delta) {
      // move up/down in the list
      const next = this.highlightedIndex + delta;
      if (next >= 0 && next < this.results.length) {
        this.highlightedIndex = next;
      }
    },

    selectHighlighted() {
      if (this.results[this.highlightedIndex]) {
        this.select(this.results[this.highlightedIndex]);
      }
    },

    select(cust) {
      this.$emit('input', cust);
      this.searchTerm = cust.firstName + ' ' + cust.lastName;
      this.show = false;
      this.results = [];
    },

    onBlur() {
      // delay hiding so click can register
      setTimeout(() => (this.show = false), 200);
    },
  },
};
</script>

<style scoped>
.autocomplete {
  position: relative;
}
.autocomplete-list {
  position: absolute;
  z-index: 10;
  width: 100%;
  border: 1px solid #ccc;
  background: #fff;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}
.autocomplete-list li {
  padding: 0.5em;
  cursor: pointer;
}
.autocomplete-list li.highlighted {
  background: #007bff;
  color: white;
}
.loading-spinner {
  position: absolute;
  top: 100%;
  left: 0;
  font-size: 0.9em;
  color: #666;
}
</style>
