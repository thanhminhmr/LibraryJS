/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mrmathami.Model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Objects;
import mrmathami.Controller.Communication;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author C.Anh
 * @author thanhminhmr
 */
public class Book {

    public final Integer id;
    public final String name;
    public final String author;
    public final String publisher;
    public final Integer quantity;
    public final String otherInfo;
    public final Integer borrowed;

    private Book(Integer id, String name, String author, String publisher, Integer quantity, String otherInfo, Integer borrowed) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.publisher = publisher;
        this.quantity = quantity;
        this.otherInfo = otherInfo;
        this.borrowed = borrowed;
    }

    public static ArrayList<Book> getBookList() {
        JSONObject response = new JSONObject(Communication.get("/api/book"));
        if (response.getInt("status") == 200) {
            ArrayList<Book> books = new ArrayList<>();
            response.getJSONArray("result").forEach((Object obj) -> {
                JSONObject object = (JSONObject) obj;
                books.add(new Book(
                        object.getInt("id"),
                        object.getString("name"),
                        object.getString("author"),
                        object.getString("publisher"),
                        object.getInt("quantity"),
                        object.getString("otherInfo"),
                        object.getInt("borrowed")));
            });
            return books;
        }
        return null;
    }

    public static boolean createBook(String name, String author, String publisher, Integer quantity, String otherInfo) {
        if (name != null && author != null && publisher != null && quantity != null && otherInfo != null) {
            
            System.out.println(name);
            System.out.println(author);
            System.out.println(publisher);
            System.out.println(quantity);
            System.out.println(otherInfo);
            
            JSONObject response = new JSONObject(
                    Communication.post("/api/book", new JSONObject()
                            .put("name", name)
                            .put("author", author)
                            .put("publisher", publisher)
                            .put("quantity", quantity)
                            .put("otherInfo", otherInfo)
                            .toString()));
            if (response.getInt("status") == 200) {
                return true;
            }
        }
        return false;
    }

    public static boolean updateBook(Integer id, String name, String author, String publisher, Integer quantity, String otherInfo) {
        JSONObject response
                = new JSONObject(Communication.post("/api/book/" + id.toString(), new JSONObject()
                        .put("name", name)
                        .put("author", author)
                        .put("publisher", publisher)
                        .put("quantity", quantity)
                        .put("otherInfo", otherInfo)
                        .toString()));
        if (response.getInt("status") == 200) {
            return true;
        }
        return false;
    }

    public static boolean deleteBook(Integer id) {
        JSONObject response = new JSONObject(Communication.delete("/api/book/" + id.toString()));
        if (response.getInt("status") == 200) {
            return true;
        }
        return false;
    }
}
