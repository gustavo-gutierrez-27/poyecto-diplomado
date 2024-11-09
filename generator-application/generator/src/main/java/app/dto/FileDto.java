package app.dto;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileDto implements Serializable {
    private String name;
    private String signed;

    // Constructor
    public FileDto(String name, String fileSignature) {
        this.name = name;
        this.signed = (fileSignature != null && !fileSignature.isEmpty()) ? "firmado" : "no firmado";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSigned() {
        return signed;
    }

    public void setSigned(String signed) {
        this.signed = signed;
    }
}
