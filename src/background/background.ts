import { fetchKeywordData, postKeyword } from '../utils/api';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Swiggy Support: Find Text Snippet',
    id: 'ssce-2',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    title: 'Swiggy Support: Add Text Snippet',
    id: 'ssce-1',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(event => {
  if (event.menuItemId === 'ssce-1') {
    postKeyword(event.selectionText).then(data => {
      console.log(data);
    });
  } else if (event.menuItemId === 'ssce-2') {
    fetchKeywordData(event.selectionText).then(data => {
      console.log(data.keyword.textSnippet);
      const text = data.keyword.textSnippet;
      const msg = {
        id: 'contextMenu',
        keyword: event.selectionText,
        snippet: text,
      };
      chrome.tabs.query(
        {
          currentWindow: true,
        },
        tabs => {
          tabs.forEach(tab => {
            if (tab.active) {
              chrome.tabs.sendMessage(tab.id, msg);
            }
          });
        }
      );
    });
  }
});

chrome.runtime.onMessage.addListener((snippet, sender, sendResponse) => {
  const msg = {
    id: 'popup',
    snippet,
  };
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    tabs => {
      tabs.forEach(tab => {
        if (tab.active) {
          chrome.tabs.sendMessage(tab.id, msg);
        }
      });
    }
  );
});

chrome.runtime.onMessage.addListener((keyText, sender) => {
  fetchKeywordData(keyText).then(data => {
    const msg = {
      id: 'editor',
      key: keyText,
      text: data.keyword.textSnippet,
    };
    chrome.tabs.query(
      {
        currentWindow: true,
      },
      tabs => {
        tabs.forEach(tab => {
          if (tab.active) {
            chrome.tabs.sendMessage(tab.id, msg);
          }
        });
      }
    );
  });
});
