package com.relaxit.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class BackendApplication {

	private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

	public static void main(String[] args) {
		ConfigurableApplicationContext ctx = SpringApplication.run(BackendApplication.class, args);
		Environment env = ctx.getEnvironment();

		String[] activeProfiles = env.getActiveProfiles();
		String profiles = activeProfiles.length > 0 ? String.join(",", activeProfiles) : "default";
		String port = env.getProperty("server.port", "unknown");
		String appVersion = env.getProperty("spring.application.name", "relaxit-backend");

		log.info("RELAXIT_BUILD_DIAGNOSTIC started | version={} | profiles={} | port={}",
				appVersion, profiles, port);
	}

}
