package app.dto;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileDto implements Serializable {
    private Long id;
    private String name;
    private List<Map<String, Object>> signatures; // Lista de firmas y su validez

    public FileDto(Long id, String name, List<Map<String, Object>> signatures) {
        this.id = id;
        this.name = name;
        this.signatures = signatures;
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

    public List<Map<String, Object>> getSignatures() {
        return signatures;
    }

    public void setSignatures(List<Map<String, Object>> signatures) {
        this.signatures = signatures;
    }
}
