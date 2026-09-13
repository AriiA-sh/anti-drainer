console.log("🛡️ SigGuard: Core Engine Activated.");

(function () {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes sg-slide-in {
      0% { transform: translateY(-30px) scale(0.95); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    @keyframes sg-pulse-glow {
      0% { box-shadow: 0 0 10px rgba(248, 81, 73, 0.2); }
      50% { box-shadow: 0 0 25px rgba(248, 81, 73, 0.5); }
      100% { box-shadow: 0 0 10px rgba(248, 81, 73, 0.2); }
    }
    .sg-modal-container {
      position: fixed; top: 24px; right: 24px; z-index: 2147483647; width: 380px;
      background: linear-gradient(145deg, #0d1117, #161b22);
      color: #c9d1d9; border: 1px solid #f85149; border-radius: 12px;
      padding: 20px; font-family: 'Courier New', Courier, monospace;
      animation: sg-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards, sg-pulse-glow 2s infinite;
      overflow: hidden;
    }
    .sg-btn {
      padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;
      transition: all 0.2s ease; font-family: inherit; font-size: 13px; outline: none;
    }
    .sg-btn-abort { background: #21262d; color: #f0f6fc; border: 1px solid #30363d; }
    .sg-btn-abort:hover { background: #30363d; border-color: #8b949e; transform: translateY(-2px); }
    .sg-btn-proceed { background: #f85149; color: #ffffff; border: 1px solid #f85149; }
    .sg-btn-proceed:hover { background: #da3633; box-shadow: 0 0 15px rgba(248, 81, 73, 0.4); transform: translateY(-2px); }
  `;
  document.head.appendChild(style);

  function askUser(title, data, reason) {
    return new Promise((resolve) => {
      const div = document.createElement('div');
      div.className = 'sg-modal-container';
      
      div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid #30363d; padding-bottom: 10px;">
          <span style="font-size: 18px;">🛡️</span>
          <div style="color: #ff7b72; font-weight: 900; font-size: 16px; letter-spacing: 1px;">SIGGUARD: ${title}</div>
        </div>
        
        <div style="background: rgba(248, 81, 73, 0.1); border-left: 4px solid #f85149; padding: 12px; font-size: 13px; color: #f0f6fc; margin-bottom: 16px; line-height: 1.5; border-radius: 0 4px 4px 0;">
          <strong style="color: #ff7b72; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Security Alert</strong><br/>
          ${reason}
        </div>

        <div style="font-size: 11px; color: #8b949e; margin-bottom: 20px; background: #010409; padding: 10px; border-radius: 6px; border: 1px solid #30363d; font-family: monospace;">
          <div style="color: #58a6ff; margin-bottom: 4px;">// Payload</div>
          <div style="word-break: break-all; opacity: 0.8;">${JSON.stringify(data).slice(0, 60)}...</div>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: flex-end; position: relative; z-index: 10;">
          <button id="sg-rej" class="sg-btn sg-btn-abort">Abort</button>
          <button id="sg-acc" class="sg-btn sg-btn-proceed">Proceed</button>
        </div>
      `;
      
      const target = document.body || document.documentElement;
      target.appendChild(div);
      
      document.getElementById('sg-acc').onclick = () => {
        div.style.animation = 'none'; div.style.opacity = '0'; div.style.transition = 'opacity 0.2s ease';
        setTimeout(() => { div.remove(); resolve(true); }, 200);
      };
      
      document.getElementById('sg-rej').onclick = () => {
        div.style.animation = 'none'; div.style.transform = 'scale(0.95)'; div.style.opacity = '0'; div.style.transition = 'all 0.2s ease';
        setTimeout(() => { div.remove(); resolve(false); }, 200);
      };
    });
  }

  function hookRequest(provider) {
    if (provider.__sgHooked) return;
    provider.__sgHooked = true;
    const originalRequest = provider.request;
    
    Object.defineProperty(provider, 'request', {
      value: async function (args) {
        if (args.method === 'eth_sign' || args.method === 'personal_sign') {
          const reasonText = "You are about to sign a raw, unreadable message. Hackers use this to hide malicious transactions.";
          const proceed = await askUser('BLIND SIGNATURE', args.params, reasonText);
          if (!proceed) throw { code: 4001, message: "SigGuard: Blocked by user." };
        }
        
        if (args.method === 'eth_sendTransaction') {
          const tx = args.params[0] || {};
          const payload = (tx.data || '').toLowerCase();
          
          const isApprove = payload.startsWith('0x095ea7b3');
          const isUnlimited = payload.includes('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
          
          if (isApprove && isUnlimited) {
            const reasonText = "This contract is asking for UNLIMITED token access. If compromised, they can drain your balance.";
            const proceed = await askUser('UNLIMITED ALLOWANCE', tx.data, reasonText);
            if (!proceed) throw { code: 4001, message: "SigGuard: Blocked allowance." };
          }
        }
        
        return originalRequest.apply(provider, arguments);
      },
      writable: true, configurable: true
    });
  }

  let eth = window.ethereum;
  if (eth) hookRequest(eth);
  else {
    Object.defineProperty(window, 'ethereum', {
      get: () => eth,
      set: (val) => { eth = val; if (eth) hookRequest(eth); },
      configurable: true, enumerable: true
    });
  }
})();