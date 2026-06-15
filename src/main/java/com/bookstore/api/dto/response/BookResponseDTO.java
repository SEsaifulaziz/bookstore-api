package com.bookstore.api.dto.response;


import java.math.BigDecimal;
import java.time.LocalDate;

public record BookResponseDTO(
        String id,
        String title,
        String author,
        BigDecimal price,
        String isbn,
        LocalDate publishedDate
) {}