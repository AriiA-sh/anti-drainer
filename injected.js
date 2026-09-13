console.log("🕵️‍♂️ SigGuard: Soft Hooking Activated!");

(function () {
  // 1. Cyberpunk UI & Educational Warning Box
  function askUser(title, data, reason) {
    return new Promise((resolve) => {
      const div = document.createElement('div');
      div.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 2147483647; width: 350px; background: #0d0f12; color: #f0f6fc; border: 1px solid #f85149; border-radius: 8px; padding: 16px; font-family: monospace; box-shadow: 0 10px 30px rgba(0,0,0,0.8);';
      
      div.innerHTML = `
        <div style="color: #f85149; font-weight: bold; margin-bottom: 8px; font-size: 14px;">⚠️ SIGGUARD: ${title}</div>
        
        <div style="background: #21262d; border-left: 3px solid #ff7b72; padding: 10px; font-size: 12px; color: #c9d1d9; margin-bottom: 12px; line-height: 1.4;">
          <strong style="color: #ff7b72;">Why is this blocked?</strong><br/>
          ${reason}
        </div>

        <div style="font-size: 11px; color: #8b949e; margin-bottom: 16px; word-break: break-all; background: #010409; padding: 6px; border-radius: 4px;">
          Raw Data: ${JSON.stringify(data).slice(0, 50)}...
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button id="sg-rej" style="background:#21262d; color:#f0f6fc; border:1px solid #30363d; padding:6px 14px; border-radius:4px; cursor:pointer; font-weight: bold;">Abort</button>
          <button id="sg-acc" style="background:#f85149; color:#fff; border:none; padding:6px 14px; border-radius:4px; cursor:pointer; font-weight: bold;">Proceed</button>
        </div>
      `;
      document.body.appendChild(div);
      
      document.getElementById('sg-acc').onclick = () => { div.remove(); resolve(true); };
      document.getElementById('sg-rej').onclick = () => { div.remove(); resolve(false); };
    });
  }

  // 2. Soft Hooking Mechanism
  function hookRequest(provider) {
    if (provider.__sgHooked) return;
    provider.__sgHooked = true;

    const originalRequest = provider.request;
    
    Object.defineProperty(provider, 'request', {
      value: async function (args) {
        
        // Scenario A: Blind Signing
        if (args.method === 'eth_sign' || args.method === 'personal_sign') {
          const reasonText = "You are about to sign a raw, unreadable message. Hackers use this to hide malicious transactions (like draining your wallet). Only proceed if you 100% trust this site.";
          const proceed = await askUser('BLIND SIGNATURE RISK', args.params, reasonText);
          if (!proceed) throw { code: 4001, message: "SigGuard: Blocked by user." };
        }
        
        // Scenario B: Unlimited Token Allowance
        if (args.method === 'eth_sendTransaction') {
          const tx = args.params[0] || {};
          if (tx.data && tx.data.startsWith('0x095ea7b3')) {
            const isUnlimited = tx.data.includes('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
            if (isUnlimited) {
              const reasonText = "This contract is asking for UNLIMITED access to your tokens. If this contract gets hacked, they can drain all your tokens without asking again. Never approve unlimited amounts.";
              const proceed = await askUser('UNLIMITED ALLOWANCE DETECTED', tx.data, reasonText);
              if (!proceed) throw { code: 4001, message: "SigGuard: Blocked unlimited allowance." };
            }
          }
        }
        
        // Pass safe requests to MetaMask
        return originalRequest.apply(provider, arguments);
      },
      writable: true,
      configurable: true
    });
  }

  // 3. Inject Provider
  let eth = window.ethereum;
  if (eth) {
    hookRequest(eth);
  } else {
    Object.defineProperty(window, 'ethereum', {
      get: () => eth,
      set: (val) => {
        eth = val;
        if (eth) hookRequest(eth);
      },
      configurable: true,
      enumerable: true
    });
  }
})();