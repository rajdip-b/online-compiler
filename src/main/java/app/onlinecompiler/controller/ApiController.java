package app.onlinecompiler.controller;

import app.onlinecompiler.misc.SavedCodeService;
import app.onlinecompiler.coderunner.CCodeRunner;
import app.onlinecompiler.coderunner.CPPCodeRunner;
import app.onlinecompiler.coderunner.PythonCodeRunner;
import app.onlinecompiler.model.CodeInput;
import app.onlinecompiler.model.CodeOutput;
import app.onlinecompiler.coderunner.JavaCodeRunner;
import app.onlinecompiler.misc.DefaultEditorTexts;
import app.onlinecompiler.model.SavedCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class ApiController {

    @Autowired
    private SavedCodeService savedCodeService;

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

    @PostMapping(value = "/saveForSelf", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String saveCodeForPrivate(@RequestBody SavedCode savedCode){
        return savedCodeService.saveCodeForPrivate(savedCode);
    }

    @PostMapping(value = "/saveForCommunity", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String saveCodeForCommunity(@RequestBody SavedCode savedCode){
        return savedCodeService.saveCodeForCommunity(savedCode);
    }

    @GetMapping(value = "/searchCommunityCodes/{query}/{page}")
    public Page<SavedCode> searchCommunityCodes(@PathVariable String query, @PathVariable Integer page, @RequestParam("sortBy") Integer sortBy, @RequestParam("sortOrder") Integer sortOrder){
        return savedCodeService.searchCommunityCodes(query, page, sortBy, sortOrder);
    }

    @GetMapping(value = "/code", produces = MediaType.APPLICATION_JSON_VALUE)
    public SavedCode getCodeByTag(@RequestParam("tag") String tag){
        return savedCodeService.getCodeByTag(tag);
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

    @PutMapping(value = "/updateCode", consumes = MediaType.APPLICATION_JSON_VALUE)
    public boolean updateCode(@RequestBody SavedCode savedCode){
        return savedCodeService.updateCode(savedCode);
    }

    @DeleteMapping(value = "/deleteCode/{codeTag}")
    public boolean deleteCode(@PathVariable String codeTag){
        return savedCodeService.deleteCode(codeTag);
    }

}
