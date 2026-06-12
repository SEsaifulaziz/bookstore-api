package com.bookstore.api.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookRequestDTO(
        @NotBlank(message = "Title cannot be blank")
        @Size(max = 100, message = "Title cannot exceed 100 characters")
        String title,

        @NotBlank(message = "Author cannot be blank")
        @Size(max = 50, message = "Author cannot exceed 50 characters")
        String author,

        @NotNull(message = "Price cannot be null")
        @Positive(message = "Price must be a positive value")
        BigDecimal price,

        @NotBlank(message = "ISBN cannot be blank")
        @Size(min = 10, max = 13, message = "ISBN must be between 10 and 13 characters")
        String isbn,

        @NotNull(message = "Published date cannot be null")
        @PastOrPresent(message = "Published date cannot be in the future")
        LocalDate publishedDate
) {}