package com.bookstore.api.service;

import com.bookstore.api.dto.BookRequestDTO;
import com.bookstore.api.dto.BookResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BookService {

    BookResponseDTO createBook(BookRequestDTO bookRequestDTO);

    Page<BookResponseDTO> getAllBooks(int page, int size, String sortBy, String title);

    BookResponseDTO getBookById(String id);

    BookResponseDTO updateBook(String id, BookRequestDTO bookRequestDTO);

    void deleteBook(String id);
}
