<script lang="ts">
  export let className = '';
</script>

<h2 class="text-center text-5xl {`${className}`}">
  <slot />
</h2>
