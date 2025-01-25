<template>
  <div class="card">
    <h6 class="card-header">
      {{ group.title }}
      <span class="ms-2 badge text-bg-secondary">{{group.replacements.length}}</span>
    </h6>
    <ul class="list-group list-group-flush replacement-group-items">
      <li v-for="replacement of group.replacements" :key="replacement.id" class="list-group-item">
        <ReplacementDetail :replacement="replacement" @remove="removed" @applied="applied" />
      </li>
    </ul>
  </div>
</template>

<script>
import ReplacementDetail from "@/components/ReplacementDetail.vue";

export default {
  props: ['group'],
  components: { ReplacementDetail },
  emits: ['remove', 'applied'],
  methods: {
    removed (replacement) {
      this.$emit('remove', replacement);
    },
    applied (replacement) {
      this.$emit('applied', replacement);
    }
  }
}
</script>

<style>
.replacement-group-items {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
