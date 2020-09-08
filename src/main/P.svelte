<script lang="ts">
  export let className = '';
</script>

<p class="text-3-5xl leading-10 font-light {`${className}`}">
  <slot />
</p>
