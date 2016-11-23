/**
 *  This class is used to communicate with the front end of the application, through json objects.
 *  Create, read, update and delete an Order.
 *  The Path of the Class is "/order", and produces Json objects.
 */

package com.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.beans.Order;
import com.dao.OrderDao;
import com.encrypt.CodeDecodeTokens;
import com.encrypt.MessageCreator;

@Path("/order")
@Produces(MediaType.APPLICATION_JSON)
public class OrderService {

	private MessageCreator mc = new MessageCreator();
	private CodeDecodeTokens cdt = new CodeDecodeTokens();
	private OrderDao orderDao = new OrderDao();
	
	/**
	 * Display information about the order. If logged in as a Client, display your order, 
	 * 		if logged in as an admin, display all of the orders.
	 * @param token	JavaWebToken to identify if it's a client or the admin.
	 * @return	Success or fail.
	 */
	@GET
	@Path("/list")
	public String getOrders(@HeaderParam("token") String token) {
		String result = null;
		
		// check the token
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// check if user is admin or client
		boolean isAdmin = cdt.userIsAdmin(token);
		if (isAdmin) {
			result = orderDao.getAllOrders().toString();
		} else {
			String userid = cdt.clientIsValid(token);
			if (userid != null) {
				result = orderDao.displayOrders(userid);
			} else {
				result = mc.setMessage("Failed", "Invalid token.");
			}
		}
		return result;
	}

	/**
	 * Display the details of the Order.
	 * @param orderid	id of Order.
	 * @param token		JavaWebToken to identify the Client.
	 * @return			Fail if the token is not valid, or details if the client is valid.
	 */
	@GET
	@Path("/{orderid}/details")
	public String getOrderDetails(@PathParam("orderid") String orderid, @HeaderParam("token") String token) {
		String result = null;
		
		// check the token
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		String userid = cdt.clientIsValid(token);
		// validate user and order id...
		Order order = orderDao.getOrderById(orderid);
		if (order == null) {
			result = mc.setMessage("Failed", "Inexistent orderid.");
			return result;
		} else if (userid == null || !userid.equals(order.getUserid())) {
			result = mc.setMessage("Failed", "Token not valid.");
			return result;
		} else {
			result = orderDao.displayOrderDetail(order);
		}
		return result;
	}

	/**
	 * Update the Order, insert or remove products. Only the admin can do it.
	 * @param orderid	Id of Order.
	 * @param token		JavaWebToken to identify the admin.
	 * @param input		Id of the Product, and the quantity in a json.
	 * @return			Success or fail.
	 */
	@POST
	@Path("/{orderid}/update")
	@Consumes(MediaType.APPLICATION_JSON)
	public String updateOrder(@PathParam("orderid") String orderid, @HeaderParam("token") String token, String input) {
		String result = null;
		
		// check the token
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// check the input
		if (input.equals("")) {
			result = mc.setMessage("Failed", "No quantity specified.");
			return result;
		}
		
		// check if it's admin
		boolean isAdmin = cdt.userIsAdmin(token);
		if (isAdmin) {
			result = orderDao.updateOrder(orderid, input);
		} else {
			result = mc.setMessage("Failed", "Not administrator.");
		}
		return result;
	}

	/**
	 * Confirm an order. Only the admin can do it.
	 * @param orderid	Id of Order.
	 * @param token		JavaWebToken to identify the admin.
	 * @return			Success or fail.
	 */
	@POST
	@Path("/{orderid}/confirm")
	public String confirmOrder(@PathParam("orderid") String orderid, @HeaderParam("token") String token) {
		String result = null;
		
		// check the token
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// check if user is admin
		boolean isAdmin = cdt.userIsAdmin(token);
		if (isAdmin) {
			result = orderDao.confirmRejectOrder(orderid, true);
		} else {
			result = mc.setMessage("Failed", "Not administrator.");
		}
		return result;
	}
	
	/**
	 * Reject an Order. Only  the admin can do it.
	 * @param orderid	Id of Order.
	 * @param token		JavaWebToken to identify the admin.
	 * @return			Success or fail.
	 */
	@POST
	@Path("/{orderid}/reject")
	public String rejectOrder(@PathParam("orderid") String orderid, @HeaderParam("token") String token) {
		String result = null;
		
		// check the token
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		// check if user is admin
		boolean isAdmin = cdt.userIsAdmin(token);
		if (isAdmin) {
			result = orderDao.confirmRejectOrder(orderid, false);
		} else {
			result = mc.setMessage("Failed", "Not administrator.");
		}
		return result;
	}

	/**
	 * Complete an order. Only the admin can do it.
	 * @param orderid	Id of the Order
	 * @param token		JavaWebToken to identify the admin.
	 * @return			Success or fail.
	 */
	@POST
	@Path("/{orderid}/completed")
	public String completedOrder(@PathParam("orderid") String orderid, @HeaderParam("token") String token) {
		String result = null;
		
		// check the token
		if (token == null){
			result = mc.setMessage("Failed", "Token not exists.");
			return result;
		}
		
		//check if user is admin
		boolean isAdmin = cdt.userIsAdmin(token);
		if (isAdmin) {
			result = orderDao.completeOrder(orderid);
		} else {
			result = mc.setMessage("Failed", "Not administrator.");
		}

		return result;
	}
	
}
