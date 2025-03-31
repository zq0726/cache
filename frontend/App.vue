<template>
  <div>
    <button @click="fetchStrongCache">强缓存示例</button>
    <p>{{ strongCacheData }}</p>

    <button @click="fetchNegotiateCacheByTime">协商缓存-通过时间</button>
    <p>{{ negotiateCacheDataByTime }}</p>

    <button @click="fetchNegotiateCacheByEtag">协商缓存-通过etg</button>
    <p>{{ negotiateCacheDataByEtag }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      strongCacheData: "",
      negotiateCacheDataByTime: "",
      negotiateCacheDataByEtag: "",
    };
  },
  methods: {
    async fetchStrongCache() {
      const response = await axios.get("/api/strong-cache");
      this.strongCacheData = response.data;
    },
    async fetchNegotiateCacheByTime() {
      const response = await axios.get("/api/negotiate-cache-by-time");
      this.negotiateCacheDataByTime = response.data;
    },
    async fetchNegotiateCacheByEtag() {
      const response = await axios.get("/api/negotiate-cache-by-etag");
      this.negotiateCacheDataByEtag = response.data;
    },
  },
};
</script>
