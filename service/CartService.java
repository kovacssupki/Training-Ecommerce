/**
 * This class is used to communicate with the front end of the application, through json objects.
 * Create, read, update and delete a Cart.
 * The Path of the class is "/cart", and produces JSON objects.
 * 
 * @author sandor.naghi
 */

package com.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONException;
import org.json.JSONObject;

import com.dao.CartDao;
import com.encrypt.CodeDecodeTokens;
import com.encrypt.MessageCreator;

@Path("/cart")
@Produces(MediaType.APPLICATION_JSON)
public class CartService {

	private CartDao cartDao = new CartDao();
	private MessageCreator mc = new MessageCreator();
	private CodeDecodeTokens cdt = new CodeDecodeTokens();
	
	/**
	 * Display all of the Products the Client has in his Cart.
	 * @param userid	Id of user.
	 * @param token		JavaWebToken to identify the Client.
	 * @return			A String with all of Products.
	 */
	@GET
	@Path("/{userid}")
	public String getClientProducts(@PathParam("userid") String userid,@HeaderParam("token") String token) {
		String result = null;
		
		// if token not exists return fail
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// identify the user, check if have rights to  make the call
		boolean hasRights = cdt.clientHasRights(token, userid);
		if (hasRights) {
			result = cartDao.getClientProducts(userid).toString();
			
			if (result == null) {
				result = mc.setMessage("Failed", "No items in the cart.");
			}
			
			return result;
		} else {
			result = mc.setMessage("Failed", "Not identified user");
			return result;
		}
	}
	
	/**
	 * Add a Product to a Cart.
	 * @param userid	Id of Client.
	 * @param productid	Id of Product.
	 * @param token		JavaWebToken to identify the Client.
	 * @param input		Number of products added.
	 * @return			Success or fail.
	 */
	@POST
	@Path("/{userid}/additem/{productid}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String addProductToCart(@PathParam("userid") String userid, @PathParam("productid") String productid, @HeaderParam("token")String token, String input) {
		String result = null;
		
		// check the token
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// check the input
		if (input.equals("")) {
			result = mc.setMessage("Failed", "No quantity specified, or quantity to small.");
			return result;
		}
		
		int quantity = 0;
		try {
			// create a json object from the input, if the input is not valid return fail..
			JSONObject jsonObject = new JSONObject(input);
			quantity = jsonObject.getInt("quantity");
			if (quantity <= 0 ) {
				result = mc.setMessage("Failed", "Can't add 0 or negative number.");
				return result;
			}
		} catch (JSONException e){
			result = mc.setMessage("Failed", "Inserted data invalid.");
			return result;
		}
		
		// check if Client have rights to add a product to cart
		boolean hasRights = cdt.clientHasRights(token, userid);
		if (hasRights) {
			result = cartDao.addProductToCart(userid, productid, quantity);
			return result;
		} else {
			result = mc.setMessage("Failed", "Not identified user, or not active.");
			return result;
		}
	}
	
	/**
	 * Delete a Product from the Cart.
	 * @param userid	Id of Client.
	 * @param productid	Id of Product.
	 * @param token		JavaWebToken to identify the client.
	 * @param input		Number of products removed. 
	 * @return			Success or fail.
	 */
	@DELETE
	@Path("/{userid}/removeitem/{productid}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String removeProductFromCart(@PathParam("userid") String userid, @PathParam("productid") String productid, @HeaderParam("token") String token, String input) {
		String result = null;
		
		// check if token is not empty
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// check if the input is not empty
		if (input.equals("")) {
			result = mc.setMessage("Failed", "No quantity specified.");
			return result;
		}
		
		int quantity = 0;
		try {
			// create a json object from the input, and retrieve the quantity
			JSONObject jsonObject = new JSONObject(input);
			quantity = jsonObject.getInt("quantity");
			if (quantity <= 0) {
				result = mc.setMessage("Failed", "Can't remove 0 or negative number.");
				return result;
			}
		} catch (JSONException e){
			result = mc.setMessage("Failed", "Inserted data invalid.");
			return result;
		}
		
		// check if user have rights
		boolean hasRights = cdt.clientHasRights(token, userid);
		if (hasRights) {
			result = cartDao.removeProductFromCart(userid, productid, quantity);
			return result;
		} else {
			result = mc.setMessage("Failed", "Not identified user");
			return result;
		}
	}
	
	/**
	 * Create an Order from the Cart.
	 * @param userid	Id of Client.
	 * @param token		JavaWebToken to identify the Client.
	 * @return			Success or fail.
	 */
	@GET
	@Path("/{userid}/checkout")
	public String checkoutCart(@PathParam("userid") String userid, @HeaderParam("token") String token) {
		String result = null;
		
		// check the token
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// if client have the rights, return success, else return fail
		boolean hasRights = cdt.clientHasRights(token, userid);
		if (hasRights) {
			result = cartDao.checkoutCart(userid);
		} else {
			result = mc.setMessage("Failed", "Not identified user");
		}
		
		return result;
	}
}
