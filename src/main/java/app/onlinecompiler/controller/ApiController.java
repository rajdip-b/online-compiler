package app.onlinecompiler.controller;

import app.onlinecompiler.coderunner.CCodeRunner;
import app.onlinecompiler.coderunner.CPPCodeRunner;
import app.onlinecompiler.coderunner.PythonCodeRunner;
import app.onlinecompiler.model.CodeInput;
import app.onlinecompiler.model.CodeOutput;
import app.onlinecompiler.coderunner.JavaCodeRunner;
import app.onlinecompiler.model.DefaultEditorTexts;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    @PostMapping(value = "/run", consumes = MediaType.APPLICATION_JSON_VALUE)
    public CodeOutput runCode(@RequestBody CodeInput codeInput){
        switch (codeInput.getLanguage()){
            case "Java": return new JavaCodeRunner(codeInput).execute();
            case "C++": return new CPPCodeRunner(codeInput).execute();
            case "C": return new CCodeRunner(codeInput).execute();
            case "Python": return new PythonCodeRunner(codeInput).execute();
            default: return new CodeOutput("failure", "That language isn't supported yet!");
        }
    }

    @GetMapping("/text/java")
    public String getJavaDefaultEditorText(){
        return DefaultEditorTexts.JAVA;
    }

    @GetMapping("/text/c")
    public String getCDefaultEditorText(){
        return DefaultEditorTexts.C;
    }

    @GetMapping("/text/cpp")
    public String getCPPDefaultEditorText(){
        return DefaultEditorTexts.CPP;
    }

    @GetMapping("/text/python")
    public String getPythonDefaultEditorText(){
        return DefaultEditorTexts.PYTHON;
    }

}
