package org.openbmp.api.helpers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

public class WrapRootValueForResponseJson {


    /**
     * Generate JSON Data response including the root wrapping
     *
     * @param  jsonData			Inner JSON Data, without any root wrapping
     *
     * @return the formatted JSON string response along with the root value
     */
    public static String wrapRootValue(Object jsonData, String tableName) {

        String wrappedString = "";

        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter writer = mapper.writer().withRootName(tableName);

        try {

            wrappedString= writer.writeValueAsString(jsonData);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return wrappedString;
    }

}
