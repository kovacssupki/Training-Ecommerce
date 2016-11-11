/**
 * This class is used to communicate with the front end, through Json objects.
 * Used to register, create, activate, disable Clients.
 * 
 * @author sandor.naghi
 */

package com.service;

import java.io.IOException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.RandomStringUtils;
import org.json.JSONObject;

import com.beans.Client;
import com.dao.ClientDao;
import com.encrypt.CodeDecodeTokens;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@Path("/")
public class UserAdministrationService {

	private ClientDao clientDao = new ClientDao();
	private CodeDecodeTokens cdt = new CodeDecodeTokens();
	
	/**
	 * Registering a Client in the Application. Expects a POST Request, with data.
	 * @param input	Json object from the front end.
	 * @return	A Json string object with the success, or the failure of the operation, and a message with description.
	 */
	@POST
	@Path("/user/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String register(String input) {
		
		// If the data from the front is empty, it returns Failed.
		if (input.equals("")) {
			String result = clientDao.setMessage("Failed", "No data");
			return result;
		}
		
		// Creating a random activation code.
		String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		String activationcode = RandomStringUtils.random(10, chars);								// create random activationcode
		
		/*
		* Filling the data with additional information about the Client, like activation code.
		* From default all users all inactive, and none of them has administrator rights.
		*/
		JSONObject json = new JSONObject(input);
		json.put("isactive", false);
		json.put("activationcode", activationcode);
		json.put("isadmin", false);
		
		ObjectMapper mapper = new ObjectMapper();
		Client client = null;
		try {
			// Transforming the Json into a Client object.
			client = mapper.readValue(json.toString(), Client.class);
		} catch (JsonParseException | JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		// If user already exists return Failed.
		boolean exists = clientDao.clientExists(client);
		if (exists) {
			String result = clientDao.setMessage("Failed!", "Username exists.");
			return result;
		}

		// If the data provided is valid the return is Success, else Failed.
		boolean isValid = clientDao.validateClient(client);
		if (isValid) {
			String id = clientDao.insertClient(client);
			if (id != null) {
				client.setId(id);
				clientDao.sendRegistrationEmail(client);
			}
			String result = "{\"Status\":\"Success\",\n\"Message\":\"Registered.\",\n\"Id\":\"" + id + "\"}";
			return result;
		} else {
			String result = clientDao.setMessage("Failed", "Not registered.");
			return result;
		}
	}
	
	/**
	 * Activating the Client, based upon the activation code. 
	 * @param id	The id of the Client.
	 * @param activationcode	The activation code.
	 * @return	A Json string object with the success, or the failure of the operation, and a message with description.
	 */
	@GET
	@Path("user/{userid}/activate/{activationcode}")
	@Produces(MediaType.APPLICATION_JSON)
	public String userActivation(@PathParam ("userid") String id, @PathParam("activationcode") String activationcode) {
		Client client = clientDao.getClientWithId(id);
			
		if ((client != null) && (client.getActivationcode().equals(activationcode))) {
			client.setIsactive(true);
			clientDao.clientActivation(client, true);
			String result = clientDao.setMessage("Success", "Activated.");
			return result;
		}
		String result = clientDao.setMessage("Failed", "Inexistent Userid, or bad activation code.");
		return result;
	}
	
	/**
	 * Disabling the Client, only the user with administrator rights can do it.
	 * @param id	The id of Client.
	 * @param token	The JavaWebToken, that identifies the administrator.
	 * @return	The message, successful or failure.
	 */
	@POST
	@Path("/user/disable/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public String disbleUser(@PathParam("userid") String id, @HeaderParam("token") String token) {
		
		// If the token is empty the response is Failure.
		if (token == null){
			String result = clientDao.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// If the user don't have rights to disable the Client the response is Failure.
		boolean haveRights = cdt.userIsAdmin(token);
		if (!haveRights) {
			String result = clientDao.setMessage("Failed", "Don't have administrator permission to disable user.");
			return result;
		}
		
		Client client = clientDao.getClientWithId(id);
		
		if (client != null) {
			client.setIsactive(false);
			clientDao.clientActivation(client, false);
			String result = clientDao.setMessage("Success", "Disabled.");
			return result;
		}
		
		String result = clientDao.setMessage("Failed", "Inexistent Userid.");
		return result;
	}
	
	/**
	 * Activating the Client, only the user with administrator rights can do it.
	 * @param id	The id of the Client.
	 * @param token	The JavaWebToken, that identifies the administrator.
	 * @return	The message Success, or Fail.
	 */
	@POST
	@Path("/user/activate/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public String activateUser(@PathParam("userid") String id, @HeaderParam("token") String token) {
		
		// If the token is empty, the message is Fail.
		if (token == null){
			String result = clientDao.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// If the user don't have rights to activate the Client the response is Failure.
		boolean haveRights = cdt.userIsAdmin(token);
		if (!haveRights) {
			String result = clientDao.setMessage("Failed", "Don't have administrator permission to activate user.");
			return result;
		}
		
		// Identify the Client based upon his id.
		Client client = clientDao.getClientWithId(id);
		// If exists it's activated.
		if (client != null) {
			client.setIsactive(true);
			clientDao.clientActivation(client, true);
			String result = clientDao.setMessage("Success", "Activated.");
			return result;
		}
		
		String result = clientDao.setMessage("Failed", "Inexistent Userid.");
		return result;
	}
	
	/**
	 * Reset the password of a Client, only the user with administrator rights can do it.
	 * @param id	The Clients id.
	 * @param token	The JavaWebToken that identifies the administrator.
	 * @return	The message of Success or Failure.
	 */
	@POST
	@Path("/user/resetPassword/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public String resetPassword(@PathParam("userid") String id, @HeaderParam("token") String token) {
		
		// If the token is empty, the message is Fail.
		if (token == null){
			String result = clientDao.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// If the user don't have rights to activate the Client the response is Failure.
		boolean haveRights = cdt.userIsAdmin(token);
		if (!haveRights) {
			String result = clientDao.setMessage("Failed", "Don't have administrator permission.");
			return result;
		}
		
		// Identify the Client based upon the id.
		Client client = clientDao.getClientWithId(id);
		if (client != null) {
			// create random password
			String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			String newPassword = RandomStringUtils.random(10, chars);								
			// create the subject for the email
			String subject = "Dear " + client.getName() + " your new password is: " + newPassword;
			clientDao.sendResetPasswordEmail(client.getEmail(), subject);
			// setting the new password
			client.setPassword(newPassword);
			clientDao.resetPassword(client);
			
			String result = clientDao.setMessage("Success", "Password reset.");
			return result;
		}
		
		String result = clientDao.setMessage("Failed", "Inexistent Userid.");
		return result;
	}
	
	/**
	 * Get all Clients from the DB. Only user with administrator rights can do it.
	 * @param token	JavaWebToken that identifies the administrator user.
	 * @return	The list of all Clients, or null if it's none.
	 */
	@GET
	@Path("/user/userlist")
	@Produces(MediaType.APPLICATION_JSON)
	public String getUsers(@HeaderParam("token") String token) {
		
		// If the token is empty, the message is Fail.
		if (token == null){
			String result = clientDao.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// If the user don't have rights to activate the Client the response is Failure.
		boolean haveRights = cdt.userIsAdmin(token);
		if (!haveRights) {
			String result = clientDao.setMessage("Failed", "Don't have administrator permission.");
			return result;
		}
		
		List<String> list = clientDao.getUsersList();
		
		if (list.isEmpty()) {
			String result = "{\"Message\":\"No users.\"}";
			return result;
		}
		
		return list.toString();
	}
	
}

