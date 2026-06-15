/**
 * Aurora Dark — Copy 按钮脚本
 * 配套样式：note-code-theme.css
 *
 * 功能：
 *   - 自动为所有 pre > code 块注入「Copy」按钮
 *   - 点击后写入剪贴板，显示「✓ Copied」动画，2s 后恢复
 *   - 数学公式块（pre.math）跳过，不添加按钮
 *   - 兼容 navigator.clipboard（现代）与 execCommand（降级）
 *
 * 使用：在 HTML 末尾引入即可，无需配置
 *   <script src="note-code-theme.js"></script>
 */

(function () {
    'use strict';

    /* ── SVG 图标 ──────────────────────────────── */
    const ICON_COPY = `
        <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="4" y="4" width="9" height="11" rx="1.5"/>
            <path d="M3 3V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1"/>
        </svg>`;

    const ICON_CHECK = `
        <svg viewBox="0 0 16 16" aria-hidden="true">
            <polyline points="2.5,8.5 6,12 13.5,4"/>
        </svg>`;

    /* ── 获取代码块纯文本（去掉 hljs 注入的标签） ── */
    function getCodeText(preEl) {
        const code = preEl.querySelector('code');
        if (!code) return '';
        // innerText 会保留换行，textContent 更可靠
        return code.textContent || '';
    }

    /* ── 写入剪贴板（现代 API + execCommand 降级） ── */
    async function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }
        // 降级方案：创建临时 textarea
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }

    /* ── 创建单个 Copy 按钮 ── */
    function createCopyButton() {
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.setAttribute('aria-label', 'Copy code');
        btn.setAttribute('title', 'Copy');
        btn.innerHTML = ICON_COPY + '<span>Copy</span>';
        return btn;
    }

    /* ── 点击处理 ── */
    function handleCopy(btn, preEl) {
        const text = getCodeText(preEl);

        copyToClipboard(text)
            .then(() => {
                // 成功：切换到 Copied 状态
                btn.classList.add('copied');
                btn.innerHTML = ICON_CHECK + '<span>Copied!</span>';
                btn.setAttribute('aria-label', 'Copied!');

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = ICON_COPY + '<span>Copy</span>';
                    btn.setAttribute('aria-label', 'Copy code');
                }, 2000);
            })
            .catch(() => {
                // 失败提示
                btn.innerHTML = ICON_COPY + '<span>Failed</span>';
                btn.style.color = '#f38ba8';
                setTimeout(() => {
                    btn.innerHTML = ICON_COPY + '<span>Copy</span>';
                    btn.style.color = '';
                }, 2000);
            });
    }

    /* ── 初始化所有代码块 ── */
    function init() {
        // 跳过 pre.math（数学公式块不需要 Copy）
        const preList = document.querySelectorAll('pre:not(.math)');

        preList.forEach(function (pre) {
            // 避免重复添加
            if (pre.querySelector('.code-copy-btn')) return;
            // 没有 code 子元素的 pre 跳过
            if (!pre.querySelector('code')) return;

            const btn = createCopyButton();
            btn.addEventListener('click', function () {
                handleCopy(btn, pre);
            });
            pre.appendChild(btn);
        });
    }

    /* ── 入口：DOM 就绪后执行 ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 已就绪（script 放在底部时）
        init();
    }

    /* ── 暴露给外部（可手动触发，用于动态插入的代码块） ── */
    window.AuroraDark = { init: init };

}());