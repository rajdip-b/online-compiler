package app.onlinecompiler.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "saved_code")
public class SavedCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Integer id;
    private String codeTag;
    private String codeTitle;
    private String code;
    private String codeLanguage;
    private Date expiresOn;
    private String codeDescription;
    private String codeInput;
    private String author;
    @JsonIgnore
    private String codeType;

}
