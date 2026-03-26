# 🚚 ITSM Weather-Aware Order Orchestrator

### *Yellow.ai - Backend / AI Automation Mission*

Welcome to my submission for the AI Automation Mission. This project is a resilient, production-oriented orchestrator designed to handle enterprise IT hardware orders. I’ve focused on **structural observability**, **rate-limiting**, and **agentic AI integration** to ensure this workflow thrives in a real-world ITSM environment.

---

## 🎯 The Core Mission (The Golden Flow)
The orchestrator follows a strict logic path to manage employee hardware shipments:
1.  **Ingestion:** Reads a list of hardware orders from `orders.json`.
2.  **Live Weather Check:** Uses the **OpenWeatherMap API** to fetch real-time conditions.
3.  **The Delay Logic:** If the weather is identified as **'Rain'**, **'Snow'**, or **'Extreme'**, the order is flagged as `Delayed`.
4.  **Agentic AI Action:** For delayed orders, the system invokes **Gemini 2.5 Flash** to generate a personalized, empathetic apology message.
5.  **Output:** Saves the enriched data to `orders_updated.json`.

---

## 🚀 Why This Project Stands Out (The Extra Mile)
I’ve implemented several "Day 2" engineering patterns that go beyond the basic requirements to show how this would scale in production:

* **📦 Advanced Batch Processing:** Instead of overwhelming APIs with a massive burst of requests, I implemented a **Batching Strategy (Size: 2)**. This acts as a native rate-limiter, ensuring the script respects API quotas while maintaining parallel efficiency.
* **🔍 Structural Observability:** The system uses a **Structured Logging Utility** with ISO timestamps, severity levels (INFO, WARN, ERROR), and unique Order IDs for easy debugging in a production stack.
* **🛡️ Fail-Fast Environment Validation:** To prevent runtime crashes, the script performs a "Pre-flight Check" on `.env` keys before execution, providing clear error messages if keys are missing.
* **🧩 Resilient Error Handling:** Specifically engineered to handle the **`InvalidCity123`** edge case. The script logs the failure but stays alive to finish valid orders.

---

## 📊 Sample Output (Observability in Action)
The orchestrator provides structured, real-time feedback during execution, as seen in the terminal output below:

<img width="713" height="175" alt="terminal_output" src="https://github.com/user-attachments/assets/1fc4f8f5-6973-47f6-ab84-cd4de77e36a2" />



## 📂 Project Structure
```text
.
├── services/
│   ├── weatherService.js   # OpenWeatherMap Integration
│   └── aiService.js        # Gemini AI REST Integration
├── index.js                # Main Orchestrator Logic
├── orders.json             # Input Database
├── orders_updated.json     # Final Output
├── prompts.txt             # AI Interaction Log
└── .env                    # Secrets (Excluded via .gitignore)





