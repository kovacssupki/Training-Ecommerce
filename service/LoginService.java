/**
 * This class is used to communicate with the front end of the application, through Json string objects.
 * It is used on the login.
 * 
 * @author sandor.naghi
 */
package com.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.beans.Client;
import com.dao.ClientDao;
import com.dao.LoginDao;
import com.encrypt.CodeDecodeTokens;

@Path("/user/login")
public class LoginService {

	private LoginDao loginDao = new LoginDao();
	private ClientDao clientDao = new ClientDao();
	
	/**
	 * Identifying the Client, based upon username and password.
	 * @param input	Data from the front end, with username and password.
	 * @return	Message of Success or Failure.
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String login(String input) {

		// If the data from the front is empty, it returns Failed.
		if (input.equals("")) {
			String result = clientDao.setMessage("Failed", "No data");
			return result;
		}
		
		// Creating a JSon object, from which retrieve the login information.
		JSONObject jsonRequest = new JSONObject(input);
		String username = jsonRequest.getString("username");
		String password = jsonRequest.getString("password");
		
		// Identifying the Client.
		Client client = loginDao.getClientWithUsername(username, password);
		
		if (client != null) {
			
			// generate the token from the userid, username, and password
			CodeDecodeTokens cdt = new CodeDecodeTokens();
			String token = cdt.generateToken(client.getId(), client.getUsername(), client.getPassword());
			
			String result = clientDao.setMessage("Success", token);
			return result;
		}
		
		String result = clientDao.setMessage("Failed", "Bad username or password.");
		return result;
	}
}
