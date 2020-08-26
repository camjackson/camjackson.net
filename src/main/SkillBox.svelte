<script lang="ts">
  import Panel from './Panel.svelte';

  export let title = '';
</script>

<style>
  div {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 43.75em) {
    /* 700px / 16 */
    div {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      grid-template-rows: auto auto;
    }
  }

  @media (min-width: 62.5em) {
    /* 1000px / 16 */
    h2 {
      align-self: center;
      justify-self: center;
      max-width: 80%;
    }
  }
</style>

<Panel>
  <h2>{title}</h2>
  <div>
    <!-- It's one slot but 2 or 3 children -->
    <slot />
  </div>
</Panel>
