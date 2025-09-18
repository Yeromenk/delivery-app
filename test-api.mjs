#!/usr/bin/env node

// Quick test script to check if Vercel API is working
import fetch from 'node-fetch';

const baseUrl = 'https://delivery-app-henna.vercel.app';

async function testAPI() {
    console.log('🔍 Testing Vercel API endpoints...\n');

    try {
        // Test debug endpoint first
        console.log('1. Testing debug endpoint...');
        const debugResponse = await fetch(`${baseUrl}/api/debug`);
        const debugData = await debugResponse.json();
        console.log('Debug data:', debugData);
        console.log('---\n');

        // Test health endpoint
        console.log('2. Testing health endpoint...');
        const healthResponse = await fetch(`${baseUrl}/api/health`);
        const healthData = await healthResponse.json();
        console.log('Health data:', healthData);
        console.log('---\n');

        // Test products endpoint
        console.log('3. Testing products endpoint...');
        const productsResponse = await fetch(`${baseUrl}/api/products`);
        const productsData = await productsResponse.json();
        console.log('Products count:', Array.isArray(productsData) ? productsData.length : 'Error');
        console.log('---\n');

        // Test ingredients endpoint
        console.log('4. Testing ingredients endpoint...');
        const ingredientsResponse = await fetch(`${baseUrl}/api/ingredients`);
        const ingredientsData = await ingredientsResponse.json();
        console.log('Ingredients count:', Array.isArray(ingredientsData) ? ingredientsData.length : 'Error');

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testAPI();
