package app.onlinecompiler.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeOutput {
//    public double executionTime;
    public String status;
    public String output;
}
