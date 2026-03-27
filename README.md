# Agentic AI Weather-Aware Order Orchestrator 🚀

This project is a high-performance Node.js orchestrator designed for ITSM environments. It automates the process of checking global weather conditions for pending orders and uses Generative AI to handle delays with personalized customer apologies.

## 🌟 Key Features
- **Pure Parallel Fetching**: Utilizes `Promise.all` to trigger concurrent API calls for weather data and AI generation, ensuring maximum performance.
- **Agentic AI Integration**: Leverages Google Gemini AI to generate context-aware apologies for delayed customers.
- **Enterprise Resilience**: Implements robust error handling to process "Invalid Cities" without interrupting the batch workflow.
- **n8n Orchestration**: Managed via n8n for visual observability and scheduled execution.

## 🛠️ Tech Stack
- **Runtime**: Node.js (ES Modules)
- **AI Engine**: Google Gemini API
- **Weather Data**: OpenWeatherMap API
- **Orchestration**: n8n (Local/Self-hosted)

## 🚀 Quick Run (via n8n)
1. Set up an **Execute Command** node in n8n.
2. Use the command: `cd /Users/kjayanthreddy/yellow-ai-assignment/yellow-ai-assignment && node index.js`
3. Use a second **Execute Command** node with `cat orders_updated.json` to view results.

## 📊 Resilience in Action
The workflow handles the required **InvalidCity123** case by logging a "RESILIENCE TRIGGERED" event while continuing to process valid orders like **London (Rain)**, which is then updated with an AI apology.
