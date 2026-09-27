const { execSync } = require('child_process');

const pressButton = (btn) => {
  try {
    // استفاده از curl نیتیو لینوکس برای دور زدن محدودیت‌های شبکه Node.js در فضای ابری
    execSync(`curl -s -X POST http://127.0.0.1:5000/button/${btn} -H "Content-Type: application/json" -d '{"action":"press-and-release"}'`);
  } catch (err) {
    // بی‌صدا کردن ارور نهایی در لحظه کشته شدن اپلیکیشن
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function epicReject() {
  console.log("\x1b[31m%s\x1b[0m", "\n[!] UNAUTHORIZED AI AGENT TRANSACTION DETECTED");
  await sleep(1500);
  
  console.log("\x1b[33m%s\x1b[0m", "[*] Intercepting signature request...");
  await sleep(1500);
  
  console.log("\x1b[36m%s\x1b[0m", "[*] Navigating Ledger UI (Manual Override Initiated)...");
  
  for (let i = 0; i < 3; i++) {
    pressButton("right");
    console.log(`    > Scroll Right [${i+1}/3]`);
    await sleep(1000);
  }

  console.log("\x1b[31m\x1b[1m%s\x1b[0m", "\n[!!!] CRITICAL OVERRIDE: EXECUTING REJECT [!!!]");
  await sleep(1200);
  
  pressButton("both");
  
  console.log("\x1b[32m\x1b[1m%s\x1b[0m", "\n>> TRANSACTION TERMINATED.");
  console.log("\x1b[35m\x1b[1m%s\x1b[0m", ">> 'HOPE is not a kill switch... but I am.'\n");
}

epicReject();