// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.from === 'popup.js') {
//         // 可以在 sendMessage 的 callback 中取得，此 sendResponse 的內容
//         // 需要注意若在多個地方呼叫同時呼叫 sendResponse，將只會收到一個
//         sendResponse({
//             from: 'background.js',
//         });
//     }
// });