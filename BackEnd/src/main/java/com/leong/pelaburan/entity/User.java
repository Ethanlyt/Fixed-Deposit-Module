package com.leong.pelaburan.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import antlr.collections.List;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class User {
    public static enum RoleType {
        USER("USER"),
        ADMIN("ADMIN");

        private String value;
        private RoleType(String value) {
            this.value = value;
        }
        private String getValue() {
            return value;
        }
        
    }
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    

    //Login used
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RoleType role;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(nullable = true)
    private FixedDeposit fixedDeposit;
    

}
