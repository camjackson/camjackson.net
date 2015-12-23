'use strict';
marked.setOptions({
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

function updatePreview() {
  const title = document.getElementById('title').value;
  const text = document.getElementById('text').value;

  let markdown = '';
  markdown += '#' + title + '\n';
  markdown += '---\n\n';
  markdown += text;

  document.getElementById('preview').innerHTML = marked(markdown);
}
window.onload = function() {
  updatePreview();
  document.getElementById('title').addEventListener('keyup', updatePreview);
  document.getElementById('text').addEventListener('keyup', updatePreview);
};
