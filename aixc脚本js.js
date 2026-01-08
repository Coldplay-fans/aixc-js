let running = true;

const autoClick = () => {
    if (!running) return;

    // 实时查找所有可能的按钮元素
    const candidates = Array.from(document.querySelectorAll('div, button')).filter(el => {
        const text = el.innerText.trim();
        const cursor = getComputedStyle(el).cursor;
        return (text.includes('Long Position') || text.includes('Short Position') || 
                text.includes('chances in') || text.includes('Place')) &&
               cursor === 'pointer' &&
               el.offsetParent !== null;
    });

    if (candidates.length === 0) {
        console.log(`[${new Date().toLocaleTimeString()}] ⚠️ 未找到按钮，10秒后重试...`);
        setTimeout(autoClick, 10000);
        return;
    }

    // 判断是否两个按钮都显示 “chances in” 倒计时（次数用完）
    const allHaveChances = candidates.every(el => el.innerText.trim().includes('chances in'));

    if (allHaveChances && candidates.length >= 2) {
        running = false;
        console.log('%c🛑 检测到 Long 和 Short 都显示 “chances in” 倒计时，次数已用完，脚本自动停止！', 'color: #ff4444; font-size: 30px; font-weight: bold;');
        console.log('下次重新开始请刷新页面后再次运行脚本。');
        return;
    }

    // 随机点击一个按钮
    const choice = candidates[Math.floor(Math.random() * candidates.length)];
    choice.click();
    console.log(`[${new Date().toLocaleTimeString()}] ✅ 点击了 ${choice.innerText.trim().substring(0, 60)}...`);

    // 13~17 秒随机间隔
    const delay = 13000 + Math.floor(Math.random() * 4001);
    setTimeout(autoClick, delay);
};

console.log('%c🚀 AIxC C10 自动脚本已启动（完美适配新倒计时界面）！', 'color: #00ff00; font-size: 20px; font-weight: bold;');
console.log('• 每 13~17 秒随机点击多/空');
console.log('• 当两个按钮都显示 “xx chances in xx:xx:xx” 时自动停止');
console.log('手动停止：在 Console 输入 stopAutoClick()');

autoClick();

window.stopAutoClick = () => {
    running = false;
    console.log('🛑 已手动停止脚本');
};