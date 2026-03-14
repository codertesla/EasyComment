// ==UserScript==
// @name         Bilibili 快捷评论发布
// @namespace    https://github.com/codertesla/EasyComment
// @version      1.1.2
// @description  在 B 站视频页使用 Cmd+Enter (Mac) 或 Ctrl+Enter (Windows/Linux) 快速发布评论
// @author       codertesla
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @supportURL   https://github.com/codertesla/EasyComment
// @homepageURL  https://github.com/codertesla/EasyComment
// @license      MIT
// @updateURL    https://greasyfork.org/zh-CN/scripts/565212-bilibili-快捷评论发布
// @downloadURL  https://greasyfork.org/zh-CN/scripts/565212-bilibili-快捷评论发布
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 获取深层激活的元素（穿透 Shadow DOM）
     */
    function getDeepActiveElement() {
        let active = document.activeElement;
        while (active && active.shadowRoot && active.shadowRoot.activeElement) {
            active = active.shadowRoot.activeElement;
        }
        return active;
    }

    /**
     * 从当前激活的元素向上查找发布按钮
     */
    function getSendButtonFromActiveElement() {
        const activeElement = getDeepActiveElement();
        if (!activeElement) return null;

        let node = activeElement;
        while (node) {
            if (node.tagName && node.tagName.toLowerCase() === 'bili-comment-box') {
                if (node.shadowRoot) {
                    const pubDiv = node.shadowRoot.getElementById('pub');
                    if (pubDiv) {
                        const btn = pubDiv.querySelector('button');
                        if (btn && !btn.disabled) return btn;
                    }
                }
            }
            
            // 向上遍历，穿透 Shadow DOM
            if (node.parentNode) {
                node = node.parentNode;
            } else if (node instanceof ShadowRoot && node.host) {
                node = node.host;
            } else {
                break;
            }
        }
        return null;
    }

    /**
     * 在 Shadow DOM 中查找发布按钮
     */
    function findSendButton() {
        // 方法1：从当前激活的输入框按层级往上找（支持任意深度的 Shadow DOM，含嵌套回复框）
        const btnFromActive = getSendButtonFromActiveElement();
        if (btnFromActive) return btnFromActive;

        // 方法2：旧版 DOM 直接查找
        const pubDiv = document.getElementById('pub');
        if (pubDiv) {
            const btn = pubDiv.querySelector('button');
            if (btn && !btn.disabled) return btn;
        }

        const oldSendBtn = document.querySelector('.reply-box-send:not(.disabled)');
        if (oldSendBtn) return oldSendBtn;

        return null;
    }

    /**
     * 检查当前焦点是否在评论输入框内
     */
    function isInCommentInput() {
        const activeElement = getDeepActiveElement();
        if (!activeElement) return false;

        // 检查新版 Shadow DOM 输入框
        if (activeElement.id === 'editor' && activeElement.hasAttribute('contenteditable')) {
            return true;
        }

        // 检查常见的评论输入框类名
        if (activeElement.classList) {
            const classList = activeElement.classList;
            if (classList.contains('reply-box-textarea') ||
                classList.contains('brt-editor') ||
                classList.contains('ipt-txt')) {
                return true;
            }
        }

        // 检查 placeholder 属性
        const placeholder = activeElement.getAttribute('placeholder') || '';
        if (placeholder.includes('评论') || placeholder.includes('想说')) {
            return true;
        }

        // 检查父元素
        let node = activeElement;
        while (node) {
            if (node.classList && (
                node.classList.contains('comment-send') ||
                node.classList.contains('reply-box') ||
                node.classList.contains('main-reply-box')
            )) {
                return true;
            }
            if (node.tagName && node.tagName.toLowerCase() === 'bili-comment-box') {
                return true;
            }

            if (node.parentNode) {
                node = node.parentNode;
            } else if (node instanceof ShadowRoot && node.host) {
                node = node.host;
            } else {
                break;
            }
        }

        return false;
    }

    /**
     * 触发发布按钮点击
     */
    function triggerSubmit() {
        const sendBtn = findSendButton();
        if (sendBtn) {
            sendBtn.click();
            console.log('[Bilibili 快捷评论] 评论已发布');
            return true;
        }
        console.log('[Bilibili 快捷评论] 未找到发布按钮');
        return false;
    }

    /**
     * 处理键盘事件
     * @param {KeyboardEvent} event
     */
    function handleKeydown(event) {
        // 检测 Cmd+Enter (Mac) 或 Ctrl+Enter (Windows/Linux)
        const isSubmitShortcut = (event.metaKey || event.ctrlKey) && event.key === 'Enter';

        if (!isSubmitShortcut) {
            return;
        }

        // 检查是否在评论输入框内
        if (isInCommentInput()) {
            event.preventDefault();
            event.stopPropagation();
            triggerSubmit();
        }
    }

    /**
     * 初始化脚本
     */
    function init() {
        // 使用捕获阶段监听，确保优先处理
        document.addEventListener('keydown', handleKeydown, true);
        console.log('[Bilibili 快捷评论] 脚本已加载 - 使用 Cmd+Enter 或 Ctrl+Enter 快速发布评论');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
