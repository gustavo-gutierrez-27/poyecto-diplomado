package app.dto;


import java.io.Serializable;

public class FileDto implements Serializable {
    private String name;
    private String signed;

    // Constructor
    public FileDto(String name, String fileSignature) {
        this.name = name;
        this.signed = (fileSignature != null && !fileSignature.isEmpty()) ? "firmado" : "no firmado";
    }

}
