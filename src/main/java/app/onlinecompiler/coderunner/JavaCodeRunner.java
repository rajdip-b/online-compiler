package app.onlinecompiler.coderunner;

import app.onlinecompiler.model.CodeInput;
import app.onlinecompiler.model.CodeOutput;
import org.apache.commons.io.FileUtils;

import java.io.*;
import java.text.MessageFormat;
import java.util.StringJoiner;
import java.util.UUID;

public class JavaCodeRunner{

    private File folder;
    private File code;
    private File input;
    private CodeInput codeInput;
    private String className;
    private String folderName;

    public JavaCodeRunner(CodeInput codeInput){
        this.codeInput = codeInput;
        createFilesAndFolders();
    }

    private String getClassName(String code){
        int pos = code.indexOf("public class")+"public class ".length();
        StringBuilder name = new StringBuilder();
        while (code.charAt(pos) != ' ' && code.charAt(pos) != '{'){
            name.append(code.charAt(pos));
            ++pos;
        }
        return name.toString();
    }

    private void createFilesAndFolders(){
        try{
            className = getClassName(this.codeInput.getCode());
            folderName = UUID.randomUUID().toString();

            folder = new File(folderName);
            folder.mkdir();
            code = new File(folderName+"/"+className+".java");
            code.createNewFile();
            input = new File(folderName+"/input.txt");
            input.createNewFile();

            FileWriter fileWriter =  new FileWriter(code);
            fileWriter.write(codeInput.getCode());
            fileWriter.flush();
            fileWriter.close();

            fileWriter = new FileWriter(input);
            fileWriter.write(codeInput.getInput());
            fileWriter.flush();
            fileWriter.close();
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    public CodeOutput execute() {
        try{
            boolean failed = false;
            Runtime rt = Runtime.getRuntime();
            String[] commands = {
                    "/bin/bash",
                    "-c",
                    MessageFormat.format("javac {0}/{1}.java && timeout 5s java {0}/{1}.java < {0}/input.txt; rm -rf {0}", folderName, className)
            };
            Process proc = null;
            proc = rt.exec(commands);

            assert proc != null;
            BufferedReader stdInput = new BufferedReader(new
                    InputStreamReader(proc.getInputStream()));

            BufferedReader stdError = new BufferedReader(new
                    InputStreamReader(proc.getErrorStream()));

            String s = null;
            StringJoiner output = new StringJoiner(System.lineSeparator());
            while ((s = stdError.readLine()) != null) {
                output.add(s);
                failed = true;
            }
            while ((s = stdInput.readLine()) != null) {
                output.add(s);
            }
            FileUtils.deleteDirectory(folder);
            if (failed)
                return new CodeOutput("failure", output.toString());
            else
                return new CodeOutput("success", output.toString());
        }catch (StringIndexOutOfBoundsException e){
            return new CodeOutput("failure", "Class name not found! Please use a single public class.");
        }catch (IOException e){
            return new CodeOutput("failure", e.getLocalizedMessage());
        }
    }
}
