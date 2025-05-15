package com.example.backend.category;

import com.example.backend.transaction.Transaction;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "kategooriad")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private boolean isGlobal;

    @OneToMany(mappedBy = "category")
    @JsonManagedReference
    private List<Transaction> transactions;

}