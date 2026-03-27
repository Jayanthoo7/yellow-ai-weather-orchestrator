/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { getWeatherForCity } from './services/weatherService.js';
import { generateWeatherApology } from './services/aiService.js';

dotenv.config();

/**
 * ENTERPRISE LOGGING UTILITY
 * Provides structural observability for ITSM tracking.
 */
function log(severity, message, orderId = 'SYSTEM') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.log(`${timestamp} | ${severity.padEnd(7)} | ID: ${orderId.padEnd(6)} | ${message}`);
}

/**
 * SINGLE ORDER HANDLER
 * Processes weather fetching, AI generation, and error handling for one order.
 */
async function processSingleOrder(order) {
    try {
        const mainWeather = await getWeatherForCity(order.city);

        // GOLDEN FLOW: Handle delays for specific weather conditions
        if (['Rain', 'Snow', 'Extreme'].includes(mainWeather)) {
            order.status = 'Delayed';
            order.message = await generateWeatherApology(order.customer, order.city, mainWeather.toLowerCase());
            log('INFO', `DELAYED: Weather is ${mainWeather} in ${order.city}`, order.order_id);
        } else {
            order.status = 'On Time';
            log('INFO', `ON TIME: Weather is ${mainWeather} in ${order.city}`, order.order_id);
        }
    } catch (error) {
        // RESILIENCE: Catch invalid cities without stopping the entire workflow
        log('ERROR', `RESILIENCE TRIGGERED: ${error.message}`, order.order_id);
    }
    return order;
}

/**
 * MAIN WORKFLOW ORCHESTRATOR
 */
async function runEnterpriseWorkflow() {
    try {
        log('SYSTEM', '🚀 Initializing Agentic AI Workflow...');
        const rawData = await fs.readFile('orders.json', 'utf-8');
        const orders = JSON.parse(rawData);

        log('SYSTEM', `📦 Triggering concurrent processing for ${orders.length} orders...`);

        // REQUIREMENT 1: PURE PARALLEL FETCHING
        // We fire all API calls simultaneously to ensure high-performance execution.
        const updatedOrders = await Promise.all(orders.map(order => processSingleOrder(order)));

        await fs.writeFile('orders_updated.json', JSON.stringify(updatedOrders, null, 2));
        log('SYSTEM', '✨ Workflow complete. Results saved to orders_updated.json');
    } catch (error) {
        log('FATAL', `Critical Workflow failure: ${error.message}`);
    }
}

runEnterpriseWorkflow();