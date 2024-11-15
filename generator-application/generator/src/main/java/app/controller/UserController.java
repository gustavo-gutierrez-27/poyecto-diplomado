package app.controller;

import app.model.User;
import app.service.UserService;
import app.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;  // Servicio para extraer el usuario desde el JWT

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            // Obtener el token desde el encabezado de autorización
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtils.extractUsername(token);  // Extraer el nombre de usuario desde el JWT

            // Obtener el usuario autenticado
            User authenticatedUser = userService.findByUsername(username);

            // Obtener todos los usuarios registrados
            List<User> users = userService.getAllUsers();

            // Filtrar la lista para excluir al usuario autenticado
            List<Map<String, Object>> userDtos = new ArrayList<>();
            for (User user : users) {
                if (!user.equals(authenticatedUser)) {  // Excluir el usuario autenticado
                    Map<String, Object> userDto = new HashMap<>();
                    userDto.put("id", user.getId());
                    userDto.put("username", user.getUsername());
                    userDtos.add(userDto);
                }
            }

            return ResponseEntity.ok(userDtos);
        } catch (Exception e) {
            // Devuelves un map con el error, pero dentro de una lista para que sea consistente con la respuesta esperada
            List<Map<String, Object>> errorResponse = new ArrayList<>();
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("error", e.getMessage());
            errorResponse.add(errorMap);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
