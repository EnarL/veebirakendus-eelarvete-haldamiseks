package com.example.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.backend")

public class DemoApplication {

	public static void main(String[] args) {

//		String envDirectory = "/app";
//
//		Dotenv dotenv = Dotenv.configure().directory(envDirectory).load();
//		System.setProperty("APP_FRONTEND_URL", dotenv.get("APP_FRONTEND_URL"));
//		System.setProperty("APP_BACKEND_URL", dotenv.get("APP_BACKEND_URL"));
//		System.setProperty("DB_URL", dotenv.get("DB_URL"));
//		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
//		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
//		System.setProperty("MAIL_USERNAME", dotenv.get("MAIL_USERNAME"));
//		System.setProperty("MAIL_PASSWORD", dotenv.get("MAIL_PASSWORD"));


		SpringApplication.run(DemoApplication.class, args);
	}

}
