package app.onlinecompiler;

import app.onlinecompiler.misc.SavedCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class OnlineCompilerApplication {

	@Autowired
	private SavedCodeService savedCodeService;

	public static void main(String[] args) {
		SpringApplication.run(OnlineCompilerApplication.class, args);
	}

}
