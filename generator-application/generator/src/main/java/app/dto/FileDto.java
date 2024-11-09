package app.dto;

public class FileDto {
    private String name;
    private String signed;

    public FileDto(String name, String sign){
        this.name= name;
        if (sign == null){
            this.signed = "No firmado";
        }else this.signed = "Firmado";
    }

}
