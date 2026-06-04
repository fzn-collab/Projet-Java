package com.connectentrepreneurs.search.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.connectentrepreneurs.search.service.SearchService;
import com.connectentrepreneurs.user.model.User;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public List<User> search(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String need) {

        return searchService.search(
                skill,
                sector,
                location,
                need
        );
    }
}