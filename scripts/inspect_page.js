const { spawn } = require('child_process');

async function main() {
    const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
        '--headless',
        '--remote-debugging-port=9223',
        'http://localhost:3000'
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const res = await fetch('http://127.0.0.1:9223/json');
        const tabs = await res.json();
        const pageTab = tabs.find(t => t.url.includes('localhost:3000'));
        if (!pageTab) {
            console.log('No page tab found!', tabs);
            chrome.kill();
            return;
        }

        console.log('Connecting to WS:', pageTab.webSocketDebuggerUrl);
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

        // Listen for console messages
        ws.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.method === 'Runtime.consoleAPICalled') {
                console.log('BROWSER CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
            }
            if (msg.method === 'Runtime.exceptionThrown') {
                console.error('BROWSER EXCEPTION:', JSON.stringify(msg.params.exceptionDetails));
            }
        });

        await send('Runtime.enable');
        await send('Page.enable');

        // Check window.game state
        const evalRes = await send('Runtime.evaluate', {
            expression: `({
                gameExists: typeof window.game !== 'undefined',
                playerPos: window.game ? window.game.playerPos : null,
                nearby: window.game && window.game.nearbyInteractable ? window.game.nearbyInteractable.userData : null,
                isUIOpen: window.game ? window.game.isUIOpen : null,
                dialogueDisplay: document.getElementById('dialogue-box').style.display,
                interactBtnText: document.getElementById('hud-interact-btn').innerText,
                consoleModalDisplay: document.getElementById('console-modal').style.display
            })`,
            returnByValue: true
        });

        console.log('INITIAL STATE:', JSON.stringify(evalRes.result.value, null, 2));

        // Click on hud-interact-btn
        const clickRes = await send('Runtime.evaluate', {
            expression: `
                const btn = document.getElementById('hud-interact-btn');
                btn.click();
                ({
                    afterClickIsUIOpen: window.game.isUIOpen,
                    consoleModalDisplay: document.getElementById('console-modal').style.display,
                    dialogueDisplay: document.getElementById('dialogue-box').style.display
                });
            `,
            returnByValue: true
        });

        console.log('AFTER CLICK HUD-INTERACT-BTN:', JSON.stringify(clickRes.result.value, null, 2));

        // Click on key-w
        const clickWRes = await send('Runtime.evaluate', {
            expression: `
                const keyW = document.getElementById('key-w');
                const p1 = { x: window.game.playerPos.x, z: window.game.playerPos.z };
                // Simulate mousedown and wait 100ms
                keyW.dispatchEvent(new MouseEvent('mousedown'));
                p1;
            `,
            returnByValue: true
        });

        await new Promise(r => setTimeout(r, 200));

        const moveCheck = await send('Runtime.evaluate', {
            expression: `
                const keyW = document.getElementById('key-w');
                keyW.dispatchEvent(new MouseEvent('mouseup'));
                ({
                    playerPosAfterMove: { x: window.game.playerPos.x, z: window.game.playerPos.z }
                });
            `,
            returnByValue: true
        });

        console.log('AFTER MOVE W:', JSON.stringify(moveCheck.result.value, null, 2));

        ws.close();
        chrome.kill();
    } catch (e) {
        console.error('Error:', e);
        chrome.kill();
    }
}

main();
