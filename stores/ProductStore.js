import { defineStore, acceptHMRUpdate } from "pinia";

export const useProductStore = defineStore("ProductStore", {
  state: () => {
    // const route = useRoute();
    return {
      /**
       * The listing of all the products
       */
      products: [],

      /**
       * Different ways of fetching the listing of products (filters, order, search)
       */
      filters: {
        "fields.heatLevel": "",
        order: "",
        query: "",
      },

      /**
       * A single project to show all the details of
       */
      singleProduct: null,
    };
  },
  getters: {
    activeFilters() {
      const clone = JSON.parse(JSON.stringify(this.filters));
      // remove blank object properties
      return Object.fromEntries(
        Object.entries(clone).filter(([_, v]) => v != null)
      );
    },
  },
  actions: {
    async fetchProducts() {
      const nuxt = useNuxtApp();
      const { items: products } = await nuxt.$contentful.getEntries("product");
      this.products = products;
      return this.products;
    },
    async fetchProduct(id) {
      const { $contentful } = useNuxtApp();
      this.singleProduct = await $contentful.getEntry(id);
      return this.singleProduct;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
