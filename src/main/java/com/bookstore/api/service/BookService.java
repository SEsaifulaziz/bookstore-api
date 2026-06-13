package com.bookstore.api.service;

import com.bookstore.api.dto.BookRequestDTO;
import com.bookstore.api.dto.BookResponseDTO;

import java.util.List;

public interface BookService {

    BookResponseDTO createBook(BookRequestDTO bookRequestDTO);

    List<BookResponseDTO> getAllBooks(int page, int size, String sortBy, String title);

    BookResponseDTO getBookById(String id);

    BookResponseDTO updateBook(String id, BookRequestDTO bookRequestDTO);

    void deleteBook(String id);
}
