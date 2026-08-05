package com.foodflow.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OllamaLLMClient implements LLMClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.llm.base-url}")
    private String baseUrl;

    @Value("${ai.llm.model}")
    private String model;

    @Override
    public String generateText(String prompt) {
        String url = baseUrl + "/api/generate";
        
        Map<String, Object> request = new HashMap<>();
        request.put("model", model);
        request.put("prompt", prompt);
        request.put("stream", false);

        try {
            Map response = restTemplate.postForObject(url, request, Map.class);
            if (response != null && response.containsKey("response")) {
                return response.get("response").toString();
            }
        } catch (Exception e) {
            // Fallback for demo if Ollama is not actually running
            return "Failed to connect to local Ollama instance. Please ensure it is running at " + baseUrl + ".";
        }
        return "No response from LLM.";
    }
}
