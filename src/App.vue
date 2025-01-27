<template>
  <header class="bg-primary text-white p-3">
    <h3>Vantage Goldfields SA (Pty) Ltd v Siyakhula Sonke Empowerment Corporation (Pty) Ltd and Another (853/2023) [2025] ZASCA 1 (9 January 2025)</h3>
  </header>
  <div class="main-pane">
    <div class="content-pane">
      <ContentPane />
    </div>
    <div class="sidebar-pane border-start">
      <ReplacementPane :replacements="replacements" />
    </div>
  </div>
</template>

<script>
import ReplacementPane from "@/components/ReplacementPane.vue";
import ContentPane from "@/components/ContentPane.vue";

export default {
  components: {ReplacementPane, ContentPane},
  data () {
    return {
      replacements: [],
    };
  },
}
</script>

<style>
body, html {
  height: 100%;
}
#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.main-pane {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
.content-pane {
  flex: 2;
  overflow-y: auto;
  padding: 0.5em;
}
.sidebar-pane {
  flex: 1;
  overflow-y: auto;
  padding: 0.5em;
}
</style>
