package com.foodflow.service;

import org.springframework.stereotype.Component;

@Component
public class LlmClient {
    public String generate(String prompt) {
        // Stub implementation for LLM generation
        // Will connect to Ollama (llama3.2:1b) later
        return "This is an AI generated insight based on your data.";
    }
}
