import { defineStore } from 'pinia';

export const useAuthorsStore = defineStore('authors', {
  state: () => ({
    authors: [],
    selectedAuthorId: null, 
  }),
  actions: {
    //设置作者列表
    setAuthors(authors) {
      this.authors = authors;
    },
    //设置选中的作者ID
    setSelectedAuthorId(authorId) {
      this.selectedAuthorId = authorId;
    },
  },
});