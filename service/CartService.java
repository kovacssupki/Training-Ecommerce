package com.service;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.dao.CartDao;
import com.dao.ClientDao;
import com.encrypt.CodeDecodeTokens;

@Path("/cart")
public class CartService {

	private CartDao cartDao = new CartDao();
	private ClientDao clientDao = new ClientDao();
	private CodeDecodeTokens cdt = new CodeDecodeTokens();
	
	@POST
	@Path("/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getClientProducts(@PathParam("userid") String userid,@HeaderParam("token") String token) {
		String result = null;
		
		if (token == null){
			result = clientDao.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		boolean hasRights = cdt.clientHasRights(token);
		if (hasRights) {
			result = cartDao.getClientProducts(userid);
			return result;
		} else {
			result = clientDao.setMessage("Failed", "Not identified user");
			return result;
		}
	}
	
}
