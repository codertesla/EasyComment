// ==UserScript==
// @name         Bilibili 快捷评论发布
// @namespace    https://github.com/codertesla/EasyComment
// @version      1.1.1
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
     * 在 Shadow DOM 中查找发布按钮
     * B 站新版评论区使用了 Shadow DOM，需要递归查找
     */
    function findSendButton() {
        // 方法1：直接查找 #pub 内的 button（新版评论区）
        const pubDiv = document.getElementById('pub');
        if (pubDiv) {
            const btn = pubDiv.querySelector('button');
            if (btn) return btn;
        }

        // 方法2：通过 Shadow DOM 查找
        const commentApp = document.getElementById('commentapp');
        if (commentApp) {
            // 查找 bili-comments 组件
            const biliComments = commentApp.querySelector('bili-comments');
            if (biliComments && biliComments.shadowRoot) {
                // 在 header 中查找发布按钮
                const header = biliComments.shadowRoot.querySelector('bili-comments-header-renderer');
                if (header && header.shadowRoot) {
                    const commentBox = header.shadowRoot.querySelector('bili-comment-box');
                    if (commentBox && commentBox.shadowRoot) {
                        const pubDiv = commentBox.shadowRoot.getElementById('pub');
                        if (pubDiv) {
                            const btn = pubDiv.querySelector('button');
                            if (btn && !btn.disabled) return btn;
                        }
                    }
                }

                // 在回复区域查找（楼中楼）
                const threads = biliComments.shadowRoot.querySelectorAll('bili-comment-thread-renderer');
                for (const thread of threads) {
                    if (thread.shadowRoot) {
                        const commentBox = thread.shadowRoot.querySelector('bili-comment-box');
                        if (commentBox && commentBox.shadowRoot) {
                            const editor = commentBox.shadowRoot.getElementById('editor');
                            // 检查是否是当前激活的编辑器
                            if (editor && editor.classList.contains('active')) {
                                const pubDiv = commentBox.shadowRoot.getElementById('pub');
                                if (pubDiv) {
                                    const btn = pubDiv.querySelector('button');
                                    if (btn && !btn.disabled) return btn;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 方法3：旧版评论区
        const oldSendBtn = document.querySelector('.reply-box-send:not(.disabled)');
        if (oldSendBtn) return oldSendBtn;

        return null;
    }

    /**
     * 检查当前焦点是否在评论输入框内
     */
    function isInCommentInput() {
        const activeElement = document.activeElement;

        // 检查是否在 Shadow DOM 的输入框内
        if (activeElement && activeElement.shadowRoot) {
            const editor = activeElement.shadowRoot.getElementById('editor');
            if (editor) return true;
        }

        // 检查常见的评论输入框类名
        if (activeElement) {
            const classList = activeElement.classList;
            if (classList.contains('reply-box-textarea') ||
                classList.contains('brt-editor') ||
                classList.contains('ipt-txt')) {
                return true;
            }

            // 检查 placeholder 属性
            const placeholder = activeElement.getAttribute('placeholder') || '';
            if (placeholder.includes('评论') || placeholder.includes('想说')) {
                return true;
            }

            // 检查父元素
            if (activeElement.closest('.comment-send') ||
                activeElement.closest('.reply-box') ||
                activeElement.closest('.main-reply-box') ||
                activeElement.closest('bili-comment-box')) {
                return true;
            }
        }

        // 检查是否有激活的编辑器（通过 Shadow DOM）
        const commentApp = document.getElementById('commentapp');
        if (commentApp) {
            const biliComments = commentApp.querySelector('bili-comments');
            if (biliComments && biliComments.shadowRoot) {
                // 检查主评论框
                const header = biliComments.shadowRoot.querySelector('bili-comments-header-renderer');
                if (header && header.shadowRoot) {
                    const commentBox = header.shadowRoot.querySelector('bili-comment-box');
                    if (commentBox && commentBox.shadowRoot) {
                        const editor = commentBox.shadowRoot.getElementById('editor');
                        if (editor && editor.classList.contains('active')) {
                            return true;
                        }
                    }
                }

                // 检查回复框
                const threads = biliComments.shadowRoot.querySelectorAll('bili-comment-thread-renderer');
                for (const thread of threads) {
                    if (thread.shadowRoot) {
                        const commentBox = thread.shadowRoot.querySelector('bili-comment-box');
                        if (commentBox && commentBox.shadowRoot) {
                            const editor = commentBox.shadowRoot.getElementById('editor');
                            if (editor && editor.classList.contains('active')) {
                                return true;
                            }
                        }
                    }
                }
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
