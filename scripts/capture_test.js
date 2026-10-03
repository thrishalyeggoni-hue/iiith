const { spawn } = require('child_process');
const fs = require('fs');

async function test() {
    const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
        '--headless',
        '--remote-debugging-port=9225',
        '--window-size=1200,800',
        'http://localhost:3000'
    ]);

    await new Promise(r => setTimeout(r, 2000));
    const res = await fetch('http://127.0.0.1:9225/json');
    const tabs = await res.json();
    const pageTab = tabs.find(t => t.url.includes('localhost:3000'));
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
        const reqId = id++;
        const handler = (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.id === reqId) {
                ws.removeEventListener('message', handler);
                resolve(msg.result);
            }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');

    // Wait 500ms for game to load
    await new Promise(r => setTimeout(r, 800));

    // Capture initial screenshot
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/thrishalyeggoni/.gemini/antigravity-ide/brain/fbac93f7-f06d-4e2b-9cc3-0a79d9cca317/test_shot1.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved shot1');

    // Click interact button
    const clickRes = await send('Runtime.evaluate', {
        expression: `
            const btn = document.getElementById('hud-interact-btn');
            btn.click();
            ({
                consoleDisplay: document.getElementById('console-modal').style.display,
                dialogueDisplay: document.getElementById('dialogue-box').style.display,
                isUIOpen: window.game ? window.game.isUIOpen : null
            })
        `,
        returnByValue: true
    });
    console.log('Click result:', clickRes);

    await new Promise(r => setTimeout(r, 400));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/thrishalyeggoni/.gemini/antigravity-ide/brain/fbac93f7-f06d-4e2b-9cc3-0a79d9cca317/test_shot2.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved shot2');

    ws.close();
    chrome.kill();
}
test();
