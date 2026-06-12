package com.bookstore.api.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collation = "books")
public class Book {
    @Id
    private String id;

    private String title;
    private String author;
    private BigDecimal price;

    @Indexed(unique = true)
    private String isbn;

    private LocalDate publishedDate;
}
