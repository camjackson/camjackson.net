'use strict';

const React = require('react');
const SkillPanel = require('./skillPanel');

const skills = [
  {
    title: 'Frontend',
    body: 'I create online experiences to engage and delight users. I work best with:',
    tools: 'HTML5, ES6, SASS, React, Flux, Bootstrap'
  },
  {
    title: 'Backend',
    body: 'I build APIs and command-line tools that are simple, secure, and scalable. Skills include:',
    tools: 'Ruby, Node.js, Python, Java, Go, Rust, SQL, MongoDB'
  },
  {
    title: 'Ops',
    body: 'I own my apps in production, and have worked in the enterprise maintaining' +
    ' infrastructure for hundreds of developers. I have experience with:',
    tools: 'Linux, Bash, AWS, Docker, Puppet, Chef, Ansible, Elasticsearch, Logstash, Sensu'
  },
  {
    title: 'Methodologies',
    body: 'I love working with teams that are constantly striving to improve, using practices like:',
    tools: 'Agile, DevOps, Continuous Delivery, Test-Driven Development, Lean Product Development'
  },
  {
    title: 'Consulting',
    body: 'I consider people skills just as important as technical ones. As a consultant I\'ve' +
    ' learned critical skills such as:',
    tools: 'Leadership, Communication, Facilitation, Coaching & Training, Stakeholder Management'
  },
  {
    title: 'Public speaking',
    body: 'I enjoy sharing my experiences, and have spoken for audiences' +
    ' large and small, including:',
    tools: '1stConf, DevOps Melbourne, Melbourne Functional Users Group, Melbourne & Monash Universities'
  }
];

module.exports = () => (
  <div className="container">
    <div className="row"><h1>My skills</h1></div>
    <div id="skill-panel-row" className="row">
      { skills.map((skill) => (<SkillPanel key={skill.title} skill={skill}/>)) }
    </div>
  </div>
);
