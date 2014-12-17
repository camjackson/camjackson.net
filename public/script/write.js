function updatePreview(){
  var title = document.getElementById('title').value;
  var text = document.getElementById('text').value;

  var markdown = '';
  markdown += '#' + title + '\n';
  markdown += '---\n\n';
  markdown += text;

  document.getElementById('preview').innerHTML = marked(markdown);
}
