package app.dto;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileDto implements Serializable {
    private Long id;
    private String name;
    private String signed;
    private boolean valid;

    // Constructor
    public FileDto(Long id,String name, String fileSignature, boolean valid) {
        this.id = id;
        this.name = name;
        this.signed = (fileSignature != null && !fileSignature.isEmpty()) ? "firmado" : "no firmado";
        this.valid = valid;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
