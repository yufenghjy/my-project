import { defineStore } from 'pinia';

export const useAuthorsStore = defineStore('authors', {
  state: () => ({
    authors: [],
  }),
  actions: {
    setAuthors(authors) {
      this.authors = authors;
    },
  },
});