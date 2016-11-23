/**
 * This Class is used to communicate to the front end of the application, through JSon objects.
 * Create, read, update and delete products.
 * The Path is "/product", and produces json objects.
 * 
 * @author sandor.naghi
 */

package com.service;

import java.util.List;

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

import com.beans.Product;
import com.dao.ProductDao;
import com.encrypt.CodeDecodeTokens;
import com.encrypt.MessageCreator;

@Path("/product")
@Produces(MediaType.APPLICATION_JSON)
public class ProductService {

	private ProductDao productDao = new ProductDao();
	private MessageCreator mc = new MessageCreator();
	private CodeDecodeTokens cdt = new CodeDecodeTokens();
	
	/**
	 * Get a list of all the Products available.
	 * @return	A List of all the Products available for the Clients.
	 */
	@GET
	@Path("/list")
	public String getAllProduts() {
		List<String> list = productDao.getProductList();
		
		if (list.isEmpty()) {
			String result = mc.setMessage("Failed", "No products.");
			return result;
		}
		
		return list.toString();
	}
	
	/**
	 * Get a description of a Product.
	 * @param id	The id of the Product.
	 * @return	Information about the Product.
	 */
	@GET
	@Path("/{id}/details")
	public String getProductByID(@PathParam("id") String id) {
		Product product = productDao.readProductById(id);
		String result = null;
		
		if (product == null) {
			result = mc.setMessage("Failed", "Inexistent product id.");
			return result;
		}
		JSONObject json = new JSONObject(product);
		json.remove("id");
		
		result = json.toString();
		return result;
	}
	
	/**
	 * Edit the Product. Only user with administrator rights can do it.
	 * @param id	The id of the Product.
	 * @param input	The new data for the Product.
	 * @param token	JavaWebToken, to identify the administrator.
	 * @return	Message of Success or Failure.
	 */
	@POST
	@Path("/{id}/edit")
	@Consumes(MediaType.APPLICATION_JSON)
	public String editProduct(@PathParam("id") String id, String input, @HeaderParam("token") String token) {
		String result = null;
		
		// If the token is empty the Response is Fail.
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// Identify the administrator user.
		boolean haveRights = cdt.userIsAdmin(token);
		if (!haveRights) {
			result = mc.setMessage("Failed", "Don't have administrator rights.");
			return result;
		}
		
		// Get the Product by the id.
		Product product = productDao.readProductById(id);
		if (product == null) {
			result = mc.setMessage("Failed", "Inexistent id.");
			return result;
		} else {
			product.setId(id);
			
			JSONObject json = null;
			try {
				json = new JSONObject(input);
				json.put("imageURL", product.getImageURL());
				productDao.updateProduct(product, json);
				result = mc.setMessage("Success", "Product updated.");
				return result;
			} catch (JSONException e) {
				result = mc.setMessage("Failed", "Invalid data.");
				return result;
			}
		}
		
	}
	
	/**
	 * Create a new Product, only user with administrator rights can do it.
	 * @param input	The data of the new Product. 
	 * @param token	JavaWebToken for identifying the administrator.
	 * @return	Message of Success or Failure.
	 */
	@POST
	@Path("/create")
	@Consumes(MediaType.APPLICATION_JSON)
	public String createProduct(String input, @HeaderParam("token") String token) {
		String result = null;
		
		// If no token response is Fail.
		if (token == null) {
			result = mc.setMessage("Failed", "No token.");
			return result;
		}
		
		// Verify if data provided is valid.
		boolean productDataExists = productDao.productDataExists(input);
		if (!productDataExists) {
			result = mc.setMessage("Failed", "Not correct data.");
			return result;
		}
		
		// Identify the administrator.
		boolean haveRights = cdt.userIsAdmin(token);
		if (!haveRights) {
			result = mc.setMessage("Failed", "Don't have administrator rights.");
			return result;
		}
		
		String id = productDao.createProduct(input);
		if (id != null) {
			result = "{\"Status\":\"Success\",\"Id\":\"" + id + "\"}";
			return result;
		} else {
			result = mc.setMessage("Failed", "Product already exists");
			return result;
		}
		
	}
	
	/**
	 * Delete a Product from the Application, only user with administrator rights can do it.
	 * @param id	The product id.
	 * @param token	JavaWebToken for identifying the administrator.
	 * @return Message of Success or Failure.
	 */
	@DELETE
	@Path("/{id}/delete")
	public String deleteProduct(@PathParam("id") String id, @HeaderParam("token") String token) {
		String result = null;
		
		// If token is empty, return Fail.
		if (token == null) {
			result = mc.setMessage("Failed", "No token.");
			return result;
		}
		
		// Verify administrator rights.
		boolean haveRights = cdt.userIsAdmin(token);
		if (!haveRights) {
			result = mc.setMessage("Failed", "Don't have administrator rights.");
			return result;
		}
		
		// Delete the product based upon the id.
		boolean deleted = productDao.deleteProduct(id);
		if (deleted) {
			result = mc.setMessage("Success", "Product deleted.");
			return result;
		} else {
			result = mc.setMessage("Failed", "Product doesn't exist.");
			return result;
		}
	}
}
