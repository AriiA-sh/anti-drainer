# 🛡️ SigGuard | Web3 Anti-Drainer

A lightweight, Zero-Knowledge browser extension that protects Web3 users from malicious blind signing (`eth_sign`) and unlimited token allowances. 
Built entirely offline with a focus on maximum privacy and zero external dependencies.

[🌍 Persian (فارسی) documentation below]

## ⚡ Why SigGuard? (Technical Differentiators)
Unlike other Web3 security tools that rely on remote APIs, server-side simulations, or extensive tracking, SigGuard is built on a **Zero-Knowledge** philosophy:
*   **100% Offline & Local:** No external API calls. Your transaction data never leaves your browser.
*   **Soft Hooking Architecture:** Safely intercepts `window.ethereum.request` using `Object.defineProperty`. It bypasses MetaMask's strict `Object.freeze` defenses without breaking internal provider ports or causing `Receiving end does not exist` connection crashes.
*   **Race-Condition Immune:** Smart injection script that perfectly times the provider initialization, ensuring DApps connect seamlessly while still being monitored.
*   **Cyberpunk-Inspired UI:** Dynamic CSS injection for alerts, escaping the standard boring JavaScript prompts.

## 🚀 How it Works
1.  **Intercept:** SigGuard quietly wraps the injected Web3 provider (MetaMask, etc.).
2.  **Analyze:** It scans raw payloads for highly dangerous methods like `eth_sign`, `personal_sign`, or unlimited ERC20 `approve` transactions (`0x095ea7b3...ffffffff`).
3.  **Halt & Educate:** Before the wallet is even triggered, it halts the execution and displays an educational warning, moving users out of "autopilot" clicking mode.

---

# 🛡️ سیگ‌گارد | محافظ امنیتی وب ۳ (فارسی)

یک افزونه مرورگرِ کاملاً آفلاین و سبک برای محافظت از کاربران در برابر امضاهای کورکورانه (Blind Signing) و تایید دسترسی‌های نامحدود به توکن‌ها. 

## ⚡ تفاوت این ابزار با بقیه چیست؟
برخلاف اکثر ابزارهای امنیتی که داده‌های تراکنش شما را به سرورهای خارجی می‌فرستند تا شبیه‌سازی کنند، سیگ‌گارد با رویکرد **Zero-Knowledge** توسعه یافته است:
*   **کاملاً آفلاین:** هیچ API خارجی در کار نیست. داده‌های شما هرگز از مرورگر خارج نمی‌شود.
*   **معماری Soft Hooking:** به جای جایگزینی کل آبجکت متامسک (که باعث کرش کردن دی‌اپ‌ها می‌شود)، سیگ‌گارد با استفاده از `Object.defineProperty` متد `request` را به صورت ایمن دور می‌زند و سپر دفاعی متامسک را بدون قطع اتصال، هوک می‌کند.

## 🛠️ نصب برای توسعه‌دهندگان
1. این ریپازیتوری را Clone کنید.
2. در مرورگر کروم به آدرس `chrome://extensions/` بروید.
3. گزینه `Developer mode` را روشن کنید.
4. روی `Load unpacked` کلیک کرده و پوشه افزونه را انتخاب کنید.
