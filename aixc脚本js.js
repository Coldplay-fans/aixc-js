let running = true;

const autoClick = () => {
    if (!running) return;

    // 实时查找按钮（基于文字开头 + cursor: pointer）
    const candidates = Array.from(document.querySelectorAll('div, button')).filter(el => {
        const text = el.innerText.trim();
        const cursor = getComputedStyle(el).cursor;
        return (text.startsWith('Long Position') || text.startsWith('Short Position') ||
                text.includes('chances in') || text.startsWith('Place')) &&  // 兼容旧新界面
               cursor === 'pointer' &&
               el.offsetParent !== null;
    });

    if (candidates.length === 0) {
        console.log(`[${new Date().toLocaleTimeString()}] ⚠️ 暂未找到按钮，10秒后重试...`);
        setTimeout(autoClick, 10000);
        return;
    }

    // 分类：可用按钮 vs 已用完（含 chances in）
    const available = [];
    const exhausted = [];

    candidates.forEach(el => {
        const text = el.innerText.trim();
        if (text.includes('chances in')) {
            exhausted.push({ el, text });
        } else {
            available.push({ el, text });
        }
    });

    // 如果两个方向都显示 “chances in...” → 停止脚本
    const hasLongExhausted = exhausted.some(b => b.text.includes('Long') || b.text.includes('100 chances'));
    const hasShortExhausted = exhausted.some(b => b.text.includes('Short') || b.text.includes('100 chances'));

    if (hasLongExhausted && hasShortExhausted) {
        running = false;
        console.log('%c🛑 检测到 Long 和 Short 都显示倒计时（次数已用完），脚本自动停止！', 'color: #ff4444; font-size: 18px; font-weight: bold;');
        console.log('下次重新开始请刷新页面后再次运行脚本。');
        return;
    }

    // 优先点击还有次数的按钮
    let choice;
    if (available.length > 0) {
        choice = available[Math.floor(Math.random() * available.length)];
    } else {
        // 理论上不会走到这里，除非只有一个方向显示 chances in
        choice = exhausted[0];
    }

    choice.el.click();
    console.log(`[${new Date().toLocaleTimeString()}] ✅ 点击了 ${choice.text.substring(0, 50)}...`);

    // 13~17 秒随机延迟
    const delay = 13000 + Math.floor(Math.random() * 4001);
    setTimeout(autoClick, delay);
};

// 启动提示
console.log('%c🚀 AIxC 自动脚本已启动（适配新倒计时界面）！', 'color: #00ff00; font-size: 20px; font-weight: bold;');
console.log('• 每 13~17 秒随机点击');
console.log('• 当两个按钮都显示 “xx chances in xx:xx:xx” 时自动停止');
console.log('手动停止：stopAutoClick()');

autoClick();

// 手动停止函数
window.stopAutoClick = () => {
    running = false;
    console.log('🛑 已手动停止脚本');
};