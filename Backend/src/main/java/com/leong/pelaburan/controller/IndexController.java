package com.leong.pelaburan.controller;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.leong.pelaburan.Repository.FixedDepositRepo;
import com.leong.pelaburan.Repository.RegistrationRepo;
import com.leong.pelaburan.Repository.ScheduleRepo;
import com.leong.pelaburan.entity.FixedDeposit;


//FreeMarker 
@Controller
public class IndexController {
    @Autowired
    EntityManager em;
    @Autowired
    FixedDepositRepo fixedDepositRepo;

    @RequestMapping("/")
    public String index(Model model,String name) {
        model.addAttribute("name", "Ethan0l");
        return "index_view";
    }

    @RequestMapping("/dashboard")
    public String dashboard(
            @RequestParam(name = "name", required = false, defaultValue = "Ethan0l") String name,
            Model model) throws IOException {
        
        Iterable <FixedDeposit> data = fixedDepositRepo.findAll();
        
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule()).setDateFormat(df);
        
        String jsonData = mapper.writeValueAsString(data);
        model.addAttribute("data", jsonData);
        model.addAttribute("name", name);
        return "dashboard_view";
    }

}
