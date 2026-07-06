/*!
 * Achord Bot — Custom Webchat Injection
 * Version: 22.0.0
 * Loads inside Botpress webchat shadow DOM running on Framer page.
 * Served via jsDelivr from GitHub: replaces all 4-5 custom-code blocks.
 */
(function () {
  'use strict';

  var VERSION = '22.5.53';
  var F = "font-family:'Heebo',sans-serif";

  /* ============================================================ */
  /*  Fresh chat on every new page entry (v22.5.17).               */
  /*  The Botpress webchat loader (cdn.botpress.cloud/webchat/...)  */
  /*  loads BEFORE this script and restores the saved conversation */
  /*  from localStorage, so clearing it on load is too late — the   */
  /*  old chat is already rendered. Instead we wipe Botpress's      */
  /*  webchat storage on pagehide (when leaving the page), so the   */
  /*  NEXT entry always boots on clean storage and Botpress opens a */
  /*  fresh conversation. Order-independent: no Framer script-order */
  /*  change needed. Add ?reset=1 to the URL to force-wipe now.     */
  /* ============================================================ */
  (function freshChatOnEntry() {
    try {
      var wipeBpStorage = function () {
        try {
          for (var i = localStorage.length - 1; i >= 0; i--) {
            var k = localStorage.key(i);
            if (k && /^bp-webchat|botpress/i.test(k)) localStorage.removeItem(k);
          }
        } catch (e) {}
      };
      /* clear when leaving → the next entry starts fresh */
      window.addEventListener('pagehide', wipeBpStorage);
      window.addEventListener('beforeunload', wipeBpStorage);
      /* manual override for the current load */
      if (/[?&]reset=1\b/.test(location.search)) wipeBpStorage();
    } catch (e) { /* never break injection over reset failure */ }
  })();


  /* ============================================================ */
  /*  CSS — base (chat structure, header, fab)                    */
  /* ============================================================ */
  var BASE_CSS = `:host,.bpWebchat,.bpFABWebchat{--ac-p:#FF8127;--ac-d:#EC854B;--ac-c:#FFFCF1;--ac-id:#F4C5AA;--ac-bf:#F0E8D8}
.bpFabWrapper.bpFabWrapper{bottom:var(--ac-fab-b,80px)!important;right:24px!important;left:auto!important;z-index:9999!important;transition:none!important}
.bpFab.bpFab{background:#494949!important;box-shadow:0 6px 18px rgba(0,0,0,.25)!important;width:44px!important;height:44px!important;transition:none!important}
.bpFab [class*="Badge"],.bpFab [class*="Unread"]{display:none!important}
.bpFab .bpFabIcon>*{opacity:0!important}
.bpWebchat.bpWebchat,.bpFABWebchat.bpFABWebchat{right:24px!important;left:auto!important;bottom:160px!important;top:auto!important;width:380px!important;height:600px!important;max-height:calc(100vh - 220px)!important;z-index:10000!important;border-radius:17.516px!important;overflow:hidden!important;box-shadow:0 13.137px 35.032px rgba(73,73,73,.12)!important;border:1.095px solid #E8DFCF!important;box-sizing:border-box!important}
.bpContainer{background:var(--ac-c)!important;width:100%!important;height:100%!important;box-shadow:none!important;border-radius:17.516px!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}
.bpWebchat:not(.bpOpen),.bpFABWebchat:not(.bpOpen){display:none!important;visibility:hidden!important}
.bpWebchat.achord-side,.bpFABWebchat.achord-side{right:24px!important;top:120px!important;bottom:160px!important;width:380px!important;height:auto!important;max-height:calc(100vh - 280px)!important}
.bpHeader,.bpHeaderContainer{background:var(--ac-d)!important;color:#fff!important;padding:0!important;border-bottom:1.1px solid var(--ac-bf)!important;direction:rtl!important;position:relative!important;flex-shrink:0!important}
.bpHeaderContentContainer{display:flex!important;direction:rtl!important;align-items:center!important;gap:5.5px!important;padding:15.4px 39.4px 15.4px 17.6px!important;background:transparent!important;border:none!important;width:100%!important;box-sizing:border-box!important}
.bpHeaderContentTitle{font-size:17.6px!important;font-weight:600!important;color:var(--ac-id)!important;${F}!important;text-align:right!important;flex:1!important;margin:0!important;line-height:1.37!important;order:2!important;padding:0!important}
.bpHeaderContentTitle::after,.bpHeaderAvatar,.bpHeaderContentAvatarContainer,.bpHeaderContentDescription,.bpMessageListMarqueeContainer,.bpHeaderConversationHistoryButton{display:none!important}
[class*="bpHeaderExpanded"]{display:none!important}
.bpHeaderContentContainer,.bpHeaderContentTitle{cursor:default!important;pointer-events:none!important}
.bpHeaderContentActionsContainer{pointer-events:auto!important}
.bpHeaderContentActionsContainer{display:flex!important;direction:rtl!important;gap:2px!important;align-items:center!important;order:3!important}
.bpHeaderContentActionsIcons{color:#fff!important;cursor:pointer!important;border-radius:6px!important;width:12px!important;height:12px!important;padding:6px!important;stroke-width:2!important}
.bpHeaderContentActionsIcons[aria-label*="Close" i]{display:flex!important;width:25px!important;height:25px!important;padding:6px!important;color:#fff!important;background:rgba(255,252,241,.26)!important;border-radius:6px!important;box-sizing:border-box!important;stroke-width:1.8!important;cursor:pointer!important;order:3!important}
.bpHeaderContentActionsIcons[aria-label*="Close" i]:hover{background:rgba(255,255,255,.36)!important}
.bpHeaderContentActionsIcons[aria-label*="Restart" i]{width:25px!important;height:25px!important;padding:6px!important;stroke-width:1.8!important;color:#fff!important;background:rgba(255,252,241,.26)!important;border-radius:6px!important;box-sizing:border-box!important;order:1!important}
.bpHeaderContentActionsIcons:hover{background:rgba(255,255,255,.22)!important}
.achord-bot-av{width:41px!important;height:38px!important;background:transparent!important;border:none!important;border-radius:0!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#fff!important;flex-shrink:0!important;order:1!important;overflow:visible!important}
.achord-bot-av svg{width:41px!important;height:38px!important;opacity:.54!important;overflow:visible!important}
.achord-expand-btn{color:#fff!important;width:24.5px!important;height:24.5px!important;cursor:pointer!important;border-radius:6.13px!important;background:rgba(255,252,241,.26)!important;border:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;${F}!important;font-size:23px!important;line-height:1!important;padding:0!important;order:2!important}
.achord-expand-btn:hover{background:rgba(255,252,241,.42)!important}
@media (max-width:480px){.bpWebchat.bpWebchat,.bpFABWebchat.bpFABWebchat{width:calc(100vw - 24px)!important;right:12px!important;top:12px!important;bottom:calc(var(--ac-fab-b,20px) + 70px)!important;height:auto!important;max-height:none!important}.bpWebchat.achord-side,.bpFABWebchat.achord-side{width:calc(100vw - 24px)!important;right:12px!important;top:12px!important;bottom:calc(var(--ac-fab-b,20px) + 70px)!important}.achord-expand-btn{display:none!important}
/* v22.5.34 — FAB near the bottom (positionFab keeps it above any sticky bar / the
   Made-in-Framer badge), full opacity, 56px. While the chat is open the FAB shows
   a collapse chevron; tapping it closes the chat (Botpress native toggle). */
.bpFabWrapper.bpFabWrapper{bottom:var(--ac-fab-b,20px)!important;right:24px!important;left:auto!important}
.bpFab.bpFab{width:44px!important;height:44px!important;opacity:1!important}
.bpFab.achord-fab-open .bpFabIcon>*{opacity:0!important}
.bpFab.achord-fab-open .bpFabIcon{background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2024%2024'%20fill%3D'none'%20stroke%3D'%23ffffff'%20stroke-width%3D'3'%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3Cpolyline%20points%3D'6%209%2012%2015%2018%209'%2F%3E%3C%2Fsvg%3E")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:24px 24px!important}
/* Backdrop: darker dim + blur for stronger focus. v22.5.52 — tap-to-close:
   tapping the dimmed area outside the chat closes the bot (was decorative). */
.achord-mobile-backdrop{position:fixed!important;inset:0!important;background:rgba(18,11,3,.66)!important;-webkit-backdrop-filter:blur(4px) saturate(1.05)!important;backdrop-filter:blur(4px) saturate(1.05)!important;z-index:9998!important;opacity:0!important;pointer-events:none!important;transition:opacity .22s ease!important}
.achord-mobile-backdrop.is-open{opacity:1!important;pointer-events:auto!important;cursor:pointer!important}}`;

  /* ============================================================ */
  /*  CSS — messages, composer, scroll button                     */
  /* ============================================================ */
  var MSG_CSS = `.bpAvatar,[class*="MessageAvatar"]{background:#FF8127!important;color:transparent!important;font-size:0!important}
.bpAvatar *,[class*="MessageAvatar"] *{color:transparent!important;font-size:0!important;background:transparent!important}
.bpMessageAvatarContainer{display:none!important}
.bpMessageList,.bpMessageBlocksContainer{background:#FFFCF1!important}
.bpMessageListViewport{padding-right:28px!important;padding-left:28px!important;gap:15px!important;direction:rtl!important;padding-top:24px!important;padding-bottom:24px!important;justify-content:flex-start!important}
.bpMessageListContainer{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;scroll-behavior:smooth!important}
.bpMessageContainer:not(:has(>.bpMessageAvatarContainer)):not(:has(.bpDateSeparator)) .bpMessageBlocksBubble{background:#EC854B!important;color:#fff!important;border:none!important;border-radius:15.326px!important;border-bottom-right-radius:4.379px!important;padding:10.947px 15.326px!important;max-width:82%!important}
.bpMessageContainer:not(:has(>.bpMessageAvatarContainer)):not(:has(.bpDateSeparator)) .bpMessageBlocksBubble *{color:#fff!important}
.bpMessageContainer:not(:has(>.bpMessageAvatarContainer)):not(:has(.bpDateSeparator)){justify-content:flex-end!important}
.bpMessageContainer:has(>.bpMessageAvatarContainer) .bpMessageBlocksBubble{background:#FFF9F4!important;color:#6F5C45!important;border:1.095px solid #E8DFCF!important;border-radius:15.326px!important;border-bottom-left-radius:4.379px!important;padding:10.947px 15.326px!important;max-width:82%!important}
.bpMessageContainer:has(>.bpMessageAvatarContainer) .bpMessageBlocksBubble *{color:#6F5C45!important}
.bpMessageContainer:has(>.bpMessageAvatarContainer){flex-direction:row!important;justify-content:flex-start!important}
.bpMessageBlocksBubble,.bpMessageBlocksBubble *{direction:rtl!important;text-align:right!important;unicode-bidi:plaintext!important;${F}!important}
.bpMessageBlocksBubble p{margin-bottom:10px!important;font-size:16px!important;line-height:1.45!important;font-weight:400!important}
.bpMessageBlocksBubble p:last-child{margin-bottom:0!important}
.bpMessageBlocksBubble p:has(>strong:first-child){margin-bottom:8px!important}
.bpMessageBlocksBubble p:last-child{margin-bottom:0!important}
.bpMessageList [class*="Date"],.bpMessageList [class*="Time"]{color:#A89B85!important;font-size:12px!important;${F}!important}
.bpComposer,.bpComposerContainer{background:#FFFCF1!important;border:none!important;border-top:1.095px solid #F0E8D8!important;border-radius:0!important;padding:0!important;margin:0!important;width:100%!important;flex-shrink:0!important;outline:none!important;box-shadow:none!important;overflow:visible!important}
.bpComposerContainer>div{display:flex!important;direction:rtl!important;flex-direction:row!important;align-items:center!important;gap:0!important;padding:11px 15.326px 18px!important;outline:none!important;box-shadow:none!important;border:none!important;position:relative!important}
.bpComposer:focus-within,.bpComposer *:focus,.bpComposer *:focus-visible,.bpComposerContainer:focus-within,.bpComposerContainer *:focus,.bpComposerContainer *:focus-visible,.bpComposerContainer>div:focus-within{outline:none!important;outline-color:transparent!important;outline-width:0!important;outline-offset:0!important;box-shadow:none!important;border-color:#E8DFCF!important}
.bpComposerInput,textarea.bpComposerInput{background:#FFF9F4!important;color:#1F1A14!important;border:1.095px solid #E8DFCF!important;border-radius:1093.642px!important;padding:9.853px 15.326px!important;font-size:15.326px!important;direction:rtl!important;text-align:right!important;${F}!important;line-height:24.084px!important;flex:1 1 auto!important;width:auto!important;min-width:0!important;outline:none!important;outline-color:transparent!important;box-shadow:none!important;resize:none!important;min-height:42px!important;max-height:120px!important;overflow-y:auto!important;margin-left:60px!important;margin-right:0!important;margin-inline-start:0!important;margin-inline-end:60px!important}
.bpComposerInput:focus,.bpComposerInput:focus-visible,textarea.bpComposerInput:focus{outline:none!important;outline-color:transparent!important;box-shadow:none!important;border:1.095px solid #E8DFCF!important;border-color:#E8DFCF!important;background:#FFF9F4!important}
.bpComposerInput::placeholder{color:#A89B85!important;font-size:15.326px!important;${F}!important}
.bpComposerSendButton{background-color:#FF8127!important;background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2017%208'%20fill%3D'none'%20stroke%3D'%23ffffff'%20stroke-width%3D'1.4'%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3Cpath%20d%3D'M15%204H2M2%204L5.4%201.5M2%204L5.4%206.5'%2F%3E%3C%2Fsvg%3E")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:17px auto!important;color:#fff!important;border-radius:1093.642px!important;width:39.411px!important;height:39.411px!important;min-width:39.411px!important;min-height:39.411px!important;flex-shrink:0!important;opacity:1!important;visibility:visible!important;display:flex!important;align-items:center!important;justify-content:center!important;align-self:center!important;padding:0!important;position:absolute!important;left:15.326px!important;right:auto!important;top:50%!important;transform:translateY(-50%)!important;margin:0!important}
svg.bpComposerSendButton{padding:11px!important;box-sizing:border-box!important}
svg.bpComposerSendButton *{stroke:#fff!important}
svg.bpComposerSendButton path{fill:none!important;stroke:#fff!important;stroke-width:1.4!important;stroke-linecap:round!important;stroke-linejoin:round!important}
.bpComposerSendButton[disabled],.bpComposerSendButton:disabled,.bpComposerSendButton[aria-disabled="true"]{background-color:#FF8127!important;opacity:.45!important;display:flex!important;visibility:visible!important;position:absolute!important;left:15.326px!important;right:auto!important;top:50%!important;transform:translateY(-50%)!important;pointer-events:none!important}
.bpComposerVoiceButton,.bpComposerContainer [class*="Voice" i],.bpComposerContainer [class*="Mic" i],.bpComposerContainer svg[aria-label*="Voice" i],.bpComposerContainer svg[aria-label*="Mic" i]{display:none!important}
.bpComposerContainer [class*="lucide-loader" i]:not(.bpComposerInputLoader),.bpComposerContainer [class*="loader-circle" i]:not(.bpComposerInputLoader),.bpComposerContainer [class*="spinner" i]:not(.bpComposerInputLoader),.bpComposerContainer [class*="loading" i]:not(.bpComposerInputLoader){display:none!important}
/* v22.5.15 — during "thinking", NO spinner and NO flash. We paint the send-arrow
   as a CSS background-image on the loader and hide its inner spinner paths, so the
   identical thin orange arrow appears the instant the loader mounts — CSS applies
   before first paint, so a spinner can never be shown for even one frame. (The JS
   swapLoaderToArrow still runs as a harmless fallback; its output is display:none'd.) */
.bpComposerContainer .bpComposerInputLoader,.bpComposerContainer .lucide-loader.bpComposerInputLoader{background-color:#FF8127!important;background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2017%208'%20fill%3D'none'%20stroke%3D'%23ffffff'%20stroke-width%3D'1.4'%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3Cpath%20d%3D'M15%204H2M2%204L5.4%201.5M2%204L5.4%206.5'%2F%3E%3C%2Fsvg%3E")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:17px auto!important;color:#fff!important;border-radius:1093.642px!important;width:39.411px!important;height:39.411px!important;min-width:39.411px!important;min-height:39.411px!important;flex-shrink:0!important;opacity:1!important;visibility:visible!important;display:flex!important;align-items:center!important;justify-content:center!important;align-self:center!important;box-sizing:border-box!important;position:absolute!important;left:15.326px!important;right:auto!important;top:50%!important;transform:translateY(-50%)!important;margin:0!important;animation:none!important}
/* v22.5.16 — idle send-arrow uses the SAME CSS background-image as the thinking
   loader (not an inline SVG), so idle and thinking are byte-identical: same image,
   same 17px size, same rendering. Hide both elements' inner SVG paths. */
.bpComposerContainer .bpComposerInputLoader>*,.bpComposerContainer svg.bpComposerSendButton>*{display:none!important}
.bpComposerFooter,[class*="ComposerFooter"]{display:none!important}
[class*="ScrollToBottom" i],[aria-label*="scroll" i]{right:auto!important;left:14px!important;bottom:78px!important;background:rgba(255,255,255,.85)!important;color:#A89B85!important;border:1px solid #E8DFCF!important;width:26px!important;height:26px!important;border-radius:50%!important;opacity:.6!important;box-shadow:0 2px 6px rgba(73,73,73,.08)!important}`;

  /* ============================================================ */
  /*  CSS — welcome panel                                         */
  /* ============================================================ */
  var WELCOME_CSS = `.achord-w{display:flex;flex-direction:column;align-items:stretch;padding:28.463px 28px 16px;margin:0 -28px;box-sizing:border-box;direction:rtl;${F};gap:12px;background:#FFFCF1;flex-shrink:0;border-radius:0;border-bottom:1px solid #F0E8D8}
.achord-wtxt{display:flex;flex-direction:column;align-items:stretch;gap:10.947px;padding:0 8px 0 8px;width:100%;box-sizing:border-box;direction:rtl}
.achord-wt{font-size:16.5px;line-height:1.4;color:#6F5C45;font-weight:500;margin:0;text-align:right;direction:rtl;unicode-bidi:plaintext}
.achord-wp{font-size:16px;line-height:1.4;color:#6F5C45;font-weight:500;margin:0;text-align:right;direction:rtl;unicode-bidi:plaintext;word-break:normal;overflow-wrap:break-word}
.achord-wsep{width:19px;height:6px;background:url("data:image/svg+xml,%3Csvg%20width%3D'19'%20height%3D'6'%20viewBox%3D'0%200%2019%206'%20fill%3D'none'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20d%3D'M0%205.58594L3.72211%200.00277944L18.6105%200.00277879L14.8884%205.58594L0%205.58594Z'%20fill%3D'%23F4C5AA'%2F%3E%3C%2Fsvg%3E")no-repeat center;background-size:19px 6px;align-self:center;margin:6px 0}
.achord-ws{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%}
.achord-ch{font-size:16.5px;font-weight:700;color:#6F5C45;text-align:center;margin:0;line-height:1.55}
.achord-cs{font-size:15.5px;color:#6F5C45;text-align:center;margin:0;line-height:1.55;max-width:311px;padding:0 10px;box-sizing:border-box}
.achord-wc{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;padding:10px 14px;direction:rtl;width:100%;box-sizing:border-box}
.achord-wcb{padding:6px 13px;border:1.095px solid #FFA768;background:#fff;color:#D6722C;border-radius:1093.642px;font-size:13px;line-height:20.8px;${F};font-weight:500;cursor:pointer;transition:background .15s ease,transform .12s ease,opacity .15s ease;white-space:nowrap}
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
  /*  CSS — bot FAB matched 1:1 to the site's contact button       */
  /*  (v22.5.47). The existing Framer contact button is a 44x44    */
  /*  #494949 rounded-square (radius 8) with a white line icon —   */
  /*  measured live on the site. The bot FAB adopts the exact same */
  /*  spec so the two read as one family; positionFab() stacks the */
  /*  bot directly above the contact button in the same column.    */
  /*  v22.5.51 — FAB icon replaced with the aChord robot logo mark */
  /*  (Vector.svg from Yoni, white @53% like the header avatar).   */
  /* ============================================================ */
  var BOT_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 38" fill="none"><path d="M40.5354 24.2738C40.4871 23.7047 40.1494 23.2841 39.7393 22.9625C39.1 22.6656 38.7622 22.6409 38.0747 22.6285C37.8696 22.6285 37.0253 22.6656 36.8926 22.5914V22.48L36.9046 22.0842C36.8805 20.0678 35.9638 17.3092 34.9988 15.701C33.5634 13.3259 31.4284 11.4703 28.9074 10.4064C28.3646 10.1961 27.8218 10.0106 27.2669 9.84975C27.0015 9.7879 26.8085 9.76316 26.5432 9.67656L26.4949 9.65182C26.0124 9.44152 22.8883 9.39204 22.1404 9.37967C22.2007 8.98381 22.2007 7.49935 22.1525 7.09112C22.249 6.96742 22.454 6.81897 22.5867 6.70764C23.0933 6.29941 23.3949 5.90355 23.6603 5.2974C24.0704 4.35724 24.0824 3.281 23.7206 2.3161C23.2863 1.2275 22.5867 0.658454 21.5494 0.200745L21.3805 0.138893C20.6206 -0.0342945 20.3793 -0.0342945 19.6073 0.0770401C19.0404 0.200745 18.763 0.32445 18.2564 0.608972C17.9186 0.881124 17.4965 1.2275 17.2673 1.59861C16.821 2.3161 16.6159 3.04596 16.6159 3.76345C16.6159 4.91391 17.1708 6.01489 18.184 6.86845C18.3287 6.99216 18.4252 7.02927 18.4373 7.2272C18.5097 7.94469 18.4373 8.67455 18.4856 9.39204C17.7859 9.40441 15.3976 9.39204 14.8186 9.58997C13.3953 9.7013 11.3326 10.5054 10.1023 11.26H10.0902C6.97815 13.1898 4.97581 15.8371 4.07114 19.5235C3.84196 20.4637 3.69721 21.676 3.75752 22.6409C2.59954 22.6285 1.00733 22.3811 0.331838 23.5563C0.283589 23.6305 0.211215 23.8037 0.162966 23.8779C-0.066217 24.3851 -0.0420925 30.2364 0.162966 30.8054H0.175028C0.307713 31.2507 0.597208 31.6219 0.995263 31.8445C1.14001 31.9311 1.23651 31.9559 1.40538 31.9806H1.41744C1.92406 32.1662 3.17853 32.1291 3.70927 32.0672C3.69721 33.094 3.64896 34.0217 3.89021 35.0361C3.89021 35.432 4.52951 36.3598 4.80694 36.6443C5.73574 37.5968 6.79721 37.77 8.06375 37.77H30.6323C32.3813 37.77 34.456 38.0545 35.7949 36.6567C36.8805 35.5186 36.8926 34.2939 36.9046 32.7971V32.0796C37.3871 32.1167 38.5572 32.1414 39.0155 32.0425C40.3424 31.9064 40.6198 30.4838 40.5836 29.3704C40.5354 27.6757 40.6681 25.9562 40.5354 24.2738ZM9.00461 21.7131H9.01667C9.01667 21.7131 8.98049 21.7378 8.96842 21.7626C8.98049 21.7378 8.99255 21.7254 9.00461 21.7131ZM14.5774 29.3828C14.0949 29.7168 13.54 29.9642 12.961 30.0879C12.6474 30.1498 12.3338 30.1869 12.0202 30.1869C11.0914 30.1869 10.1747 29.9024 9.40267 29.3457C8.498 28.7024 7.84663 27.7499 7.5692 26.6489C7.30383 25.585 7.40033 24.4593 7.8587 23.4697C8.51006 22.0594 9.80072 21.0574 11.3206 20.8224C11.5618 20.7853 11.791 20.7729 12.0202 20.7729C13.8898 20.7729 15.5906 21.9234 16.2902 23.7542C17.0743 25.8077 16.3626 28.1457 14.5774 29.3828ZM18.4976 6.6829C18.4976 6.6829 18.4614 6.6829 18.4494 6.70764C18.4614 6.6829 18.4856 6.6829 18.4976 6.67053V6.6829ZM22.0198 7.3509V7.31379C22.0198 7.31379 22.0198 7.31379 22.0319 7.28905C22.0198 7.30142 22.0198 7.32616 22.0198 7.3509ZM25.9762 29.6178C25.9762 29.6178 25.9762 29.6055 25.9642 29.6055H25.9762C25.9762 29.6055 26.0365 29.5807 26.0607 29.5807C26.0365 29.5931 26.0124 29.6055 25.9762 29.6178ZM32.1762 28.4179C32.1159 28.4797 32.0556 28.554 31.9953 28.6282C31.1992 29.5312 30.0895 30.0879 28.9074 30.1745C28.5334 30.1992 28.1595 30.1745 27.7976 30.1127C27.5443 30.0755 27.291 30.0013 27.0498 29.9147C26.7844 29.8158 26.519 29.6921 26.2657 29.5436C25.4334 29.0488 24.77 28.2818 24.384 27.3788C24.3116 27.218 24.2513 27.0571 24.2031 26.884C23.7688 25.449 24.0221 23.8903 24.8906 22.678C25.5661 21.7254 26.5673 21.0822 27.6891 20.8471C29.5828 20.4637 31.5128 21.3296 32.514 23.0244C33.5151 24.7191 33.3825 26.8716 32.1762 28.4179Z" fill="#F8F8F8" fill-opacity="0.53"/></svg>';
  var BOT_ICON_URI = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(BOT_ICON_SVG);
  var FAB_CSS = `.bpFab.bpFab,.bpFab .bpFabContainer{background:#494949!important;border-radius:8px!important}
.bpFab.bpFab{width:44px!important;height:44px!important;box-shadow:0 6px 18px rgba(0,0,0,.25)!important}
.bpFab .bpFabIcon{background-image:url("${BOT_ICON_URI}")!important;background-size:27px 25px!important;background-repeat:no-repeat!important;background-position:center!important}
.bpFabWrapper .bpUnreadMessage{display:none!important}`;

  /* ============================================================ */
  /*  SVG assets — bot avatar (Asset 1), close ✕, restart ⟲, send ← */
  /* ============================================================ */
  var AVATAR_SVG = '<svg viewBox="-2.5 -2.5 38.65 35.55" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="width:88%;height:88%;display:block"><path fill="currentColor" opacity=".87" d="M33.6,19.62c-.04-.46-.32-.8-.66-1.06-.53-.24-.81-.26-1.38-.27-.17,0-.87.03-.98-.03v-.09s.01-.32.01-.32c-.02-1.63-.78-3.86-1.58-5.16-1.19-1.92-2.96-3.42-5.05-4.28-.45-.17-.9-.32-1.36-.45-.22-.05-.38-.07-.6-.14l-.04-.02c-.4-.17-2.99-.21-3.61-.22.05-.32.05-1.52.01-1.85.08-.1.25-.22.36-.31.42-.33.67-.65.89-1.14.34-.76.35-1.63.05-2.41-.36-.88-.94-1.34-1.8-1.71l-.14-.05c-.63-.14-.83-.14-1.47-.05-.47.1-.7.2-1.12.43h0c-.28.22-.63.5-.82.8-.37.58-.54,1.17-.54,1.75,0,.93.46,1.82,1.3,2.51.12.1.2.13.21.29.06.58,0,1.17.04,1.75-.58.01-2.56,0-3.04.16-1.18.09-2.89.74-3.91,1.35h-.01c-2.58,1.56-4.24,3.7-4.99,6.68-.19.76-.31,1.74-.26,2.52-.96-.01-2.28-.21-2.84.74-.04.06-.1.2-.14.26-.19.41-.17,5.14,0,5.6H.14c.11.36.35.66.68.84.12.07.2.09.34.11h.01c.42.15,1.46.12,1.9.07-.01.83-.05,1.58.15,2.4h0c0,.32.53,1.07.76,1.3.77.77,1.65.91,2.7.91h18.71c1.45,0,3.17.23,4.28-.9.9-.92.91-1.91.92-3.12v-.58c.4.03,1.37.05,1.75-.03,1.1-.11,1.33-1.26,1.3-2.16-.04-1.37.07-2.76-.04-4.12ZM12.08,23.75c-.4.27-.86.47-1.34.57-.26.05-.52.08-.78.08-.77,0-1.53-.23-2.17-.68-.75-.52-1.29-1.29-1.52-2.18-.22-.86-.14-1.77.24-2.57.54-1.14,1.61-1.95,2.87-2.14.2-.03.39-.04.58-.04,1.55,0,2.96.93,3.54,2.41.65,1.66.06,3.55-1.42,4.55ZM26.67,22.97c-.05.05-.1.11-.15.17-.66.73-1.58,1.18-2.56,1.25-.31.02-.62,0-.92-.05-.21-.03-.42-.09-.62-.16-.22-.08-.44-.18-.65-.3-.69-.4-1.24-1.02-1.56-1.75-.06-.13-.11-.26-.15-.4-.36-1.16-.15-2.42.57-3.4.56-.77,1.39-1.29,2.32-1.48h0c1.57-.31,3.17.39,4,1.76.83,1.37.72,3.11-.28,4.36Z"/></svg>';

  var CLOSE_PATH = '<path fill="currentColor" d="M8.47088 16.1394L7.85003 15.5186L11.6211 11.7245L7.85003 7.93039L8.47088 7.30954L12.242 11.1036L15.9901 7.30954L16.6109 7.93039L12.8398 11.7245L16.6109 15.5186L15.9901 16.1394L12.242 12.3683L8.47088 16.1394Z"/>';

  var RESTART_PATH = '<path fill="currentColor" d="M13.2821 2.82216V5.70809C13.2821 5.80376 13.2441 5.89552 13.1765 5.96317C13.1088 6.03082 13.0171 6.06883 12.9214 6.06883H10.0354C9.93977 6.06883 9.84802 6.03082 9.78037 5.96317C9.71271 5.89552 9.67471 5.80376 9.67471 5.70809C9.67471 5.61241 9.71271 5.52066 9.78037 5.45301C9.84802 5.38535 9.93977 5.34735 10.0354 5.34735H11.9925L10.1659 3.67591C10.1623 3.67231 10.1587 3.6681 10.1545 3.66449C9.46918 2.97957 8.59724 2.51177 7.6476 2.31953C6.69797 2.12728 5.71274 2.21911 4.81499 2.58355C3.91724 2.94799 3.14678 3.56887 2.59985 4.36864C2.05291 5.16841 1.75376 6.11161 1.73977 7.08041C1.72577 8.0492 1.99754 9.00065 2.52113 9.81589C3.04473 10.6311 3.79693 11.274 4.68378 11.6642C5.57062 12.0545 6.55279 12.1747 7.50758 12.01C8.46237 11.8453 9.34746 11.4029 10.0523 10.738C10.1219 10.6723 10.2147 10.637 10.3104 10.6397C10.4061 10.6425 10.4967 10.6832 10.5624 10.7528C10.6281 10.8224 10.6635 10.9152 10.6607 11.0109C10.658 11.1066 10.6173 11.1972 10.5477 11.2629C9.50027 12.2551 8.11131 12.8065 6.66853 12.8027H6.59157C5.66612 12.7896 4.75804 12.5495 3.94711 12.1034C3.13617 11.6573 2.44721 11.0189 1.94075 10.2442C1.43429 9.46952 1.12584 8.58232 1.04249 7.66054C0.959149 6.73876 1.10346 5.81062 1.46276 4.95767C1.82205 4.10471 2.38532 3.35305 3.10309 2.76873C3.82085 2.1844 4.67114 1.7853 5.57924 1.60648C6.48734 1.42767 7.42546 1.47461 8.31117 1.74319C9.19689 2.01177 10.0031 2.49376 10.6589 3.14683L12.5606 4.8874V2.82216C12.5606 2.72648 12.5986 2.63473 12.6663 2.56708C12.7339 2.49942 12.8257 2.46142 12.9214 2.46142C13.0171 2.46142 13.1088 2.49942 13.1765 2.56708C13.2441 2.63473 13.2821 2.72648 13.2821 2.82216Z"/>';

  /* v22.5.35 — two distinct expand/collapse icons (replaces the rotating ⤢).
     EXPAND_OUT_SVG: shown when chat is in default mode → arrows to corners.
     COLLAPSE_IN_SVG: shown when chat is expanded → arrows to centre. */
  var EXPAND_OUT_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="display:block"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
  var COLLAPSE_IN_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="display:block"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';

  var SEND_ARROW = '<path d="M15 4H2M2 4L5.4 1.5M2 4L5.4 6.5" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>';
  /* v22.5.16 — same arrow as a data-URI for use as a CSS/inline background-image, so
     the idle send button and the thinking loader paint the IDENTICAL arrow (the inline
     SVG path rendered slightly heavier than the loader's background image, causing the
     "thick idle vs thin thinking" mismatch the user saw). */
  var SEND_ARROW_URI = "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2017%208'%20fill%3D'none'%20stroke%3D'%23ffffff'%20stroke-width%3D'1.4'%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3Cpath%20d%3D'M15%204H2M2%204L5.4%201.5M2%204L5.4%206.5'%2F%3E%3C%2Fsvg%3E";

  /* v22.5.44 — custom robot FAB icon restored (white line robot, 28px) via
     .bpFabIcon background-image in BASE_CSS, replacing Botpress's default chat
     bubble so the launcher no longer reads as a generic chat widget. Chosen by
     client/Yoni 2026-06-24 to differentiate the bot from the site contact button.
     On mobile while the chat is open, BASE_CSS overlays a collapse chevron on the
     FAB (higher specificity .achord-fab-open) so it reads as "close".
     Positioning is handled by positionFab(). */

  /* v22.5.46 — bot FAB restyled into the site's black-squircle language (see
     FAB_CSS): dark rounded-square + white robot, to match the existing black
     contact button so the two align as one family. The earlier orange unified
     capsule (v22.5.45) was dropped — the contact button is a separate Framer
     element, so we no longer inject our own contact zone. */

  /* ============================================================ */
  /*  Welcome panel content                                       */
  /* ============================================================ */
  var WT = 'היי! שמחים שבאת...';
  /* v22.5.35 — welcome paragraph narrowed to the model's actual scope (diversity,
     belonging, inter-group dynamics) per client feedback. Removed the casual
     "tirgish chofshi" register. */
  var WP = 'נשמח לעזור לך להעמיק במודל ולמצוא בו כלים רלוונטיים בנושאי גיוון, שייכות ויחסים בין קבוצות בקמפוס.';
  var CH = 'שנכיר?';
  var CS = 'תרצה/י לספר לנו מה הקשר שלך לאקדמיה?';
  /* v22.5.35 — chips rebuilt: gender-inclusive forms, academic/admin staff split,
     "acher" item dropped per client request. 5 items, fits two rows on desktop.
     v22.5.42 — reorder only (no wording change): diversity officer first, then
     admin staff, academic staff, student, interested. Per client (Sahar) 2026-06-17. */
  var CHIPS = ['אני ממונה/ת מגוון', 'חבר/ת סגל מנהלי', 'חבר/ת סגל אקדמי', 'אני סטודנט/ית', 'פשוט מתעניין/ת'];

  /* ============================================================ */
  /*  Expand state                                                */
  /* ============================================================ */
  /* v22.5.40 — storage key bumped to -v24. Expanded mode is now the *forced*
     default on every page load — we never read storage on init, only write during
     the session so toggles persist within the session but reset on refresh. */
  var EXP_KEY = 'achord-exp-v24';
  var MOBILE_W = 480;
  /* v22.5.40 — always start expanded. We deliberately skip the localStorage read on
     init so refresh resets to expanded, no matter what previous toggles set. The write
     still happens in toggleExpand → session-local memory only. */
  var exp = true;

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
    /* v22.5.35 — swap distinct SVG icons per state instead of rotating one glyph.
       Expanded → show "collapse" arrows pointing in; default → show "expand" arrows out. */
    if (!_expandBtn) return;
    _expandBtn.innerHTML = exp ? COLLAPSE_IN_SVG : EXPAND_OUT_SVG;
    /* v22.5.36 — no title attribute → no hover tooltip text. Aria-label stays for a11y. */
    _expandBtn.removeAttribute('title');
    _expandBtn.setAttribute('aria-label', exp ? 'הקטנה' : 'הגדלה');
    _expandBtn.style.transform = '';
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
    if (!sb) return;
    var svg = sb.tagName.toLowerCase() === 'svg' ? sb : sb.querySelector('svg');
    if (!svg) return;
    /* Detect if our arrow is already in place — checking for the unique
       starting coords of SEND_ARROW ('M15 4H2'). If Botpress swapped in
       a loading spinner or up-arrow, our marker is gone and we re-swap. */
    var firstPath = svg.querySelector('path');
    var d = firstPath ? firstPath.getAttribute('d') : '';
    if (d && d.indexOf('M15 4H2') !== -1) return;
    svg.setAttribute('viewBox', '0 0 17 8');
    svg.setAttribute('fill', 'none');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.insertAdjacentHTML('beforeend', SEND_ARROW);
  }

  /* v22.5.12 — while the bot is "thinking", Botpress unmounts the send button
     and mounts a spinner (.bpComposerInputLoader). We don't want a spinner here
     (the chat already shows a typing indicator) — we want the send arrow to stay
     put, unchanged. So we turn the loader into an identical static arrow disc by
     injecting the same SEND_ARROW (the CSS gives it the orange disc + kills the
     spin). Re-asserted on every mutation, same pattern as swapSendButton. */
  function swapLoaderToArrow(sh) {
    var l = sh.querySelector('.bpComposerInputLoader');
    if (!l) return;
    var svg = l.tagName.toLowerCase() === 'svg' ? l : l.querySelector('svg');
    if (!svg) return;
    var firstPath = svg.querySelector('path');
    var d = firstPath ? firstPath.getAttribute('d') : '';
    if (d && d.indexOf('M15 4H2') !== -1) return;
    svg.setAttribute('viewBox', '0 0 17 8');
    svg.setAttribute('fill', 'none');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.insertAdjacentHTML('beforeend', SEND_ARROW);
  }

  function swapNativeIcons(sh) {
    /* v22.5.38 — close swap renders as a CHEVRON-DOWN (semantically: minimize)
       instead of an X (close), since tapping doesn't actually destroy the chat —
       it just collapses it back to the FAB. Stroke-based path; aria-label updated. */
    var close = sh.querySelector('[aria-label*="Close" i]');
    if (close && close.tagName.toLowerCase() === 'svg' && close.getAttribute('data-ac-chev') !== '1') {
      close.setAttribute('viewBox', '0 0 24 24');
      close.setAttribute('fill', 'none');
      close.setAttribute('stroke', 'currentColor');
      close.setAttribute('stroke-width', '2');
      close.setAttribute('stroke-linecap', 'round');
      close.setAttribute('stroke-linejoin', 'round');
      while (close.firstChild) close.removeChild(close.firstChild);
      close.insertAdjacentHTML('beforeend', '<polyline points="6 9 12 15 18 9"/>');
      close.setAttribute('data-ac-chev', '1');
      /* v22.5.40 — leave aria-label as "Close". Changing it to "כווץ" broke the CSS
         selector .bpHeaderContentActionsIcons[aria-label*="Close" i] that styles the
         button visible — the rule stopped matching and the button collapsed to 12px. */
    }
    var restart = sh.querySelector('[aria-label*="Restart" i]');
    if (restart && restart.tagName.toLowerCase() === 'svg') swapIconSvg(restart, '1 1.5 13 12', RESTART_PATH);
    swapSendButton(sh);
    swapLoaderToArrow(sh);
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
  /*  v22.5.32 — Mobile backdrop + bot-open state                 */
  /*  Drag was removed (v22.5.30/31 feature). The FAB is always   */
  /*  visible — closing the bot is exclusively done by tapping it.*/
  /* ============================================================ */

  /* one-time cleanup: wipe stale dragged-FAB position from older versions */
  try { localStorage.removeItem('achord-fab-pos-v22'); } catch (e) {}

  function ensureBackdrop(sh) {
    var bd = sh.querySelector('.achord-mobile-backdrop');
    if (bd) return bd;
    bd = document.createElement('div');
    bd.className = 'achord-mobile-backdrop';
    bd.setAttribute('aria-hidden', 'true');
    /* v22.5.52 — tap on the dimmed area closes the bot (in addition to the FAB). */
    bd.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (window.botpress && typeof window.botpress.close === 'function') {
          window.botpress.close();
          return;
        }
      } catch (err) {}
      var fab = sh.querySelector('.bpFab');
      if (fab) { try { fab.click(); } catch (err2) {} }
    });
    /* Insert as a sibling of the webchat so z-index ordering inside the shadow
       root puts it under the chat (z-index 9998 vs chat 10000). */
    var webchat = sh.querySelector('.bpWebchat') || sh.querySelector('.bpFABWebchat');
    if (webchat && webchat.parentNode) webchat.parentNode.insertBefore(bd, webchat);
    else sh.appendChild(bd);
    return bd;
  }

  function clearLegacyDragStyles(sh) {
    /* If the user previously ran v22.5.30/31 and dragged the FAB, the wrapper
       may still carry inline top/left/data-ac-dragged from that session. CSS
       now controls positioning, so wipe any leftovers. Idempotent. */
    var wrapper = sh.querySelector('.bpFabWrapper');
    if (!wrapper) return;
    if (wrapper.hasAttribute('data-ac-dragged') || wrapper.hasAttribute('data-ac-drag-init')) {
      wrapper.removeAttribute('data-ac-dragged');
      wrapper.removeAttribute('data-ac-drag-init');
    }
    ['top', 'left', 'right', 'bottom'].forEach(function (p) {
      if (wrapper.style.getPropertyValue(p)) wrapper.style.removeProperty(p);
    });
  }

  /* ============================================================ */
  /*  v22.5.52 — site overlay (e.g. the Framer contact window)    */
  /*  When a full-screen Framer overlay opens: (1) dim+blur the   */
  /*  page behind it exactly like the bot's backdrop, (2) hide    */
  /*  the FAB pair so nothing covers the panel or its close ✕,    */
  /*  (3) tapping the dimmed area closes the overlay (Escape +    */
  /*  clicking its close control).                                */
  /* ============================================================ */
  var _siteBd = null;
  function bgAlpha(cs) {
    var m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
    if (!m) return 0;
    var p = m[1].split(',');
    return p.length === 4 ? parseFloat(p[3]) : 1;
  }
  /* a real overlay paints something: its own background, or a large visible
     card/form inside it. Framer's invisible full-screen a11y/status layers
     (transparent, empty) must NOT match — matching one dimmed the whole page
     and swallowed every tap (seen live at z:2147483646). */
  function isPaintedOverlay(el, vw, vh) {
    if (bgAlpha(getComputedStyle(el)) > 0.05) return true;
    var kids = el.querySelectorAll('*');
    for (var i = 0; i < kids.length && i < 80; i++) {
      var k = kids[i];
      var r = k.getBoundingClientRect();
      if (r.width * r.height < vw * vh * 0.12) continue;
      var kcs = getComputedStyle(k);
      if (kcs.display === 'none' || kcs.visibility === 'hidden') continue;
      if (bgAlpha(kcs) > 0.05) return true;
      if (/^(IMG|VIDEO|IFRAME|FORM|INPUT|TEXTAREA)$/.test(k.tagName)) return true;
    }
    return false;
  }
  function findSiteOverlay() {
    var host = document.getElementById('fab-root');
    var main = document.getElementById('main');
    var vw = window.innerWidth, vh = window.innerHeight;
    var els = document.querySelectorAll('body *');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el === host || (host && host.contains(el))) continue;
      if (el === _siteBd) continue;
      if (main && (el === main || el.contains(main))) continue;
      var cn = '' + (el.className || '');
      if (/visually_hidden|sr-only|status_/i.test(cn)) continue;
      if (el.getAttribute('aria-live') || el.getAttribute('role') === 'status') continue;
      var cs = getComputedStyle(el);
      if (cs.position !== 'fixed') continue;
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
      var r = el.getBoundingClientRect();
      if (r.width < vw * 0.8 || r.height < vh * 0.6) continue;
      if (!isPaintedOverlay(el, vw, vh)) continue;
      return el;
    }
    return null;
  }
  function closeSiteOverlay(overlay) {
    /* Escape usually closes Framer overlays */
    try {
      var ev = new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, which: 27, bubbles: true });
      document.dispatchEvent(ev);
      document.body.dispatchEvent(ev);
    } catch (e) {}
    /* also click an explicit close control if the overlay has one */
    try {
      var x = overlay.querySelector('[data-framer-name*="lose" i],[aria-label*="lose" i],[data-framer-name="X"],[data-framer-name="x"]');
      if (x) x.click();
    } catch (e2) {}
  }
  function handleSiteOverlay(sh) {
    var overlay = findSiteOverlay();
    var wrapper = sh.querySelector('.bpFabWrapper');
    if (overlay) {
      /* hide the FAB pair so nothing sits above the panel */
      if (wrapper) setImp(wrapper, 'display', 'none');
      if (_contactEl && document.contains(_contactEl)) setImp(_contactEl, 'display', 'none');
      /* dim backdrop just under the overlay (same look as the bot's) */
      if (!_siteBd || !document.contains(_siteBd)) {
        _siteBd = document.createElement('div');
        _siteBd.className = 'achord-site-backdrop';
        _siteBd.setAttribute('aria-hidden', 'true');
        var s = _siteBd.style;
        s.setProperty('position', 'fixed', 'important');
        s.setProperty('inset', '0', 'important');
        s.setProperty('background', 'rgba(18,11,3,.66)', 'important');
        s.setProperty('-webkit-backdrop-filter', 'blur(4px) saturate(1.05)', 'important');
        s.setProperty('backdrop-filter', 'blur(4px) saturate(1.05)', 'important');
        s.setProperty('cursor', 'pointer', 'important');
        _siteBd.addEventListener('click', function () {
          var ov = findSiteOverlay();
          if (ov) closeSiteOverlay(ov);
        });
      }
      /* keep it painted UNDER the overlay: same parent, previous sibling */
      if (_siteBd.nextSibling !== overlay || _siteBd.parentNode !== overlay.parentNode) {
        overlay.parentNode.insertBefore(_siteBd, overlay);
      }
      var oz = getComputedStyle(overlay).zIndex;
      _siteBd.style.setProperty('z-index', (oz !== 'auto' && !isNaN(parseInt(oz, 10))) ? String(parseInt(oz, 10)) : 'auto', 'important');
    } else {
      if (_siteBd && _siteBd.parentNode) _siteBd.parentNode.removeChild(_siteBd);
      /* restore the FAB pair (unless the bot chat itself hid them elsewhere) */
      if (wrapper && wrapper.style.getPropertyValue('display') === 'none') wrapper.style.removeProperty('display');
      if (_contactEl && document.contains(_contactEl) && _contactEl.style.getPropertyValue('display') === 'none') _contactEl.style.removeProperty('display');
    }
  }

  function syncBotOpenState(sh) {
    clearLegacyDragStyles(sh);
    var bot = sh.querySelector('.bpWebchat, .bpFABWebchat');
    if (!bot) return;
    var isOpen = bot.classList.contains('bpOpen');
    document.body.classList.toggle('achord-bot-open', isOpen);
    /* mark the FAB open so the mobile CSS can swap its icon to a collapse chevron */
    var fab = sh.querySelector('.bpFab');
    if (fab) fab.classList.toggle('achord-fab-open', isOpen);
    if (!isMobile()) {
      var existing = sh.querySelector('.achord-mobile-backdrop');
      if (existing) existing.classList.remove('is-open');
      return;
    }
    var bd = ensureBackdrop(sh);
    if (isOpen) {
      if (!bd.classList.contains('is-open')) {
        requestAnimationFrame(function () { bd.classList.add('is-open'); });
      }
    } else {
      bd.classList.remove('is-open');
    }
  }

  /* ============================================================ */
  /*  Main run loop                                               */
  /* ============================================================ */
  function pinSendButton(sh) {
    /* Hard-pin the send button to the left with inline styles, so Botpress
       can't move/hide it during loading transitions. Inline !important wins
       against most things Botpress might re-apply. */
    var sb = sh.querySelector('.bpComposerSendButton');
    if (!sb) return;
    var s = sb.style;
    s.setProperty('position', 'absolute', 'important');
    s.setProperty('left', '15.326px', 'important');
    s.setProperty('right', 'auto', 'important');
    s.setProperty('top', '50%', 'important');
    s.setProperty('transform', 'translateY(-50%)', 'important');
    s.setProperty('display', 'flex', 'important');
    s.setProperty('visibility', 'visible', 'important');
    s.setProperty('width', '39.411px', 'important');
    s.setProperty('height', '39.411px', 'important');
    s.setProperty('background-color', '#FF8127', 'important');
    /* paint the arrow as an inline background-image (identical to the loader) and hide
       the inner SVG path, so idle and thinking show the exact same arrow. Inline wins
       over Botpress's re-renders. */
    s.setProperty('background-image', 'url("' + SEND_ARROW_URI + '")', 'important');
    s.setProperty('background-repeat', 'no-repeat', 'important');
    s.setProperty('background-position', 'center', 'important');
    s.setProperty('background-size', '17px auto', 'important');
    s.setProperty('border-radius', '9999px', 'important');
    s.setProperty('margin', '0', 'important');
    s.setProperty('padding', '0', 'important');
    s.setProperty('opacity', '1', 'important');
    for (var i = 0; i < sb.children.length; i++) {
      sb.children[i].style.setProperty('display', 'none', 'important');
    }
  }

  function tryRestartChat(sh) {
    /* Last-resort: simulate a click on the Restart icon in the header,
       then auto-confirm whatever modal appears. */
    var restart = sh.querySelector('[aria-label*="Restart" i]');
    if (!restart) return false;
    var clickable = restart.closest('button, [role="button"]') || restart;
    try { clickable.click(); } catch (e) {}
    /* Confirm any dialog that pops up (Botpress shows a Yes/No confirm). */
    setTimeout(function () {
      var confirmBtn = sh.querySelector('[role="dialog"] button, .bpModal button, [class*="confirm" i]');
      if (confirmBtn) { try { confirmBtn.click(); } catch (e) {} }
    }, 200);
    return true;
  }

  /* Position the FAB near the bottom, but lifted above any fixed/sticky bottom
     element (page nav bar, the "Made in Framer" badge) so it's never hidden and
     never covers them. Samples the FAB's column from the bottom up. Throttled.
     v22.5.47 — contact-aware: if the site's contact button (a fixed ~44px dark
     square in the bottom-right, exists on narrow breakpoints only) is visible,
     it is lifted to the same cleared level, and the bot FAB stacks directly
     above it with a small gap — one aligned column, both above the badge. */
  var _lastFabPos = 0;
  var _contactEl = null;
  /* write a style property only when the value actually changed — the run loop
     fires on every DOM mutation, and redundant writes made the buttons jitter */
  function setImp(el, prop, val) {
    if (el.style.getPropertyValue(prop) === val) return;
    el.style.setProperty(prop, val, 'important');
  }
  function atPageBottom() {
    var doc = document.documentElement;
    var y = window.scrollY || window.pageYOffset || doc.scrollTop || 0;
    return (window.innerHeight + y) >= ((doc.scrollHeight || document.body.scrollHeight) - 16);
  }
  function findContact(host, vh, vw) {
    /* cached element still valid? */
    if (_contactEl && document.contains(_contactEl)) {
      var ccs = getComputedStyle(_contactEl);
      if (ccs.display !== 'none' && ccs.visibility !== 'hidden') return _contactEl;
    }
    _contactEl = null;
    var els = document.querySelectorAll('body *');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el === host || (host && host.contains(el))) continue;
      var cs = getComputedStyle(el);
      if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') continue;
      var r = el.getBoundingClientRect();
      if (r.width < 38 || r.width > 56 || r.height < 38 || r.height > 56) continue;
      if (vh - r.bottom > 180 || vw - r.right > 120) continue;
      /* dark background = the site's contact button (measured: rgb(73,73,73)) */
      var m = cs.backgroundColor.match(/\d+/g);
      if (!m || (+m[0] + +m[1] + +m[2]) > 320) continue;
      _contactEl = el;
      break;
    }
    return _contactEl;
  }
  function positionFab(sh) {
    var wrapper = sh.querySelector('.bpFabWrapper');
    if (!wrapper) return;
    var now = Date.now();
    if (now - _lastFabPos < 300) return;   /* v22.5.50 — tighter throttle so the
       column converges fast after breakpoint switches (was 800ms) */
    _lastFabPos = now;
    var vh = window.innerHeight, vw = window.innerWidth;
    var base = isMobile() ? 20 : 28;   /* "relatively close to the bottom" */
    var gap = 12;
    var host = document.getElementById('fab-root');
    var contact = findContact(host, vh, vw);
    var fabLeft = vw - 24 - 70, fabRight = vw - 8;   /* FAB column (right side) */
    var topMost = vh, found = false;
    /* scan for fixed/sticky bottom-anchored elements that overlap the FAB's column
       (a page nav bar, the Made-in-Framer badge). Direct scan, not elementsFromPoint,
       because the badge uses pointer-events:none which elementsFromPoint skips.
       The contact button is excluded — it's part of our column, not an obstacle. */
    var els = document.querySelectorAll('body *');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el === host || (host && host.contains(el))) continue;
      if (contact && (el === contact || contact.contains(el) || el.contains(contact))) continue;
      var cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue;
      var r = el.getBoundingClientRect();
      /* v22.5.50 — only true bottom bars/badges count as obstacles (height ≤120px).
         Tall page sections that merely poke into the corner at some breakpoints
         (seen: a 281px-high decorative block at vw≈1200) made the FAB column
         jump to different heights per width. */
      if (r.width === 0 || r.height === 0 || r.height > 120) continue;
      if (r.bottom < vh - 40) continue;                 /* not anchored to the bottom */
      if (r.right < fabLeft || r.left > fabRight) continue; /* not under the FAB */
      if (r.top < topMost) { topMost = r.top; found = true; }
    }
    var bottom = base;
    if (found) { var need = (vh - topMost) + gap; if (need > base && need < vh * 0.6) bottom = need; }
    if (contact) {
      /* v22.5.51 — FULL takeover of the contact's positioning. Framer drives
         this element with scroll-linked transforms, which made it "dance"
         during scroll while our compensation chased it. Killing transform +
         transition means: it moves ONLY when we move it, in the same frame as
         the bot — one unit. Unified shadow with the bot FAB. */
      setImp(contact, 'transform', 'none');
      setImp(contact, 'transition', 'none');
      setImp(contact, 'box-shadow', '0 6px 18px rgba(0,0,0,.25)');
      var crect = contact.getBoundingClientRect();
      var visB = vh - crect.bottom;
      var setB = parseFloat(contact.style.bottom);
      if (isNaN(setB)) setB = visB;
      var offset = visB - setB;   /* ~0 once transform is dead; kept as safety */
      var pairGap = 8;
      if (atPageBottom()) {
        /* fully scrolled: switch to a horizontal row (bot right, contact to its
           left) so the pair covers less height above bottom trackers */
        setImp(contact, 'bottom', Math.round(bottom - offset) + 'px');
        setImp(contact, 'right', (24 + 44 + pairGap) + 'px');
        /* bot stays at the cleared level — same row */
      } else {
        /* vertical column: contact at the cleared level, bot right above it */
        setImp(contact, 'bottom', Math.round(bottom - offset) + 'px');
        setImp(contact, 'right', '24px');
        bottom = bottom + (crect.height || 44) + pairGap;
      }
    }
    var newB = Math.round(bottom) + 'px';
    if (wrapper.style.getPropertyValue('--ac-fab-b') !== newB) {
      wrapper.style.setProperty('--ac-fab-b', newB);
    }
    /* v22.5.48 — kill stuck CSSTransitions on the wrapper. A background-tab or
       mid-transition re-render can freeze a bottom transition in "running" state
       forever, and a live animation overrides even inline !important styles —
       the FAB then ignores --ac-fab-b entirely (seen live: stuck at bottom 24px
       while the var said 90px). Transition was removed from BASE_CSS; this
       cancel is a belt-and-braces guard for whatever Botpress itself animates. */
    if (wrapper.getAnimations) {
      try {
        wrapper.getAnimations().forEach(function (a) { a.cancel(); });
      } catch (e) {}
    }
  }

  function run() {
    var sh = getShadow();
    if (!sh) return;
    cleanupOldStyles(sh);
    injectStyle(sh, 'ac-v22-base', BASE_CSS);
    injectStyle(sh, 'ac-v22-msg', MSG_CSS);
    injectStyle(sh, 'ac-v22-welcome-css', WELCOME_CSS);
    injectStyle(sh, 'ac-v22-fix', FIX_CSS);
    injectStyle(sh, 'ac-v22-fab', FAB_CSS);
    applyExpand(sh);
    injectAvatar(sh);
    injectExpandButton(sh);
    updateExpandGlyph();  /* v22.5.37 — re-assert icon every tick; safe if button is null */
    swapNativeIcons(sh);
    positionFab(sh);
    pinSendButton(sh);
    manageWelcome(sh);
    syncBotOpenState(sh);
    handleSiteOverlay(sh);
    localize(sh);
    localize(document.body);
    /* If we marked the session as needing reset, attempt the in-app restart
       once Botpress has rendered the conversation. */
    if (window.__achordNeedsRestart) {
      if (tryRestartChat(sh)) { window.__achordNeedsRestart = false; }
    }
  }

  /* Poll + observe */
  /* poll + observe the page so styles/avatars re-assert after Botpress re-renders.
     FAB icon left as Botpress default (speech bubble) — custom icon hack removed in v22.5.28. */
  setInterval(run, 400);

  /* v22.5.53 — fast bootstrap: for the first seconds, tick every 50ms until the
     shadow root exists and our styles are in. Kills the flash of Botpress's own
     theme (orange button, default bubble icon) between its mount and our first
     400ms tick. */
  var _boot = setInterval(function () {
    var sh = getShadow();
    if (!sh) return;
    run();
    if (sh.getElementById('ac-v22-fab')) clearInterval(_boot);
  }, 50);
  setTimeout(function () { clearInterval(_boot); }, 8000);

  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', function () {
    var sh = getShadow();
    if (!sh) return;
    applyExpand(sh);
    injectExpandButton(sh);
    syncBotOpenState(sh);
    /* v22.5.50 — reposition the FAB column immediately on resize (don't wait for
       the throttled tick): breakpoint switches swap the contact variant and the
       pair must land together in the same frame. Cache is also dropped because
       Framer mounts a different contact element per breakpoint. */
    _contactEl = null;
    _lastFabPos = 0;
    positionFab(sh);
    /* Framer mounts the per-breakpoint contact variant asynchronously after
       resize — chase it with a few delayed repositions so the pair lands
       together fast instead of waiting for the next interval tick. */
    [150, 450, 900].forEach(function (d) {
      setTimeout(function () {
        var s2 = getShadow();
        if (!s2) return;
        _contactEl = null;
        _lastFabPos = 0;
        positionFab(s2);
      }, d);
    });
  });

  /* v22.5.51 — reposition on scroll (throttled inside positionFab): drives the
     vertical↔horizontal switch at the page bottom and tracker avoidance. */
  window.addEventListener('scroll', function () {
    var sh = getShadow();
    if (sh) positionFab(sh);
  }, { passive: true });

  /* v22.5.52 — tap anywhere outside the chat closes it (mobile). Implemented as
     a capture-phase document listener with composedPath() rather than relying on
     the backdrop receiving the event — Framer page layers were eating the hit. */
  document.addEventListener('pointerdown', function (e) {
    if (!isMobile()) return;
    var sh = getShadow();
    if (!sh) return;
    var chat = sh.querySelector('.bpWebchat, .bpFABWebchat');
    if (!chat || !chat.classList.contains('bpOpen')) return;
    var path = e.composedPath ? e.composedPath() : [];
    var wrapper = sh.querySelector('.bpFabWrapper');
    for (var i = 0; i < path.length; i++) {
      if (path[i] === chat || path[i] === wrapper) return;   /* tap inside — ignore */
    }
    try {
      if (window.botpress && typeof window.botpress.close === 'function') {
        window.botpress.close();
        return;
      }
    } catch (err) {}
    var fab = sh.querySelector('.bpFab');
    if (fab) { try { fab.click(); } catch (err2) {} }
  }, true);

  /* Mark window for debugging */
  try { window.__achordInjectVersion = VERSION; } catch (e) {}
  if (window.console && console.log) console.log('[achord] inject v' + VERSION + ' loaded');
})();
