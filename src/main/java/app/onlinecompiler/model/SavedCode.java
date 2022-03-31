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
    @JsonIgnore
    private String codeTag;
    private String code;
    private String codeLanguage;
    @JsonIgnore
    private Date expiresOn;
    private String codeDescription;
    private String codeInput;

}
