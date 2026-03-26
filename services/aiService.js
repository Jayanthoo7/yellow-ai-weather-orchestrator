/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */

export async function generateWeatherApology(customerName, city, weatherCondition) {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    // 1. The Single ITSM Enterprise Prompt
    const prompt = `You are an empathetic Enterprise IT Support AI. Write a single-sentence update to an employee named ${customerName} whose IT hardware equipment order to ${city} is delayed due to ${weatherCondition} weather. Reassure them that IT Service Management is tracking the shipment. Be professional and concise.`;
    
    // 2. The Missing URL for Gemini 2.5 Flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('Gemini API returned an error status.');
        }
        
        return data.candidates[0].content.parts[0].text.trim();
        
    } catch (error) {
        console.error(`[AI ERROR] Using fallback for ${customerName}.`);
        // 3. Updated Fallback to match ITSM context
        return `Hi ${customerName}, your IT hardware order to ${city} is delayed due to ${weatherCondition}. Our ITSM team is tracking it.`;
    }
}