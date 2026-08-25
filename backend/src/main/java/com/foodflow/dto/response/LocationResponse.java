package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationResponse {
    private Double latitude;
    private Double longitude;
    private Long cityId;
    private String cityName;
    private String stateName;
    private String countryName;
    private String source;
}
