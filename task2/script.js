let btn = document.getElementById('btn');
let message = document.getElementById('message');

btn.addEventListener("click", () => {
  let noteBox = document.createElement('div');
  noteBox.className = 'note';

  let textarea = document.createElement('textarea');

  noteBox.appendChild(textarea);

  noteBox.addEventListener('dblclick', () => {
    noteBox.remove();
  });

  message.appendChild(noteBox);
});