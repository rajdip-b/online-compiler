package app.onlinecompiler.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping(value = "/compiler")
    public String compiler(){
        return "compiler";
    }

    @GetMapping(value = {"/", "/home"})
    public String home(){
        return "home";
    }

    @GetMapping(value = "/community")
    public String community(){
        return "community";
    }
}
