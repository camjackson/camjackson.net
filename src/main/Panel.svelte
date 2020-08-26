<script lang="ts">
  export let alwaysColumn: boolean = false;
</script>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0 2rem 5rem;
    padding: 2.5rem 2rem;
    background-color: hsl(210, 5%, 16%);
  }

  @media (min-width: 62.5em) {
    /* 1000px / 16 */
    section:not(.alwaysColumn) {
      display: grid;
      grid-template-columns: 30rem 100fr;
      grid-template-rows: auto;
    }
  }
</style>

<section class:alwaysColumn>
  <slot />
</section>
