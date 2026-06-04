package com.connectentrepreneurs.search.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.connectentrepreneurs.user.model.User;
import com.connectentrepreneurs.user.repository.UserRepository;

@Service
public class SearchService {

    @Autowired
    private UserRepository userRepository;

    public List<User> search(
            String skill,
            String sector,
            String location,
            String need) {

        List<User> users =
                userRepository.findAll();

        return users.stream()

                .filter(user ->
                        skill == null ||
                        user.getSkills()
                                .stream()
                                .anyMatch(
                                    s -> s.equalsIgnoreCase(skill)
                                )
                )

                .filter(user ->
                        sector == null ||
                        user.getSector()
                                .equalsIgnoreCase(sector)
                )

                .filter(user ->
                        location == null ||
                        user.getLocation()
                                .equalsIgnoreCase(location)
                )

                .filter(user ->
                        need == null ||
                        user.getNeed()
                                .equalsIgnoreCase(need)
                )

                .collect(Collectors.toList());
    }
}