package app.onlinecompiler.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeInput {
    public String language;
    public String code;
    public String input;
}
