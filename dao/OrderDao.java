/**
 * This class is insert, update and delete the Orders in the DB, after processing the data.
 */

package com.dao;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.math.NumberUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.beans.Order;
import com.beans.Product;
import com.encrypt.MessageCreator;
import com.google.gson.Gson;

public class OrderDao {
	
	private ProductDao productDao = new ProductDao();
	private MessageCreator mc = new MessageCreator();
	
	/**
	 * Create the new Order in the DB.
	 * @param order	The Order, that will be inserted in the DB.
	 * @return	Id of the Order.
	 */
	public String createOrder(Order order) {
		String result = null;
		
		TransportClient client = null;
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			IndexResponse response = client.prepareIndex("shoppingcart", "order")
					 .setSource(new Gson().toJson(order))
				     .get();
			result = response.getId();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
		return result;
	}
	
	/**
	 * Read the Order from the DB.
	 * @param orderid	The Order id.
	 * @return	The Order from the DB.
	 */
	public Order getOrderById(String orderid) {
		Order order = null;
		
		TransportClient client = null;
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			GetResponse response = client.prepareGet("shoppingcart", "order", orderid).get();
			
			if (response.isExists()) {
				ObjectMapper mapper = new ObjectMapper();
				order = mapper.readValue(response.getSourceAsString(), Order.class);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
		return order;
	}
	
	/**
	 * Update the Order.
	 * @param order	Order that will be updated.
	 * @param orderid	Id of Order.
	 */
	private void updateOrder(Order order, String orderid) {
		deleteOrder(orderid);
		
		TransportClient client = null;
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			client.prepareIndex("shoppingcart", "order", orderid)
					 .setSource(new Gson().toJson(order))
				     .get();
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
	}
	
	/**
	 * Delete the Order.
	 * @param orderid	Id of the Order.
	 */
	private void deleteOrder(String orderid) {
		TransportClient client = null;
		
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			client.prepareDelete("shoppingcart", "order", orderid).get();
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Display the Client Order.
	 * @param userid	The Client id.
	 * @return	Information of the Order.
	 */
	public String displayOrders(String userid) {
		List<Order> orders = getOrdersByUserid(userid);
		
		// change the product id from the list with the product name....
		orders = changeProductIdToName(orders);
		JSONArray jsonArray = new JSONArray(orders);
		
		return jsonArray.toString();
	}
	
	/**
	 * Change the id from the list with the name of the product.
	 * @param orders	List of Orders with id's.
	 * @return	List of Orders with product names.
	 */
	private List<Order> changeProductIdToName(List<Order> orders) {
		for (Order order : orders) {
			List<String> newProductList = new ArrayList<>();
			
			List<String> productList = order.getItems();
			for (String s : productList) {
				if (!NumberUtils.isDigits(s)) {
					Product product = productDao.readProductById(s);
					newProductList.add(product.getProductname());
				} else {
					newProductList.add(s);
				}
			}
			order.setItems(newProductList);
		}
		return orders;
	}
	
	/**
	 * If the user is an administrator, not a simple Client, can see all of Orders.
	 * @return	A list of all orders.
	 */
	public String getAllOrders() {
		List<Order> list = new ArrayList<>();
		
		TransportClient client = null;
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			SearchResponse response = client.prepareSearch("shoppingcart")
					.setTypes("order")
					.setQuery(QueryBuilders.matchAllQuery())
					.execute().actionGet();
			
			SearchHit[] hits = response.getHits().getHits();
			if (hits.length != 0) {
				for (SearchHit hit : hits) {
					ObjectMapper mapper = new ObjectMapper();
					Order order = mapper.readValue(hit.getSourceAsString(), Order.class);
					list.add(order);
				}
				list = changeProductIdToName(list);
				JSONArray jsonArray = new JSONArray(list);
				
				return jsonArray.toString();
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
		return mc.setMessage("Success", "No orders.");
	}
	
	/**
	 * Display information in detail about the order.
	 * @param order	Order that will be processed.
	 * @return	Information in detail, about the Order.
	 */
	public String displayOrderDetail(Order order) {
		String result = null;
		
		JSONObject json = new JSONObject(order);
		json.remove("items");
		
		JSONArray jsonArray = new JSONArray();
		jsonArray.put(0, json);
		
		int index = 1;
		for (String productIdOrQuantity : order.getItems()) {
			if (!NumberUtils.isDigits(productIdOrQuantity)) {
				Product product  = productDao.readProductById(productIdOrQuantity);
				json = new JSONObject(product);
			} else {
				json.put("quantity", new Integer(productIdOrQuantity));
				jsonArray.put(index, json);
				index++;
			}
		}
		result = jsonArray.toString();
		return result;
	}
	
	// for users
	/**
	 * Display all information about the Client Orders.
	 * @param userid	Id of Client.
	 * @return	List of Orders, that the Client has.
	 */
	private List<Order> getOrdersByUserid(String userid) {
		List<Order> orders = new ArrayList<>();
		
		TransportClient client = null;
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			SearchResponse response = client.prepareSearch("shoppingcart")
					.setTypes("order")
					.setQuery(QueryBuilders.termQuery("userid", userid))
					.execute().actionGet();
			
			SearchHit[] hits = response.getHits().getHits();
			if (hits.length != 0) {
				for (SearchHit hit : hits) {
					ObjectMapper mapper = new ObjectMapper();
					Order order = mapper.readValue(hit.getSourceAsString(), Order.class);
					orders.add(order);
				}
			} else {
				return null;
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
		return orders;
	}
	
	/**
	 * Update the Order.
	 * @param orderid	Id of Order.
	 * @param input	Information about the update.
	 * @return
	 */
	public String updateOrder(String orderid, String input) {
		String result = null;
		Product product = null;
		
		// check if order exists
		Order order = getOrderById(orderid);
		if (order == null) {
			result = mc.setMessage("Failed", "Inexistent orderid.");
		} else {
			JSONObject json = null;
			try {
				// create a json from the input, if it's valid, ask for the product 
				json = new JSONObject(input);
				product = productDao.readProductById(json.getString("productid"));
			} catch (JSONException e) {
				e.printStackTrace();
				result = mc.setMessage("Failed", "Invalid data.");
				return result;
			}
			
			if (product == null) {
				result = mc.setMessage("Failed", "Inexistent product.");
				return result;
			}
			
			// validate the quantity from the input
			int quantity = json.getInt("quantity");
			if (quantity == 0 || quantity > product.getInstock()) {
				result = mc.setMessage("Failed", "Invalid quantity.");
			} else {
				result = addRemoveProductsInOrder(order, product, quantity, orderid);
			}
		}
		return result;
	}
	
	/**
	 * Add or remove Products from an Order, only the Administrator can do it.
	 * @param order	Order we will modify. 
	 * @param product	Product added or removed from the Order.
	 * @param quantity	Number of Products added or removed.
	 * @param orderid	Id of order.
	 * @return	Success or Fail.
	 */
	private String addRemoveProductsInOrder(Order order, Product product, int quantity, String orderid) {
		String result = null;
		
		List<String> productList = order.getItems();
		// a lot of ugly calculation....
		if (productList.contains(product.getId())) {
			int index = productList.indexOf(product.getId()) + 1;
			
			int oldQuantity = Integer.parseInt(productList.get(index));
			int newQuantity = oldQuantity + quantity;
			
			if (newQuantity < 0) {
				result = mc.setMessage("Failed", "Quantity to much to remove.");
				return result;
			} else if (newQuantity == 0) {
				productList.remove(index);
				productList.remove(product.getId());
			} else {
				productList.set(index, String.valueOf(newQuantity));
			}
		} else {
			if (quantity <= 0) {
				result = mc.setMessage("Failed", "Can't add 0 or less quantity.");
				return result;
			}
			productList.add(product.getId());
			productList.add(String.valueOf(quantity));
			order.setItems(productList);
		}	
		
		int newTotalQuantity = order.getTotalquantity() + quantity;
		long newTotalCost = order.getTotalcost() + (product.getPrice() * quantity);
		order.setTotalcost(newTotalCost);
		order.setTotalquantity(newTotalQuantity);
		
		updateOrder(order, orderid);
		
		result = mc.setMessage("Success", "Order updated.");
		return result;		
	}
	
	/**
	 * Confirm or reject an Order. Only the admin has the rights to do it.
	 * @param orderid	Id of the Order.
	 * @param state	true if it's confirmed, false if it's rejected.
	 * @return	Success or fail.
	 */
	public String confirmRejectOrder(String orderid, boolean state) {
		String result = null;
		
		Order order = getOrderById(orderid);
		if (order == null) {
			result = mc.setMessage("Failed", "Inexistent orderid.");
			return result;
		} else {
			order.setConfirmed(state);
			updateOrder(order, orderid);
			
			result = mc.setMessage("Success", "Order confirmed/rejected.");
			return result;
		}
	}
	
	/**
	 * Complete the Order, only the admin has the rights to do it.
	 * @param orderid	Id of the Order.
	 * @return	Success or fail.
	 */
	public String completeOrder(String orderid) {
		String result = null;
		
		Order order = getOrderById(orderid);
		
		if (order == null) {
			result = mc.setMessage("Failed", "Inexistent orderid.");
		} else if (!order.isConfirmed()) {
			result = mc.setMessage("Failed", "Cannot complete a rejected order.");
		} else {
			order.setCompleted(true);
			updateOrder(order, orderid);
			result = mc.setMessage("Success", "Order completed");
		}
		return result;
	}
}
