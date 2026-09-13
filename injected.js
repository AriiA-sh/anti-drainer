(function () {
  if (window.ethereum) {
    const originalRequest = window.ethereum.request;

    window.ethereum.request = async function (args) {
      const { method, params } = args;

      // چک کردن ریکوئست‌های خطرناک امضا یا پرمیشن اپروال نامحدود
      if (method === 'eth_sign' || method === 'personal_sign') {
        const warning = await requestUserConsent('RAW SIGNATURE (Blind Sign Risk)', params);
        if (!warning) throw new Error('SigGuard: User rejected raw signature request.');
      }

      if (method === 'eth_sendTransaction') {
        const tx = params[0] || {};
        // بررسی تتر/ارک باتم اپروال نامحدود (متد approve با hex افراطی مثل fff...)
        if (tx.data && tx.data.startsWith('0x095ea7b3')) {
          const isUnlimited = tx.data.includes('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
          if (isUnlimited) {
            const warning = await requestUserConsent('UNLIMITED TOKEN ALLOWANCE DETECTED!', tx);
            if (!warning) throw new Error('SigGuard: Blocked unlimited allowance transaction.');
          }
        }
      }

      return originalRequest.apply(this, arguments);
    };
  }

  function requestUserConsent(title, data) {
    return new Promise((resolve) => {
      
      const overlay = document.createElement('div5' in window ? 'div' : 'div'); // fallback
      overlay.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 2147483647;
        width: 340px; background: #0d0f12; color: #f0f6fc;
        border: 1px.solid #f85149; border-radius: 8px;
        padding: 16px; font-family: monospace; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      `;
      overlay.innerHTML = `
        <div style="color: #f85149; font-weight: bold; margin-bottom: 8px;">⚠️ SIGGUARD: ${title}</div>
        <div style="font-size: 11px; color: #8b949e; margin-bottom: 12px; word-break: break-all;">
          Target/Data: ${JSON.stringify(data).slice(0, 80)}...
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button id="sigguard-reject" style="background:#21262d;color:#f0f6fc;border:1px solid #30363d;padding:6px 12px;border-radius:4px;cursor:pointer;">Abort</button>
          <button id="sigguard-allow" style="background:#f85149;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;">Proceed</button>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('sigguard-allow').onclick = () => { overlay.remove(); resolve(true); };
      document.getElementById('sigguard-reject').onclick = () => { overlay.remove(); resolve(false); };
    });
  }
})();