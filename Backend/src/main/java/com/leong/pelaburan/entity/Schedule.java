package com.leong.pelaburan.entity;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter


public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateStart;//
    private LocalDate dateEnd;//
    @Column(scale = 2)
    private Double amountStart;//
    @Column(scale = 2)
    private Double amountEnd;//
    @Column(scale  = 2)
    private Double amountEarned;//

    private Long schedulesToFd;

    
}
