package app.onlinecompiler.coderunner;

import app.onlinecompiler.model.CodeInput;
import app.onlinecompiler.model.CodeOutput;
import org.apache.commons.io.FileUtils;

import java.io.*;
import java.text.MessageFormat;
import java.util.StringJoiner;
import java.util.UUID;

public class PythonCodeRunner{

    private File folder;
    private final CodeInput codeInput;
    private String folderName;
    private final String fileName;

    public PythonCodeRunner(CodeInput codeInput){
        this.codeInput = codeInput;
        this.fileName = "code";
        createFilesAndFolders();
    }

    private void createFilesAndFolders(){
        try{
            folderName = UUID.randomUUID().toString();

            folder = new File(folderName);
            folder.mkdir();
            File code = new File(folderName + "/" + fileName + ".py");
            code.createNewFile();
            File input = new File(folderName + "/input.txt");
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
            Runtime rt = Runtime.getRuntime();
            String[] commands = {
                    "/bin/bash",
                    "-c",
                    MessageFormat.format("python3 {0}/code.py < {0}/input.txt; rm -rf {0}", folderName, fileName)
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
            }
            while ((s = stdInput.readLine()) != null) {
                output.add(s);
            }
            FileUtils.deleteDirectory(folder);
            return new CodeOutput(output.toString());
        }catch (IOException e){
            return new CodeOutput(e.getLocalizedMessage());
        }
    }
}
