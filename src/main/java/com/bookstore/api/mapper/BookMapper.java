package com.bookstore.api.mapper;

import com.bookstore.api.dto.request.BookRequestDTO;
import com.bookstore.api.dto.response.BookResponseDTO;
import com.bookstore.api.model.Book;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    // Convert Input DTO to MongoDB Document Entity
    public Book toEntity(BookRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Book.builder()
                .title(dto.title())
                .author(dto.author())
                .price(dto.price())
                .isbn(dto.isbn())
                .publishedDate(dto.publishedDate())
                .build();
    }

    // Convert MongoDB Document Entity to Output DTO
    public BookResponseDTO toResponseDTO(Book book) {
        if (book == null) {
            return null;
        }
        return new BookResponseDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPrice(),
                book.getIsbn(),
                book.getPublishedDate()
        );
    }

    // Helper to update an existing entity with new data without changing its database ID
    public void updateEntityFromDTO(BookRequestDTO dto, Book entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setTitle(dto.title());
        entity.setAuthor(dto.author());
        entity.setPrice(dto.price());
        entity.setIsbn(dto.isbn());
        entity.setPublishedDate(dto.publishedDate());
    }
}
