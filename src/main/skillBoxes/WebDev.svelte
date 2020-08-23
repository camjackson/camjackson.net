<script lang="ts">
  import SkillBox from '../SkillBox.svelte';
  import Skill from '../Skill.svelte';
</script>

<SkillBox title="Full stack web development" numberOfSkills="{3}">
  <Skill name="Frontend development">
    <p>
      I'm an expert in HTML, CSS, and JavaScript, and I've been using React.js
      for over 5 years. I love working closely with designers to build the best
      user experience possible. My own design skills are rudimentary, but I'm
      working on it!
    </p>
  </Skill>
  <Skill name="Backend development">
    <p>
      While frontend is my passion, I believe strongly in full-stack
      development. I have experience building APIs and CLI tools using Node.js,
      Ruby, Python, Rust, and Java. For some strange reason I really enjoy shell
      scripting too.
    </p>
  </Skill>
  <Skill name="Ops & Infra">
    <p>
      Whenever possible I own my apps in production, including the path to get
      there. I'm experienced in building CI & CD pipelines, deploying to both
      cloud and on-prem infrastructure, writing all config as code.
    </p>
  </Skill>
</SkillBox>
