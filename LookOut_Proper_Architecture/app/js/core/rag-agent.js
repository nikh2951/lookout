
/* =========================================================
   LOOKOUT - RAG ASSISTANT
   Collapsed launcher -> expandable assistant
   ========================================================= */

(function () {
    "use strict";

    const RAG_API_BASE =
        window.LOOKOUT_RAG_API_BASE ||
        "/api/rag";

    function currentPage() {
        const path = window.location.pathname.toLowerCase();

        if (path.includes("gen")) return "AI Generator";
        if (path.includes("ai-edit")) return "AI Edit";
        if (path.includes("manual")) return "Manual Edit";
        if (path.includes("saved")) return "Saved Works";
        if (path.includes("main") || path === "/" || path === "") return "Home";

        return "LookOut";
    }

    function createAssistant() {
        if (document.getElementById("ragLauncher")) return;

        const launcher = document.createElement("button");
        launcher.id = "ragLauncher";
        launcher.className = "rag-launcher";
        launcher.type = "button";
        launcher.title = "Open LookOut Assistant";
        launcher.setAttribute("aria-label", "Open LookOut Assistant");
        launcher.innerHTML =
            '<i class="fa-solid fa-wand-magic-sparkles"></i>';

        const assistant = document.createElement("div");
        assistant.id = "ragAssistant";
        assistant.className = "rag-assistant";
        assistant.setAttribute("aria-hidden", "true");

        assistant.innerHTML = `
            <div class="rag-header">
                <div class="rag-title-area">
                    <div class="rag-avatar">✦</div>
                    <div>
                        <div class="rag-title">LookOut Assistant</div>
                        <div class="rag-status">Ask me anything about LookOut</div>
                    </div>
                </div>

                <button
                    class="rag-close-btn"
                    id="ragCloseBtn"
                    type="button"
                    aria-label="Close assistant"
                >×</button>
            </div>

            <div class="rag-messages" id="ragMessages">
                <div class="rag-message assistant">
                    <div class="rag-message-avatar">✦</div>
                    <div class="rag-message-content">
                        Hi! I'm the LookOut Assistant. Ask me anything about the application.
                    </div>
                </div>
            </div>

            <div class="rag-input-area">
                <textarea
                    id="ragQuestion"
                    class="rag-input"
                    placeholder="Ask about LookOut..."
                    rows="1"
                ></textarea>

                <button
                    type="button"
                    class="rag-voice-btn voice-input-btn"
                    id="ragVoiceBtn"
                    aria-label="Ask using voice"
                    title="Voice input"
                >🎤</button>

                <button
                    type="button"
                    class="rag-send-btn"
                    id="ragSendBtn"
                    aria-label="Send question"
                    title="Send"
                >➤</button>
            </div>
        `;

        document.body.appendChild(launcher);
        document.body.appendChild(assistant);

        const closeBtn = assistant.querySelector("#ragCloseBtn");
        const question = assistant.querySelector("#ragQuestion");
        const sendBtn = assistant.querySelector("#ragSendBtn");
        const voiceBtn = assistant.querySelector("#ragVoiceBtn");

        function openAssistant() {
            assistant.classList.add("open");
            assistant.setAttribute("aria-hidden", "false");
            launcher.classList.add("hidden");

            setTimeout(() => question.focus(), 120);
        }

        function closeAssistant() {
            assistant.classList.remove("open");
            assistant.setAttribute("aria-hidden", "true");
            launcher.classList.remove("hidden");
        }

        launcher.addEventListener("click", openAssistant);
        closeBtn.addEventListener("click", closeAssistant);

        async function askRAG() {
            const text = question.value.trim();
            if (!text) return;

            addMessage(text, "user");
            question.value = "";

            try {
                const email = localStorage.getItem("userEmail") || "";

                const response = await fetch(`${RAG_API_BASE}/ask`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: text,
                        email,
                        page: currentPage(),
                        application: "LookOut"
                    })
                });

                if (!response.ok) {
                    throw new Error(`RAG request failed: ${response.status}`);
                }

                const data = await response.json();

                addMessage(
                    data.answer ||
                    data.response ||
                    data.message ||
                    data.result ||
                    "I couldn't find an answer to that.",
                    "assistant"
                );

            } catch (error) {
                console.error("LookOut RAG error:", error);

                addMessage(
                    "The LookOut Assistant is currently unavailable.",
                    "assistant"
                );
            }
        }

        function addMessage(message, type) {
            const messages = assistant.querySelector("#ragMessages");

            const row = document.createElement("div");
            row.className = `rag-message ${type}`;

            const avatar = document.createElement("div");
            avatar.className = "rag-message-avatar";
            avatar.textContent = type === "assistant" ? "✦" : "You";

            const content = document.createElement("div");
            content.className = "rag-message-content";
            content.textContent = message;

            row.appendChild(avatar);
            row.appendChild(content);
            messages.appendChild(row);

            messages.scrollTop = messages.scrollHeight;
        }

        sendBtn.addEventListener("click", askRAG);

        question.addEventListener("keydown", function (event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                askRAG();
            }
        });

        voiceBtn.addEventListener("click", function () {
            if (typeof window.startVoiceInput === "function") {
                window.startVoiceInput(this, "ragQuestion");
            } else {
                alert("Voice input is not loaded yet.");
            }
        });

        window.LookOutRAG = {
            open: openAssistant,
            close: closeAssistant,
            ask: askRAG
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createAssistant);
    } else {
        createAssistant();
    }
})();
