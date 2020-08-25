<script lang="ts">
  export let title = '';
</script>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

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
    section {
      display: grid;
      grid-template-columns: 30rem 100fr;
      grid-template-rows: auto;
    }

    h2 {
      align-self: center;
      justify-self: center;
      max-width: 80%;
    }
  }
</style>

<section class="panel">
  <h2>{title}</h2>
  <div>
    <slot />
  </div>
</section>
