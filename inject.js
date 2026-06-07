/*!
 * Achord Bot — Custom Webchat Injection
 * Version: 22.0.0
 * Loads inside Botpress webchat shadow DOM running on Framer page.
 * Served via jsDelivr from GitHub: replaces all 4-5 custom-code blocks.
 */
(function () {
  'use strict';

  var VERSION = '22.5.0';
  var F = "font-family:'Heebo',sans-serif";

  /* ============================================================ */
  /*  CSS — base (chat structure, header, fab)                    */
  /* ============================================================ */
  var BASE_CSS = `:host,.bpWebchat,.bpFABWebchat{--ac-p:#FF8127;--ac-d:#EC854B;--ac-c:#FFFCF1;--ac-id:#F4C5AA;--ac-bf:#F0E8D8}
.bpFabWrapper.bpFabWrapper{bottom:80px!important;right:24px!important;left:auto!important;z-index:9999!important}
.bpFab.bpFab{background:var(--ac-p)!important;box-shadow:0 8px 24px rgba(255,129,39,.4)!important;width:56px!important;height:56px!important;transition:transform .25s ease,background .2s ease,box-shadow .2s ease!important}
.bpFab.bpFab.achord-fab-open{background:#A89F8E!important;box-shadow:0 6px 16px rgba(73,73,73,.16)!important}
.bpFab [class*="Badge"],.bpFab [class*="Unread"]{display:none!important}
.bpFabIcon{background:none!important;background-image:none!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;width:100%!important;height:100%!important}
.bpFabIcon svg{display:block}
.bpWebchat.bpWebchat,.bpFABWebchat.bpFABWebchat{right:24px!important;left:auto!important;bottom:160px!important;top:auto!important;width:421px!important;height:560px!important;max-height:calc(100vh - 220px)!important;z-index:10000!important;border-radius:17.516px!important;overflow:hidden!important;box-shadow:0 13.137px 35.032px rgba(73,73,73,.12)!important;border:1.095px solid #E8DFCF!important;box-sizing:border-box!important}
.bpContainer{background:var(--ac-c)!important;width:100%!important;height:100%!important;box-shadow:none!important;border-radius:17.516px!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}
.bpWebchat:not(.bpOpen),.bpFABWebchat:not(.bpOpen){display:none!important;visibility:hidden!important}
.bpWebchat.achord-side,.bpFABWebchat.achord-side{right:24px!important;top:120px!important;bottom:160px!important;width:421px!important;height:auto!important;max-height:calc(100vh - 280px)!important}
.bpHeader,.bpHeaderContainer{background:var(--ac-d)!important;color:#fff!important;padding:0!important;border-bottom:1.1px solid var(--ac-bf)!important;direction:rtl!important;position:relative!important;flex-shrink:0!important}
.bpHeaderContentContainer{display:flex!important;direction:rtl!important;align-items:center!important;gap:5.5px!important;padding:15.4px 39.4px 15.4px 17.6px!important;background:transparent!important;border:none!important;width:100%!important;box-sizing:border-box!important}
.bpHeaderContentTitle{font-size:17.6px!important;font-weight:600!important;color:var(--ac-id)!important;${F}!important;text-align:right!important;flex:1!important;margin:0!important;line-height:1.37!important;order:2!important;padding:0!important}
.bpHeaderContentTitle::after,.bpHeaderAvatar,.bpHeaderContentAvatarContainer,.bpHeaderContentDescription,.bpMessageListMarqueeContainer,.bpHeaderConversationHistoryButton{display:none!important}
.bpHeaderContentActionsContainer{display:flex!important;direction:rtl!important;gap:4px!important;align-items:center!important;order:3!important}
.bpHeaderContentActionsIcons{color:#fff!important;cursor:pointer!important;border-radius:6px!important;width:12px!important;height:12px!important;padding:6px!important;stroke-width:2!important}
.bpHeaderContentActionsIcons[aria-label*="Close" i]{display:none!important}
.bpHeaderContentActionsIcons[aria-label*="Restart" i]{width:25px!important;height:25px!important;padding:6px!important;stroke-width:1.8!important;color:#fff!important;background:rgba(255,252,241,.26)!important;border-radius:6px!important;box-sizing:border-box!important}
.bpHeaderContentActionsIcons:hover{background:rgba(255,255,255,.22)!important}
.achord-bot-av{width:41px!important;height:41px!important;background:transparent!important;border:none!important;border-radius:0!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;flex-shrink:0!important;order:1!important;padding:2px!important;box-sizing:border-box!important}
.achord-bot-av svg{width:41px!important;height:38px!important;opacity:.54!important}
.achord-expand-btn{color:#fff!important;width:24.5px!important;height:24.5px!important;cursor:pointer!important;border-radius:6.13px!important;background:rgba(255,252,241,.26)!important;border:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;${F}!important;font-size:23px!important;line-height:1!important;padding:0!important;order:3!important}
.achord-expand-btn:hover{background:rgba(255,252,241,.42)!important}
@media (max-width:480px){.bpWebchat.bpWebchat,.bpFABWebchat.bpFABWebchat{width:calc(100vw - 24px)!important;right:12px!important;height:calc(100dvh - 160px)!important;bottom:120px!important}.bpWebchat.achord-side,.bpFABWebchat.achord-side{width:calc(100vw - 24px)!important;right:12px!important;top:12px!important;bottom:12px!important}.achord-expand-btn{display:none!important}.bpFabWrapper.bpFabWrapper{bottom:104px!important}.bpFab.bpFab{width:46px!important;height:46px!important;opacity:.3!important}.bpFab.bpFab:active,.bpFab.bpFab.achord-fab-open{opacity:1!important}}`;

  /* ============================================================ */
  /*  CSS — messages, composer, scroll button                     */
  /* ============================================================ */
  var MSG_CSS = `.bpAvatar,[class*="MessageAvatar"]{background:#FF8127!important;color:transparent!important;font-size:0!important}
.bpAvatar *,[class*="MessageAvatar"] *{color:transparent!important;font-size:0!important;background:transparent!important}
.bpMessageAvatarContainer{display:none!important}
.bpMessageList,.bpMessageBlocksContainer{background:#FFFCF1!important}
.bpMessageListViewport{padding-right:28px!important;padding-left:28px!important;gap:15px!important;direction:rtl!important;padding-top:24px!important;padding-bottom:24px!important;justify-content:flex-start!important}
.bpMessageListContainer{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;scroll-behavior:smooth!important}
.bpMessageContainer:not(:has(>.bpMessageAvatarContainer)):not(:has(.bpDateSeparator)) .bpMessageBlocksBubble{background:#EC854B!important;color:#fff!important;border:none!important;border-radius:10px!important;border-bottom-left-radius:4px!important;padding:10px 13px!important;max-width:82%!important}
.bpMessageContainer:not(:has(>.bpMessageAvatarContainer)):not(:has(.bpDateSeparator)) .bpMessageBlocksBubble *{color:#fff!important}
.bpMessageContainer:not(:has(>.bpMessageAvatarContainer)):not(:has(.bpDateSeparator)){justify-content:flex-end!important}
.bpMessageContainer:has(>.bpMessageAvatarContainer) .bpMessageBlocksBubble{background:#FFF9F4!important;color:#6F5C45!important;border:1px solid #E8DFCF!important;border-radius:10px!important;border-bottom-right-radius:4px!important;padding:10px 13px!important;max-width:82%!important}
.bpMessageContainer:has(>.bpMessageAvatarContainer) .bpMessageBlocksBubble *{color:#6F5C45!important}
.bpMessageContainer:has(>.bpMessageAvatarContainer){flex-direction:row!important;justify-content:flex-start!important}
.bpMessageBlocksBubble,.bpMessageBlocksBubble *{direction:rtl!important;text-align:right!important;unicode-bidi:plaintext!important;${F}!important}
.bpMessageBlocksBubble p{margin-bottom:4px!important;font-size:16.5px!important;line-height:1.45!important}
.bpMessageBlocksBubble p:last-child{margin-bottom:0!important}
.bpMessageList [class*="Date"],.bpMessageList [class*="Time"]{color:#A89B85!important;font-size:12px!important;${F}!important}
.bpComposer,.bpComposerContainer{background:#FFFCF1!important;border:none!important;border-top:1.095px solid #F0E8D8!important;padding:0!important;flex-shrink:0!important;outline:none!important;box-shadow:none!important}
.bpComposerContainer>div{display:flex!important;direction:rtl!important;align-items:center!important;gap:11px!important;padding:13.137px 15.326px!important;outline:none!important;box-shadow:none!important;border:none!important}
.bpComposer:focus-within,.bpComposer *:focus,.bpComposer *:focus-visible,.bpComposerContainer:focus-within,.bpComposerContainer *:focus,.bpComposerContainer *:focus-visible,.bpComposerContainer>div:focus-within{outline:none!important;outline-color:transparent!important;outline-width:0!important;outline-offset:0!important;box-shadow:none!important;border-color:#E8DFCF!important}
.bpComposerInput,textarea.bpComposerInput{background:#FFF9F4!important;color:#1F1A14!important;border:1.095px solid #E8DFCF!important;border-radius:21px!important;padding:9.853px 15.326px!important;font-size:15.326px!important;direction:rtl!important;text-align:right!important;${F}!important;line-height:1.57!important;flex:1 1 auto!important;width:auto!important;min-width:0!important;outline:none!important;outline-color:transparent!important;box-shadow:none!important;resize:none!important;order:2!important;min-height:42px!important;max-height:120px!important;overflow-y:auto!important}
.bpComposerInput:focus,.bpComposerInput:focus-visible,textarea.bpComposerInput:focus{outline:none!important;outline-color:transparent!important;box-shadow:none!important;border:1.095px solid #E8DFCF!important;border-color:#E8DFCF!important;background:#FFF9F4!important}
.bpComposerInput::placeholder{color:#A89B85!important;font-size:15.326px!important;${F}!important}
.bpComposerSendButton{background:#FF8127!important;color:#fff!important;border-radius:999px!important;width:39.411px!important;height:39.411px!important;flex-shrink:0!important;opacity:1!important;visibility:visible!important;display:flex!important;align-items:center!important;justify-content:center!important;order:1!important;align-self:center!important;margin-bottom:0!important}
.bpComposerSendButton[disabled],.bpComposerSendButton:disabled{background:#E8DFCF!important;opacity:1!important}
.bpComposerVoiceButton,.bpComposerContainer [class*="Voice" i],.bpComposerContainer [class*="Mic" i],.bpComposerContainer svg[aria-label*="Voice" i],.bpComposerContainer svg[aria-label*="Mic" i]{display:none!important}
.bpComposerFooter,[class*="ComposerFooter"]{display:none!important}
[class*="ScrollToBottom" i],[aria-label*="scroll" i]{right:auto!important;left:14px!important;bottom:78px!important;background:rgba(255,255,255,.85)!important;color:#A89B85!important;border:1px solid #E8DFCF!important;width:26px!important;height:26px!important;border-radius:50%!important;opacity:.6!important;box-shadow:0 2px 6px rgba(73,73,73,.08)!important}`;

  /* ============================================================ */
  /*  CSS — welcome panel                                         */
  /* ============================================================ */
  var WELCOME_CSS = `.achord-w{display:flex;flex-direction:column;align-items:stretch;padding:24px 28px 16px;margin:0 -28px;box-sizing:border-box;direction:rtl;${F};gap:15px;background:#FFFCF1;flex-shrink:0;border-radius:0;border-bottom:1px solid #F0E8D8}
.achord-wtxt{display:flex;flex-direction:column;align-items:stretch;gap:9px;padding:0 39px 0 18px;width:100%;box-sizing:border-box;direction:rtl}
.achord-wt{font-size:15px;line-height:1.45;color:#6F5C45;font-weight:500;margin:0;text-align:right;direction:rtl;unicode-bidi:plaintext}
.achord-wp{font-size:13px;line-height:1.5;color:#6F5C45;font-weight:500;margin:0;text-align:right;direction:rtl;unicode-bidi:plaintext}
.achord-wsep{width:5px;height:19px;background:#E8B89A;border-radius:1px;align-self:center}
.achord-ws{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%}
.achord-ch{font-size:15px;font-weight:700;color:#6F5C45;text-align:center;margin:0;line-height:1.55}
.achord-cs{font-size:15px;color:#6F5C45;text-align:center;margin:0;line-height:1.55;max-width:311px;padding:0 20px;box-sizing:border-box}
.achord-wc{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;padding:6px 46px 4px;direction:rtl;width:100%;box-sizing:border-box}
.achord-wcb{padding:7px 13px;border:1px solid #FFA768;background:#fff;color:#D6722C;border-radius:999px;font-size:12px;${F};font-weight:500;cursor:pointer;transition:background .15s ease,transform .12s ease,opacity .15s ease;white-space:nowrap}
.achord-wcb:hover:not(.achord-wcb-selected):not(.achord-wcb-disabled){background:#FFF4EB}
.achord-wcb:active{transform:scale(.96)}
.achord-wcb-selected{background:#FF8127!important;color:#fff!important;border-color:#FF8127!important;cursor:default!important;pointer-events:none}
.achord-wcb-disabled{opacity:.4;pointer-events:none;cursor:not-allowed}`;

  /* ============================================================ */
  /*  CSS — dropzone fix (compat with original ac-fix)            */
  /* ============================================================ */
  var FIX_CSS = `.bpDropzoneOverlay{display:none!important;pointer-events:none!important;visibility:hidden!important}
.bpWebchat.bpWebchat,.bpFABWebchat.bpFABWebchat{pointer-events:auto!important;animation:none!important;transform:none!important;opacity:1!important}
.bpContainer{pointer-events:auto!important}`;

  /* ============================================================ */
  /*  SVG assets — bot avatar (Asset 1), close ✕, restart ⟲, send ← */
  /* ============================================================ */
  var AVATAR_SVG = '<svg viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block"><path fill="currentColor" d="M42.1875 10.125H28.6875V3.375C28.6875 2.92745 28.5097 2.49822 28.1932 2.18176C27.8768 1.86529 27.4476 1.6875 27 1.6875C26.5524 1.6875 26.1232 1.86529 25.8068 2.18176C25.4903 2.49822 25.3125 2.92745 25.3125 3.375V10.125H11.8125C10.0223 10.125 8.3054 10.8362 7.03953 12.102C5.77366 13.3679 5.0625 15.0848 5.0625 16.875V40.5C5.0625 42.2902 5.77366 44.0071 7.03953 45.273C8.3054 46.5388 10.0223 47.25 11.8125 47.25H42.1875C43.9777 47.25 45.6946 46.5388 46.9605 45.273C48.2263 44.0071 48.9375 42.2902 48.9375 40.5V16.875C48.9375 15.0848 48.2263 13.3679 46.9605 12.102C45.6946 10.8362 43.9777 10.125 42.1875 10.125ZM36.2812 20.25C36.7819 20.25 37.2713 20.3985 37.6875 20.6766C38.1038 20.9547 38.4282 21.3501 38.6198 21.8126C38.8114 22.2751 38.8615 22.7841 38.7639 23.2751C38.6662 23.7661 38.4251 24.2171 38.0711 24.5711C37.7171 24.9251 37.2661 25.1662 36.7751 25.2639C36.2841 25.3615 35.7751 25.3114 35.3126 25.1198C34.8501 24.9282 34.4547 24.6038 34.1766 24.1875C33.8985 23.7713 33.75 23.2819 33.75 22.7812C33.75 22.1099 34.0167 21.4661 34.4914 20.9914C34.9661 20.5167 35.6099 20.25 36.2812 20.25ZM20.25 38.8125H16.875C15.9799 38.8125 15.1215 38.4569 14.4885 37.824C13.8556 37.191 13.5 36.3326 13.5 35.4375C13.5 34.5424 13.8556 33.684 14.4885 33.051C15.1215 32.4181 15.9799 32.0625 16.875 32.0625H20.25V38.8125ZM17.7188 25.3125C17.2181 25.3125 16.7287 25.164 16.3125 24.8859C15.8962 24.6078 15.5718 24.2124 15.3802 23.7499C15.1886 23.2874 15.1385 22.7784 15.2361 22.2874C15.3338 21.7964 15.5749 21.3454 15.9289 20.9914C16.2829 20.6374 16.7339 20.3963 17.2249 20.2986C17.7159 20.201 18.2249 20.2511 18.6874 20.4427C19.1499 20.6343 19.5453 20.9587 19.8234 21.375C20.1015 21.7912 20.25 22.2806 20.25 22.7812C20.25 23.4526 19.9833 24.0964 19.5086 24.5711C19.0339 25.0458 18.3901 25.3125 17.7188 25.3125ZM30.375 38.8125H23.625V32.0625H30.375V38.8125ZM37.125 38.8125H33.75V32.0625H37.125C38.0201 32.0625 38.8785 32.4181 39.5115 33.051C40.1444 33.684 40.5 34.5424 40.5 35.4375C40.5 36.3326 40.1444 37.191 39.5115 37.824C38.8785 38.4569 38.0201 38.8125 37.125 38.8125Z"/></svg>';

  var CLOSE_PATH = '<path fill="currentColor" d="M8.47088 16.1394L7.85003 15.5186L11.6211 11.7245L7.85003 7.93039L8.47088 7.30954L12.242 11.1036L15.9901 7.30954L16.6109 7.93039L12.8398 11.7245L16.6109 15.5186L15.9901 16.1394L12.242 12.3683L8.47088 16.1394Z"/>';

  var RESTART_PATH = '<path fill="currentColor" d="M13.2821 2.82216V5.70809C13.2821 5.80376 13.2441 5.89552 13.1765 5.96317C13.1088 6.03082 13.0171 6.06883 12.9214 6.06883H10.0354C9.93977 6.06883 9.84802 6.03082 9.78037 5.96317C9.71271 5.89552 9.67471 5.80376 9.67471 5.70809C9.67471 5.61241 9.71271 5.52066 9.78037 5.45301C9.84802 5.38535 9.93977 5.34735 10.0354 5.34735H11.9925L10.1659 3.67591C10.1623 3.67231 10.1587 3.6681 10.1545 3.66449C9.46918 2.97957 8.59724 2.51177 7.6476 2.31953C6.69797 2.12728 5.71274 2.21911 4.81499 2.58355C3.91724 2.94799 3.14678 3.56887 2.59985 4.36864C2.05291 5.16841 1.75376 6.11161 1.73977 7.08041C1.72577 8.0492 1.99754 9.00065 2.52113 9.81589C3.04473 10.6311 3.79693 11.274 4.68378 11.6642C5.57062 12.0545 6.55279 12.1747 7.50758 12.01C8.46237 11.8453 9.34746 11.4029 10.0523 10.738C10.1219 10.6723 10.2147 10.637 10.3104 10.6397C10.4061 10.6425 10.4967 10.6832 10.5624 10.7528C10.6281 10.8224 10.6635 10.9152 10.6607 11.0109C10.658 11.1066 10.6173 11.1972 10.5477 11.2629C9.50027 12.2551 8.11131 12.8065 6.66853 12.8027H6.59157C5.66612 12.7896 4.75804 12.5495 3.94711 12.1034C3.13617 11.6573 2.44721 11.0189 1.94075 10.2442C1.43429 9.46952 1.12584 8.58232 1.04249 7.66054C0.959149 6.73876 1.10346 5.81062 1.46276 4.95767C1.82205 4.10471 2.38532 3.35305 3.10309 2.76873C3.82085 2.1844 4.67114 1.7853 5.57924 1.60648C6.48734 1.42767 7.42546 1.47461 8.31117 1.74319C9.19689 2.01177 10.0031 2.49376 10.6589 3.14683L12.5606 4.8874V2.82216C12.5606 2.72648 12.5986 2.63473 12.6663 2.56708C12.7339 2.49942 12.8257 2.46142 12.9214 2.46142C13.0171 2.46142 13.1088 2.49942 13.1765 2.56708C13.2441 2.63473 13.2821 2.72648 13.2821 2.82216Z"/>';

  var SEND_ARROW = '<path fill="white" d="M17.1528 22.065C17.0215 21.7235 16.877 21.4082 16.7193 21.1192C16.5617 20.817 16.3843 20.5346 16.1873 20.2718H26.7493V18.656H16.1873C16.3712 18.3933 16.542 18.1174 16.6996 17.8284C16.8572 17.5262 17.0018 17.2044 17.1331 16.8628H15.6355C14.821 17.8218 13.9277 18.5509 12.9556 19.0501V19.8974C13.9277 20.3704 14.821 21.0929 15.6355 22.065H17.1528Z"/>';

  /* ============================================================ */
  /*  Welcome panel content                                       */
  /* ============================================================ */
  var WT = 'היי! שמחים שבאת...';
  var WP = 'נשמח לעזור לך להבין טוב יותר את המודל ולהפיק ממנו את מירב התועלת. תרגיש/י חופשי/ת לשאול כל מה שעולה על דעתך.';
  var CH = 'שנכיר?';
  var CS = 'תרצה/י לספר לנו מה הקשר שלך לאקדמיה?';
  var CHIPS = ['אני סטודנט', 'אני ממונת מגוון', 'אני חבר סגל', 'אחר', 'פשוט מתעניין'];

  /* ============================================================ */
  /*  Expand state                                                */
  /* ============================================================ */
  var EXP_KEY = 'achord-exp-v22';
  var MOBILE_W = 480;
  var exp = false;
  try { exp = localStorage.getItem(EXP_KEY) === '1'; } catch (e) {}

  function isMobile() { return window.innerWidth <= MOBILE_W; }
  function getShadow() {
    var f = document.querySelector('#fab-root');
    return f && f.shadowRoot || null;
  }

  /* ============================================================ */
  /*  Style injection                                             */
  /* ============================================================ */
  function injectStyle(sh, id, css) {
    if (!sh) return;
    var existing = sh.getElementById(id);
    if (existing) {
      /* re-inject if version changed (handles cross-version jsDelivr updates) */
      if (existing.getAttribute('data-v') === VERSION) return;
      existing.remove();
    }
    var s = document.createElement('style');
    s.id = id;
    s.setAttribute('data-v', VERSION);
    s.textContent = css;
    sh.appendChild(s);
  }

  function cleanupOldStyles(sh) {
    if (!sh) return;
    var prefixes = ['ac-v', 'ac-fix'];
    [].forEach.call(sh.querySelectorAll('style[id]'), function (e) {
      var id = e.id;
      var isOld = (id.indexOf('ac-v') === 0 && id.indexOf('-v22') === -1) || id === 'ac-fix';
      if (isOld) e.remove();
    });
  }

  /* ============================================================ */
  /*  Expand button toggle (achord-side mode)                     */
  /* ============================================================ */
  function applyExpand(sh) {
    var c = sh.querySelector('.bpWebchat') || sh.querySelector('.bpFABWebchat');
    if (!c) return;
    var active = exp && !isMobile();
    c.classList.toggle('achord-side', active);
    document.body.classList.toggle('achord-side-open', active);
  }

  function toggleExpand(sh) {
    if (isMobile()) return;
    exp = !exp;
    try { localStorage.setItem(EXP_KEY, exp ? '1' : '0'); } catch (e) {}
    applyExpand(sh);
    updateExpandGlyph();
  }

  var _expandBtn = null;
  function updateExpandGlyph() {
    if (!_expandBtn) return;
    _expandBtn.textContent = '⤢';
    _expandBtn.title = exp ? 'הקטנה' : 'הגדלה';
    _expandBtn.setAttribute('aria-label', exp ? 'הקטנה' : 'הגדלה');
    _expandBtn.style.transform = exp ? 'rotate(90deg)' : 'rotate(0deg)';
  }

  function injectExpandButton(sh) {
    if (isMobile()) return;
    var ac = sh.querySelector('.bpHeaderContentActionsContainer');
    if (!ac || ac.querySelector('.achord-expand-btn')) return;
    var b = document.createElement('button');
    b.className = 'achord-expand-btn';
    b.type = 'button';
    _expandBtn = b;
    updateExpandGlyph();
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggleExpand(sh); });
    b.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    ac.appendChild(b);
  }

  /* ============================================================ */
  /*  Avatar injection                                            */
  /* ============================================================ */
  function injectAvatar(sh) {
    var hcc = sh.querySelector('.bpHeaderContentContainer');
    if (!hcc) return;
    var existing = hcc.querySelector('.achord-bot-av');
    if (existing && existing.getAttribute('data-v') === '22') return;
    if (existing) existing.remove();
    var a = document.createElement('div');
    a.className = 'achord-bot-av';
    a.setAttribute('aria-hidden', 'true');
    a.setAttribute('data-v', '22');
    a.innerHTML = AVATAR_SVG;
    hcc.insertBefore(a, hcc.firstChild);
  }

  /* ============================================================ */
  /*  SVG icon swap (close, restart, send)                        */
  /* ============================================================ */
  function swapIconSvg(svg, viewBox, pathHTML) {
    if (!svg || svg.getAttribute('data-v') === '22') return;
    svg.setAttribute('viewBox', viewBox);
    svg.removeAttribute('stroke');
    svg.removeAttribute('stroke-width');
    svg.setAttribute('fill', 'currentColor');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.insertAdjacentHTML('beforeend', pathHTML);
    svg.setAttribute('data-v', '22');
  }

  function swapSendButton(sh) {
    var sb = sh.querySelector('.bpComposerSendButton');
    if (!sb || sb.getAttribute('data-v') === '22') return;
    var svg = sb.querySelector('svg');
    if (!svg) return;
    svg.setAttribute('viewBox', '11 16 17 8');
    svg.removeAttribute('stroke');
    svg.removeAttribute('stroke-width');
    svg.setAttribute('fill', 'white');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.insertAdjacentHTML('beforeend', SEND_ARROW);
    svg.style.width = '20px';
    svg.style.height = '10px';
    sb.setAttribute('data-v', '22');
  }

  function swapNativeIcons(sh) {
    /* close swap removed in v22.1 — close button hidden, FAB toggles instead */
    var restart = sh.querySelector('[aria-label*="Restart" i]');
    if (restart && restart.tagName.toLowerCase() === 'svg') swapIconSvg(restart, '1 1.5 13 12', RESTART_PATH);
    swapSendButton(sh);
  }

  /* ============================================================ */
  /*  FAB icon toggle — chevron-down when chat open, bot when closed */
  /* ============================================================ */
  var FAB_BOT = '<svg viewBox="0 0 54 54" preserveAspectRatio="xMidYMid meet" style="width:32px;height:32px;display:block;color:#fff"><path fill="currentColor" d="M42.1875 10.125H28.6875V3.375C28.6875 2.92745 28.5097 2.49822 28.1932 2.18176C27.8768 1.86529 27.4476 1.6875 27 1.6875C26.5524 1.6875 26.1232 1.86529 25.8068 2.18176C25.4903 2.49822 25.3125 2.92745 25.3125 3.375V10.125H11.8125C10.0223 10.125 8.3054 10.8362 7.03953 12.102C5.77366 13.3679 5.0625 15.0848 5.0625 16.875V40.5C5.0625 42.2902 5.77366 44.0071 7.03953 45.273C8.3054 46.5388 10.0223 47.25 11.8125 47.25H42.1875C43.9777 47.25 45.6946 46.5388 46.9605 45.273C48.2263 44.0071 48.9375 42.2902 48.9375 40.5V16.875C48.9375 15.0848 48.2263 13.3679 46.9605 12.102C45.6946 10.8362 43.9777 10.125 42.1875 10.125ZM36.2812 20.25C36.7819 20.25 37.2713 20.3985 37.6875 20.6766C38.1038 20.9547 38.4282 21.3501 38.6198 21.8126C38.8114 22.2751 38.8615 22.7841 38.7639 23.2751C38.6662 23.7661 38.4251 24.2171 38.0711 24.5711C37.7171 24.9251 37.2661 25.1662 36.7751 25.2639C36.2841 25.3615 35.7751 25.3114 35.3126 25.1198C34.8501 24.9282 34.4547 24.6038 34.1766 24.1875C33.8985 23.7713 33.75 23.2819 33.75 22.7812C33.75 22.1099 34.0167 21.4661 34.4914 20.9914C34.9661 20.5167 35.6099 20.25 36.2812 20.25ZM20.25 38.8125H16.875C15.9799 38.8125 15.1215 38.4569 14.4885 37.824C13.8556 37.191 13.5 36.3326 13.5 35.4375C13.5 34.5424 13.8556 33.684 14.4885 33.051C15.1215 32.4181 15.9799 32.0625 16.875 32.0625H20.25V38.8125ZM17.7188 25.3125C17.2181 25.3125 16.7287 25.164 16.3125 24.8859C15.8962 24.6078 15.5718 24.2124 15.3802 23.7499C15.1886 23.2874 15.1385 22.7784 15.2361 22.2874C15.3338 21.7964 15.5749 21.3454 15.9289 20.9914C16.2829 20.6374 16.7339 20.3963 17.2249 20.2986C17.7159 20.201 18.2249 20.2511 18.6874 20.4427C19.1499 20.6343 19.5453 20.9587 19.8234 21.375C20.1015 21.7912 20.25 22.2806 20.25 22.7812C20.25 23.4526 19.9833 24.0964 19.5086 24.5711C19.0339 25.0458 18.3901 25.3125 17.7188 25.3125ZM30.375 38.8125H23.625V32.0625H30.375V38.8125ZM37.125 38.8125H33.75V32.0625H37.125C38.0201 32.0625 38.8785 32.4181 39.5115 33.051C40.1444 33.684 40.5 34.5424 40.5 35.4375C40.5 36.3326 40.1444 37.191 39.5115 37.824C38.8785 38.4569 38.0201 38.8125 37.125 38.8125Z"/></svg>';
  var FAB_CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;color:#fff"><polyline points="6 9 12 15 18 9"/></svg>';

  function syncFabIcon(sh) {
    var icon = sh.querySelector('.bpFabIcon');
    var wc = sh.querySelector('.bpWebchat') || sh.querySelector('.bpFABWebchat');
    if (!icon || !wc) return;
    var isOpen = wc.classList.contains('bpOpen');
    /* re-assert by the rendered viewBox, not a flag — Botpress re-renders the
       icon and wipes our content, which left a stale chevron when closed */
    var svg = icon.querySelector('svg');
    var curVB = svg ? svg.getAttribute('viewBox') : null;
    var wantVB = isOpen ? '0 0 24 24' : '0 0 54 54';
    if (curVB !== wantVB) {
      icon.innerHTML = isOpen ? FAB_CHEVRON : FAB_BOT;
      icon.setAttribute('data-achord-fab', isOpen ? 'open' : 'closed');
    }
    /* when the chat is open, mute the FAB to grey so it doesn't pull focus */
    var fab = sh.querySelector('.bpFab');
    if (fab) {
      if (isOpen) fab.classList.add('achord-fab-open');
      else fab.classList.remove('achord-fab-open');
    }
  }

  /* ============================================================ */
  /*  Welcome panel — injected outside mlc, removed on first      */
  /*  user message, rebuilt after restart                          */
  /* ============================================================ */
  function userHasMsg(sh) {
    return !![].slice.call(sh.querySelectorAll('.bpMessageContainer')).find(function (c) {
      return !!c.querySelector('.bpMessageBlocksBubble') && !c.querySelector('.bpMessageAvatarContainer');
    });
  }

  function sendChip(sh, text) {
    /* Try Botpress public API first (no textarea flash).
       NOTE: sendMessage(text) is the correct webchat v3 method — it renders a
       user bubble and triggers the bot. sendEvent({type:'text'}) does NOT
       deliver a user message (bot ignores it), so it must not be used here. */
    try {
      if (window.botpress && typeof window.botpress.sendMessage === 'function') {
        window.botpress.sendMessage(text);
        return;
      }
      if (window.botpress && typeof window.botpress.sendText === 'function') {
        window.botpress.sendText(text);
        return;
      }
    } catch (e) {}
    /* Fallback: hide textarea during send to prevent text flash */
    var ta = sh.querySelector('textarea.bpComposerInput, .bpComposer textarea, .bpComposer input');
    if (!ta) return;
    var proto = ta.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    var origVisibility = ta.style.visibility;
    ta.style.visibility = 'hidden';
    ta.focus();
    setter.call(ta, text);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(function () {
      var sb = sh.querySelector('.bpComposerSendButton');
      if (sb && ta.value === text) sb.click();
      setTimeout(function () { ta.style.visibility = origVisibility || ''; }, 80);
    }, 40);
  }

  function buildWelcome(sh) {
    var c = document.createElement('div'); c.className = 'achord-w';
    var txt = document.createElement('div'); txt.className = 'achord-wtxt';
    var t = document.createElement('p'); t.className = 'achord-wt'; t.textContent = WT; txt.appendChild(t);
    var p = document.createElement('p'); p.className = 'achord-wp'; p.textContent = WP; txt.appendChild(p);
    c.appendChild(txt);
    var d = document.createElement('div'); d.className = 'achord-wsep'; c.appendChild(d);
    var ws = document.createElement('div'); ws.className = 'achord-ws';
    var hd = document.createElement('p'); hd.className = 'achord-ch'; hd.textContent = CH; ws.appendChild(hd);
    var su = document.createElement('p'); su.className = 'achord-cs'; su.textContent = CS; ws.appendChild(su);
    c.appendChild(ws);
    var w = document.createElement('div'); w.className = 'achord-wc';
    CHIPS.forEach(function (x) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'achord-wcb'; b.textContent = x;
      b.addEventListener('click', function () {
        if (b.classList.contains('achord-wcb-selected') || b.classList.contains('achord-wcb-disabled')) return;
        /* mark this chip as selected, disable all others */
        var allChips = w.querySelectorAll('.achord-wcb');
        [].forEach.call(allChips, function (chip) {
          if (chip !== b) chip.classList.add('achord-wcb-disabled');
        });
        b.classList.add('achord-wcb-selected');
        c.setAttribute('data-chip-selected', '1');
        sendChip(sh, x);
      });
      w.appendChild(b);
    });
    c.appendChild(w);
    return c;
  }

  function manageWelcome(sh) {
    var mlc = sh.querySelector('.bpMessageListContainer');
    if (!mlc) return;
    /* host = the scrollable content, so the welcome scrolls up WITH the dialog
       instead of staying pinned above it */
    var host = mlc.querySelector('.bpMessageListViewport') || mlc;
    /* clean up any stale copy placed as a sibling of mlc (pre-22.4.2 layout) */
    var container = mlc.parentElement;
    if (container) {
      var stale = container.querySelector(':scope > .achord-w');
      if (stale) stale.remove();
    }
    var existing = host.querySelector('.achord-w');
    if (userHasMsg(sh)) {
      /* if a chip was clicked, keep welcome visible — only remove on restart.
         mark it 'consumed' so a later restart (msg list cleared) rebuilds fresh */
      if (existing && existing.getAttribute('data-chip-selected') === '1') {
        existing.setAttribute('data-consumed', '1');
        return;
      }
      /* if user typed manually (no chip), remove welcome */
      if (existing) existing.remove();
      return;
    }
    /* no user message: a fresh or just-restarted conversation */
    if (existing) {
      /* welcome from a finished conversation (chip used + msg sent) is stale —
         rebuild it so 'שיחה חדשה' resets the chips. a freshly-clicked chip whose
         message hasn't landed yet is NOT consumed, so it's left intact */
      if (existing.getAttribute('data-consumed') === '1') existing.remove();
      else return;
    }
    var w = buildWelcome(sh);
    host.insertBefore(w, host.firstChild);
  }

  /* ============================================================ */
  /*  Localization (Botpress dialog strings → Hebrew)             */
  /* ============================================================ */
  var L = {
    'Create New Conversation': 'התחלת שיחה חדשה',
    'New conversation': 'שיחה חדשה',
    'New Conversation': 'שיחה חדשה',
    'Cancel': 'ביטול',
    'Yes': 'כן',
    'No': 'לא',
    'Confirm': 'אישור',
    'Restart Conversation': 'שיחה חדשה',
    'Today': 'היום',
    'Yesterday': 'אתמול',
    'Delivered': 'נשלח'
  };
  function localize(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var v = n.nodeValue; if (!v) return;
      var tr = v.trim();
      if (L[tr]) n.nodeValue = v.replace(tr, L[tr]);
    });
  }

  /* ============================================================ */
  /*  Main run loop                                               */
  /* ============================================================ */
  function run() {
    var sh = getShadow();
    if (!sh) return;
    cleanupOldStyles(sh);
    injectStyle(sh, 'ac-v22-base', BASE_CSS);
    injectStyle(sh, 'ac-v22-msg', MSG_CSS);
    injectStyle(sh, 'ac-v22-welcome-css', WELCOME_CSS);
    injectStyle(sh, 'ac-v22-fix', FIX_CSS);
    applyExpand(sh);
    injectAvatar(sh);
    injectExpandButton(sh);
    swapNativeIcons(sh);
    syncFabIcon(sh);
    manageWelcome(sh);
    localize(sh);
    localize(document.body);
  }

  /* Poll + observe */
  var ticks = 0;
  var iv = setInterval(function () {
    run();
    if (++ticks > 600) clearInterval(iv);
  }, 400);

  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', function () {
    var sh = getShadow();
    if (sh) { applyExpand(sh); injectExpandButton(sh); }
  });

  /* Mark window for debugging */
  try { window.__achordInjectVersion = VERSION; } catch (e) {}
  if (window.console && console.log) console.log('[achord] inject v' + VERSION + ' loaded');
})();
