package com.foodflow.service;

import org.springframework.stereotype.Component;

@Component
public class LlmClient {
    public String generate(String prompt) {
        // Stub implementation for LLM generation
        // Will connect to Ollama (llama3.2:1b) later. This is currently a placeholder and does not perform real LLM inference.
        return "This is a placeholder insight because real LLM inference is not currently connected.";
    }
}
