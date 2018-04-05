/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mrmathami.Controller;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author thanhminhmr
 */
public class Communication {

    public static void main(String[] args) {
        String response = call("/api/book", HttpVerb.GET, "");
        System.out.println(response);
    }

    private enum HttpVerb {
        POST("POST"),
        GET("GET"),
        DELETE("DELETE");

        private final String displayName;

        HttpVerb(String displayName) {
            this.displayName = displayName;
        }

        // Optionally and/or additionally, toString.
        @Override
        public String toString() {
            return displayName;
        }
    }

    public static String get(String URL) {
        return call(URL, HttpVerb.GET, null);
    }

    public static String post(String URL, String requestBody) {
        return call(URL, HttpVerb.POST, requestBody);
    }

    public static String delete(String URL) {
        return call(URL, HttpVerb.DELETE, null);
    }

    public static final String SERVER_ADDR = "http://127.0.0.1:3000";

    private static String call(String URL, HttpVerb verb, String requestBody) {

        System.out.println(requestBody);
        // precall
        HttpURLConnection connection = null;
        try {
            //Create connection
            connection = (HttpURLConnection) new URL(SERVER_ADDR + URL).openConnection();
            connection.setUseCaches(false);
            connection.setRequestMethod(verb.toString());
            if (verb == HttpVerb.POST) {
                byte[] requestBytes = requestBody.getBytes(Charset.forName("UTF-8"));
                connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                connection.setRequestProperty("Content-Length", Integer.toString(requestBytes.length));
                connection.setDoOutput(true);
                // Send request
                try (OutputStream output = connection.getOutputStream()) {
                    output.write(requestBytes);
                }
            }
            StringBuilder response;
            // Get Response
            try (InputStreamReader input = new InputStreamReader(new BufferedInputStream(connection.getInputStream()), Charset.forName("UTF-8"))) {
                response = new StringBuilder();
                char[] inputBuffer = new char[65536];
                int inputSize;
                while ((inputSize = input.read(inputBuffer)) >= 0) {
                    response.append(inputBuffer, 0, inputSize);
                }
            }
            System.out.println(response.toString());
            return response.toString();
        } catch (IOException ex) {
            Logger.getLogger(Communication.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
        return null;
    }
}
