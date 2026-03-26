/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { getWeatherForCity } from './services/weatherService.js';
import { generateWeatherApology } from './services/aiService.js';

dotenv.config();

// --- 1. ENTERPRISE LOGGING UTILITY ---
// This provides the "Structural Observability" required for ITSM tracking.
function log(severity, message, orderId = 'SYSTEM') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.log(`${timestamp} | ${severity.padEnd(7)} | ID: ${orderId.padEnd(6)} | ${message}`);
}

// --- 2. ENVIRONMENT VALIDATION ---
// Ensures the .env file is correctly configured before execution.
function validateEnvironment() {
    const requiredKeys = ['WEATHER_API_KEY', 'GEMINI_API_KEY'];
    const missingKeys = requiredKeys.filter(key => !process.env[key]);

    if (missingKeys.length > 0) {
        log('FATAL', `Missing configuration keys: ${missingKeys.join(', ')}`);
        process.exit(1);
    }
}

// --- 3. SINGLE ORDER HANDLER ---
async function processSingleOrder(order) {
    try {
        const mainWeather = await getWeatherForCity(order.city);

        // The Golden Flow Logic [cite: 37, 38]
        if (['Rain', 'Snow', 'Extreme'].includes(mainWeather)) {
            order.status = 'Delayed';
            order.message = await generateWeatherApology(order.customer, order.city, mainWeather.toLowerCase());
            
            if (mainWeather === 'Extreme') {
                order.requires_human_review = true;
                log('WARN', `EXTREME WEATHER: Flagged for human review in ${order.city}`, order.order_id);
            } else {
                log('INFO', `DELAYED: Weather is ${mainWeather} in ${order.city}`, order.order_id);
            }
        } else {
            log('INFO', `ON TIME: Weather is ${mainWeather} in ${order.city}`, order.order_id);
        }
    } catch (error) {
        // Fulfills Requirement 3: Handle InvalidCity123 without crashing[cite: 41, 42].
        log('ERROR', `RESILIENCE TRIGGERED: ${error.message}`, order.order_id);
    }
    return order;
}

// --- 4. MAIN WORKFLOW ORCHESTRATOR ---
async function runEnterpriseWorkflow() {
    validateEnvironment();
    
    try {
        log('SYSTEM', '🚀 Initializing Agentic AI Workflow...');

        const rawData = await fs.readFile('orders.json', 'utf-8');
        const orders = JSON.parse(rawData);

        // --- ADVANCED RATE LIMITING (Batch Processing) ---
        const BATCH_SIZE = 2; 
        const updatedOrders = [];

        for (let i = 0; i < orders.length; i += BATCH_SIZE) {
            const batch = orders.slice(i, i + BATCH_SIZE);
            log('SYSTEM', `📦 Processing Batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
            
            // Fulfills Requirement 1: Parallel Fetching[cite: 35, 36].
            const batchResults = await Promise.all(batch.map(order => processSingleOrder(order)));
            updatedOrders.push(...batchResults);
        }

        await fs.writeFile('orders_updated.json', JSON.stringify(updatedOrders, null, 2));
        log('SYSTEM', '✨ Workflow complete. Results saved to orders_updated.json[cite: 47].');

    } catch (error) {
        log('FATAL', `Critical Workflow failure: ${error.message}`);
    }
}

runEnterpriseWorkflow();