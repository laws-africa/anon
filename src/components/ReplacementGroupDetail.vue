<template>
  <div class="card">
    <h6 class="card-header">
      {{ group.title }}
      <span class="ms-2 badge text-bg-secondary">{{group.replacements.length}}</span>
    </h6>
    <ul class="list-group list-group-flush replacement-group-items">
      <template v-for="replacement of group.replacements" :key="replacement.id" class="list-group-item">
        <ReplacementDetail
          :replacement="replacement"
          :active="replacement === modelValue"
          @remove="removed"
          @applied="applied"
          @activated="$emit('update:modelValue', replacement)"
        />
      </template>
    </ul>
  </div>
</template>

<script>
import ReplacementDetail from "@/components/ReplacementDetail.vue";

export default {
  props: ['group', 'modelValue'],
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
