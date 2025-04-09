import { defineStore } from 'pinia';

export const useAuthorsStore = defineStore('authors', {
  state: () => ({
    authors: [],
    selectedAuthorId: null, // 添加 selectedAuthorId 字段
  }),
  actions: {
    setAuthors(authors) {
      this.authors = authors;
    },
    setSelectedAuthorId(authorId) {
      this.selectedAuthorId = authorId; // 添加 setSelectedAuthorId 方法
    },
  },
});