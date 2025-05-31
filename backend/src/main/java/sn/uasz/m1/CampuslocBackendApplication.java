package sn.uasz.m1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class CampuslocBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampuslocBackendApplication.class, args);
	}

}
