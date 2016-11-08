package com.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.beans.Client;
import com.dao.LoginDao;
import com.encrypt.CodeDecodeTokens;

@Path("/user/login")
public class LoginService {

	private LoginDao login = new LoginDao();
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(String input) {

		JSONObject jsonRequest = new JSONObject(input);
		String username = jsonRequest.getString("username");
		String password = jsonRequest.getString("password");
		
		Client client = login.getClientWithUsername(username, password);
		
		if (client != null) {
			
			// generate the token from the userid, username, and password
			CodeDecodeTokens cdt = new CodeDecodeTokens();
			String token = cdt.generateToken(client.getId(), client.getUsername(), client.getPassword(), 0);

//			if the response is a json object in the body
//			JSONObject jsonResponse = new JSONObject("{\"token\":" + token + "}");
//			return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).status(200).header("Status", "Success").build();
			
			return Response.status(200).header("Status", "Success").header("token", token).build();
		}
		
		return Response.status(400).header("Status", "Failed").header("Message", "Bad username or password.").build();
		
	}
}
