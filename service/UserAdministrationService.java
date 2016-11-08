package com.service;

import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

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
	
	@POST
	@Path("/user/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response register(String input) {
		
		String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		String activationcode = RandomStringUtils.random(10, chars);								// create random activationcode
		
		JSONObject json = new JSONObject(input);
		json.put("isactive", false);
		json.put("activationcode", activationcode);
		json.put("isadmin", false);
		
		ObjectMapper mapper = new ObjectMapper();
		Client client = null;
		try {
			client = mapper.readValue(json.toString(), Client.class);
		} catch (JsonParseException | JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		boolean exists = clientDao.clienExists(client);
		if (exists) {
			return Response.status(400).header("Status", "Failed").header("Message", "Username exists").build();
		}
		
		boolean isValid = clientDao.validateClient(client);
		if (isValid) {
			String id = clientDao.insertClient(client);
			if (id != null) {
				client.setId(id);
				clientDao.sendRegistrationEmail(client);
			}
			return Response.status(200).header("Status", "Success").header("Message", "Registered").header("Id:", id).build();
		} else {
			return Response.status(400).header("Status", "Failed").header("Message", "Not registered").build();
		}
	}
	
	@GET
	@Path("user/{userid}/activate/{activationcode}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userActivation(@PathParam ("userid") String id, @PathParam("activationcode") String activationcode) {
		Client client = clientDao.getClientWithId(id);
			
		if ((client != null) && (client.getActivationcode().equals(activationcode))) {
			client.setIsactive(true);
			clientDao.clientActivation(client, true);
			return Response.status(200).header("Status", "Success").header("Message", "Activated.").build();
		}
		return Response.status(400).header("Status", "Failed").header("Message", "Inexistent Userid, or bad activation code!").build();
	}
	
	@POST
	@Path("/user/disable/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response disbleUser(@PathParam("userid") String id, @HeaderParam("token") String token) {
		
		boolean haveRights = cdt.inspectToken(token);
		
		if (haveRights) {
			return Response.status(400).header("Status", "Failed").header("Message", "Don't have administrator permission to disable user!").build();
		}

		
		Client client = clientDao.getClientWithId(id);
		
		if (client != null) {
			client.setIsactive(false);
			clientDao.clientActivation(client, false);
			return Response.status(200).header("Status", "Success").header("Message", "Disabled.").build();
		}
		
		return Response.status(400).header("Status", "Failed").header("Message", "Inexistent Userid!").build();
	}
	
	@POST
	@Path("/user/activate/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response activateUser(@PathParam("userid") String id, @HeaderParam("token") String token) {
		
		boolean haveRights = cdt.inspectToken(token);
		
		if (haveRights) {
			return Response.status(400).header("Status", "Failed").header("Message", "Don't have administrator permission to activate user!").build();
		}
		
		Client client = clientDao.getClientWithId(id);
		
		if (client != null) {
			client.setIsactive(true);
			clientDao.clientActivation(client, true);
			return Response.status(200).header("Status", "Success").header("Message", "Activated.").build();
		}
		
		return Response.status(400).header("Status", "Failed").header("Message", "Inexistent Userid!").build();
	}
	
	@POST
	@Path("/user/resetPassword/{userid}")
	public Response resetPassword(@PathParam("userid") String id, @HeaderParam("token") String token) {
		
		boolean haveRights = cdt.inspectToken(token);
		
		if (haveRights) {
			return Response.status(400).header("Status", "Failed").header("Message", "Don't have administrator permission!").build();
		}
		
		Client client = clientDao.getClientWithId(id);
		
		if (client != null) {
			String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			String newPassword = RandomStringUtils.random(10, chars);								// create random password
			
			String subject = "Dear " + client.getName() + " your new password is: " + newPassword;
			clientDao.sendResetPasswordEmail(client.getEmail(), subject);
			
			client.setPassword(newPassword);
			clientDao.resetPassword(client);
			
			return Response.status(200).header("Status", "Success").header("Message", "Password reset.").build();
		}
		
		return Response.status(400).header("Status", "Failed").header("Message", "Inexistent Userid!").build();
	}
	
}

