package com.bookstore.api.Repository;

import com.bookstore.api.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BookRepository  extends MongoRepository<Book, String> {

    Optional<Book> findByIsbn(String isbn);

    boolean existsByIsbn(String isbn);
}
