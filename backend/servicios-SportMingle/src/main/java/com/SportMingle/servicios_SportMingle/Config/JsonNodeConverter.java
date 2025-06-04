package com.SportMingle.servicios_SportMingle.Config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

@Converter(autoApply = true)
public class JsonNodeConverter implements AttributeConverter<JsonNode, String> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(JsonNode attribute) {
        if (attribute == null || attribute.isNull()) {
            System.out.println("[DEBUG] JsonNode nulo o vacío, no se guarda nada en DB.");
            return null;
        }

        if (attribute.isMissingNode()) {
            System.out.println("[DEBUG] JsonNode es un MissingNode, se lanza excepción.");
            throw new IllegalArgumentException("JsonNode vacío o no válido (MissingNode)");
        }

        try {
            String json = mapper.writeValueAsString(attribute);
            System.out.println("[DEBUG] JsonNode serializado correctamente: " + json);
            return json;
        } catch (JsonProcessingException e) {
            System.out.println("[ERROR] Error serializando JsonNode: " + e.getMessage());
            throw new IllegalArgumentException("Error serializando JsonNode a String", e);
        }
    }

    @Override
    public JsonNode convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            System.out.println("[DEBUG] String nulo recibido de DB, devuelve null.");
            return null;
        }

        try {
            JsonNode node = mapper.readTree(dbData);
            System.out.println("[DEBUG] JsonNode deserializado correctamente: " + node.toString());
            return node;
        } catch (JsonProcessingException e) {
            System.out.println("[ERROR] Error deserializando JSON: " + e.getMessage());
            throw new IllegalArgumentException("Error deserializando String a JsonNode", e);
        }
    }
}
