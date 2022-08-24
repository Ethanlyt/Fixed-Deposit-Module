package com.leong.pelaburan.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Login used
    @Column(nullable = false,scale = 3)
    private Double amount;

    @Column(nullable = false)
    private LocalDate date;

    private String type;

    private Long transTOfd;
}
