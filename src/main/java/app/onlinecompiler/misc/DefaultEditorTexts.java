package app.onlinecompiler.misc;

public class DefaultEditorTexts {

    public static final String JAVA = "/*\n" +
            "\tMake sure to have only one class as public.\n" +
            "\tThis is the class that should contain the main function.\n" +
            "*/\n" +
            "\n" +
            "import java.util.*;\n" +
            "\n" +
            "public class MyClass {\n" +
            "\tpublic static void main(String args[]) {\n" +
            "\t}\n" +
            "}\n";

    public static final String C = "/*\n" +
            "\tMake sure that the int main method is not replaced.\n" +
            "\tAll other code must be done as usual\n" +
            "*/\n" +
            "\n" +
            "#include <stdio.h>\n" +
            "\n" +
            "int main(){\n" +
            "\treturn 0;\n" +
            "}";

    public static final String CPP = "/*\n" +
            "\tMake sure that the int main method is not replaced.\n" +
            "\tAll other code must be done as usual\n" +
            "*/\n" +
            "\n" +
            "#include <iostream>\n" +
            "using namespace std;\n" +
            "\n" +
            "int main(){\n" +
            "\treturn 0;\n" +
            "}";

    public static final String PYTHON = "# Start coding here";
}
