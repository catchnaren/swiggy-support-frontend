let editable = false;
let targetElement;

window.onclick = e => {
  if (e.target.isContentEditable) {
    editable = true;
    targetElement = e.target;
  }
};

let inputTexts = '';
window.oninput = e => {
  let keywordText = '';
  if (e.target.isContentEditable) {
    inputTexts += e.data;
    if (e.data === '/') {
      e.target.oninput = i => {
        keywordText += i.data;
        if (e.data === '/' && i.data === ' ') {
          chrome.runtime.sendMessage(null, keywordText);
          e.keywordText = '';
          e.data === '';
        }
      };
    }
  }
};

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.id === 'contextMenu') {
    console.log(msg.snippet);
    targetElement.innerHTML = targetElement.innerHTML.replace(
      msg.keyword,
      msg.snippet
    );
  }

  if (msg.id === 'popup') {
    targetElement.textContent = targetElement.textContent + msg.snippet;
  }

  if (msg.id === 'editor') {
    targetElement.textContent = msg.text;
  }
});
