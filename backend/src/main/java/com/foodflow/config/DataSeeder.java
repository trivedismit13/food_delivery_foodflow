package com.foodflow.config;

import com.foodflow.model.City;
import com.foodflow.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CityRepository cityRepository;

    @Override
    public void run(String... args) {
        if (cityRepository.count() == 0) {
            List<City> cities = List.of(
                City.builder().cityName("Mumbai").state("Maharashtra").latitude(19.0760).longitude(72.8777).population(20411000L).build(),
                City.builder().cityName("Delhi").state("Delhi").latitude(28.7041).longitude(77.1025).population(30291000L).build(),
                City.builder().cityName("Bangalore").state("Karnataka").latitude(12.9716).longitude(77.5946).population(12327000L).build(),
                City.builder().cityName("Hyderabad").state("Telangana").latitude(17.3850).longitude(78.4867).population(10004000L).build(),
                City.builder().cityName("Ahmedabad").state("Gujarat").latitude(23.0225).longitude(72.5714).population(8253000L).build(),
                City.builder().cityName("Chennai").state("Tamil Nadu").latitude(13.0827).longitude(80.2707).population(10971000L).build(),
                City.builder().cityName("Kolkata").state("West Bengal").latitude(22.5726).longitude(88.3639).population(14850000L).build(),
                City.builder().cityName("Surat").state("Gujarat").latitude(21.1702).longitude(72.8311).population(7184000L).build(),
                City.builder().cityName("Pune").state("Maharashtra").latitude(18.5204).longitude(73.8567).population(6629000L).build(),
                City.builder().cityName("Jaipur").state("Rajasthan").latitude(26.9124).longitude(75.7873).population(3910000L).build(),
                City.builder().cityName("Lucknow").state("Uttar Pradesh").latitude(26.8467).longitude(80.9462).population(3587000L).build(),
                City.builder().cityName("Kanpur").state("Uttar Pradesh").latitude(26.4499).longitude(80.3319).population(3111000L).build(),
                City.builder().cityName("Nagpur").state("Maharashtra").latitude(21.1458).longitude(79.0882).population(2937000L).build(),
                City.builder().cityName("Indore").state("Madhya Pradesh").latitude(22.7196).longitude(75.8577).population(3054000L).build(),
                City.builder().cityName("Thane").state("Maharashtra").latitude(19.2183).longitude(72.9781).population(2564000L).build()
            );
            cityRepository.saveAll(cities);
        }
    }
}
