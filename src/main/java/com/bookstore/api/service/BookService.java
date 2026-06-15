package com.bookstore.api.service;

import com.bookstore.api.dto.request.BookRequestDTO;
import com.bookstore.api.dto.response.BookResponseDTO;
import org.springframework.data.domain.Page;

public interface BookService {

    BookResponseDTO createBook(BookRequestDTO bookRequestDTO);

    Page<BookResponseDTO> getAllBooks(int page, int size, String sortBy, String title);

    BookResponseDTO getBookById(String id);

    BookResponseDTO updateBook(String id, BookRequestDTO bookRequestDTO);

    void deleteBook(String id);
}
