package com.pawfund.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetDto {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private Integer ageMonths;
    private String gender;
    private String size;
    private String description;
    private String imageUrl;
    private String status;
    private Boolean vaccinated;
    private Boolean neutered;
    private String createdAt;

    // Shelter info
    private Long shelterId;
    private String shelterName;
    private String shelterAddress;
    private String shelterPhone;
}
