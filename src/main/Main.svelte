<script lang="ts">
  import Projects from './skillBoxes/Projects.svelte';
  import WebDev from './skillBoxes/WebDev.svelte';
  import MicroFrontends from './skillBoxes/MicroFrontends.svelte';
  import Practices from './skillBoxes/Practices.svelte';
</script>

<main>
  <section class="column-or-grid panel" id="intro">
    <h2>👋 Hi! 👋</h2>
    <p>
      I'm Cam, a software developer and consultant from Melbourne, Australia. I
      love writing code, building great products with great people, and sharing
      my knowledge through writing, speaking, and consulting. Read on if you'd
      like to know more about my work and my skills. Or get in touch via one of
      the links above.
    </p>
  </section>

  <Projects />

  <WebDev />

  <MicroFrontends />

  <Practices />

</main>
