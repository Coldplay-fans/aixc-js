let running = true;

// 主循环
const autoClick = () => {
    if (!running) return;

    // 实时查找所有可能的 Place Long / Place Short 按钮
    const candidates = Array.from(document.querySelectorAll('div')).filter(div => {
        const text = div.innerText.trim();
        const cursor = getComputedStyle(div).cursor;
        return (text.startsWith('Place Long') || text.startsWith('Place Short')) &&
               cursor === 'pointer' &&
               div.offsetParent !== null;
    });

    if (candidates.length === 0) {
        console.log(`[${new Date().toLocaleTimeString()}] ⚠️ 暂时未找到任何按钮，10秒后重试...`);
        setTimeout(autoClick, 10000); // 缩短重试间隔，避免卡死
        return;
    }

    // 解析每个按钮的剩余次数
    const buttons = candidates.map(div => {
        const text = div.innerText.trim();
        const match = text.match(/\((\d+)\/100\)/);
        const count = match ? parseInt(match[1], 10) : -1; // 没匹配到数字视为未知
        return { el: div, text, count };
    });

    // 找出还有次数的按钮（count > 0）
    const available = buttons.filter(b => b.count > 0);

    // 特殊情况：两个按钮都明确是 0/100 → 停止脚本
    const allZero = buttons.length >= 2 && buttons.every(b => b.count === 0);
    if (allZero) {
        running = false;
        console.log('%c🛑 检测到 Long 和 Short 都为 (0/100)，脚本自动停止！', 'color: #ff4444; font-size: 18px; font-weight: bold;');
        console.log('想继续玩请刷新页面后重新运行脚本。');
        return;
    }

    // 如果有可用按钮 → 随机点击一个
    if (available.length > 0) {
        const choice = available[Math.floor(Math.random() * available.length)];
        choice.el.click();
        console.log(`[${new Date().toLocaleTimeString()}] ✅ 点击了 ${choice.text}（剩余 ${choice.count}/100）`);
    } else {
        // 没有可用按钮，但也不是全0（可能是加载中或一个0一个正数）
        console.log(`[${new Date().toLocaleTimeString()}] ⏳ 当前无可用次数按钮（可能一个是0），等待下次检查...`);
    }

    // 随机 13~17 秒后继续
    const delay = 13000 + Math.floor(Math.random() * 4001);
    setTimeout(autoClick, delay);
};

// 启动提示
console.log('%c🚀 自动点击脚本已启动（修复版）！', 'color: #00ff00; font-size: 20px; font-weight: bold;');
console.log('• 每 13~17 秒随机点击一个还有次数的按钮');
console.log('• 仅当 Long 和 Short 都显示 (0/100) 时才停止');
console.log('• 中间即使暂时0次也会继续等待，不会错停');
console.log('手动停止：在 Console 输入 stopAutoClick()');

autoClick();

// 手动停止函数
window.stopAutoClick = () => {
    running = false;
    console.log('🛑 已手动停止脚本');
};