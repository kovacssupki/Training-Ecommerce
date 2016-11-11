/**
 *  This class is used to make Product verifications, inserts, and queries in the Elasticsearch DB.
 *  
 *  @author sandor.naghi
 */

package com.dao;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.json.JSONException;
import org.json.JSONObject;

import com.beans.Product;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;


public class ProductDao {
	
	/**
	 * Getting a List of all the products from the DB.
	 * @return	The list of products existing in DB, or null if it's empty.
	 */
	public List<String> getProductList() {
		TransportClient client = null;
		List<String> list = new ArrayList<>();

		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));

			SearchResponse response = client.prepareSearch("shoppingcartprod")
					.setTypes("product")
					.setQuery(QueryBuilders.matchAllQuery())
					.execute().actionGet();
			
			SearchHit[] hits = response.getHits().getHits();
			if (hits.length != 0) {
				for (SearchHit hit : hits) {
					
					JSONObject json = new JSONObject(hit.getSourceAsString());
					json.remove("description");
					
					list.add(json.toString());
				}
			}
			
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
		return list;
	}
	
	/**
	 * Getting a product from DB, identified by the id.
	 * @param id	The id of the Product.
	 * @return	The product, if exists, or null if not. 
	 */
	public Product getProductById(String id) {
		TransportClient client = null;
		Product product = null;
						
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			GetResponse response = client.prepareGet("shoppingcartprod", "product", id).get();
			
			if (response.isExists()) {
				ObjectMapper mapper = new ObjectMapper();
				product = mapper.readValue(response.getSourceAsString(), Product.class);
			}
			
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
		
		return product;
	}

	/**
	 * Updating a product, the price, the number in the stock, or the description.
	 * @param product	The Product need to be updated.
	 * @param input	A Json object with the information that updates the Product.
	 */
	public void updateProduct(Product product, String input) {
		JSONObject json = new JSONObject(input);
		TransportClient client = null;
		
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			UpdateRequest updateRequest = new UpdateRequest("shoppingcartprod", "product", product.getId());
			
			updateRequest.doc(jsonBuilder().startObject().field("name", json.get("name"))
					.field("instock", json.get("instock"))
					.field("price", json.get("price"))
					.field("description", json.get("description"))
					.endObject());
			client.update(updateRequest).get();
			
		} catch (JSONException | IOException | InterruptedException | ExecutionException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
	}
	
	/**
	 * Checking if a Product exists in the DB.
	 * @param newProduct	The product needed to be checked.
	 * @return	true if exists, false if not.
	 */
	private boolean productExists(Product newProduct) {
		TransportClient client = null;
		Product product = null;
				
		try {
			client = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			SearchResponse response = client.prepareSearch("shoppingcartprod")
					.setTypes("product")
					.setQuery(QueryBuilders.termQuery("name", newProduct.getName()))
					.execute().actionGet();
			
			SearchHit[] hit = response.getHits().getHits();

			if (hit.length != 0) {
				String s = hit[0].getSourceAsString();
			
				ObjectMapper mapper = new ObjectMapper();
				product = mapper.readValue(s, Product.class);
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (client != null) {
				client.close();
			}
		}
		
		if (product == null) {
			return false;
		}

		return true;
	}
	
	/**
	 * Inserting a new product in the DB.
	 * @param input	The data of the new Product.
	 * @return	The id of the new inserted Product, or null if the insertion was not successful.
	 */
	public String createProduct(String input){
		Product product = null;
		String id = null;
		
		try {
			ObjectMapper mapper = new ObjectMapper();
			product = mapper.readValue(input, Product.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		if (product != null && !productExists(product)) {
			TransportClient client = null;
			
			try {
				client = TransportClient.builder().build()
						.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
				IndexResponse response = client.prepareIndex("shoppingcartprod", "product")
				        .setSource(new Gson().toJson(product))
				        .get();
					
					id = response.getId();
					
			} catch (UnknownHostException e) {
				e.printStackTrace();
			} finally {
				if (client != null) {
					client.close();
				}
			}
		} 
		
		return id;
	}
	
	/**
	 * Deleting a Product from the DB.
	 * @param id	The id of the Product.
	 * @return	true if the deletion was successful, or false if not.
	 */
	public boolean deleteProduct(String id) {
		Product product = getProductById(id);
		
		if (product != null) {
			TransportClient client = null;
			
			try {
				client = TransportClient.builder().build()
						.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
				
				DeleteResponse response = client.prepareDelete("shoppingcartprod", "product", id).get();
				
				if (!response.getId().equals(id)) {			// to be shore that product is deleted
					return false;
				}
				
			} catch (UnknownHostException e) {
				e.printStackTrace();
			} finally {
				if (client != null) {
					client.close();
				}
			}
			
			return true;
		}
		
		return false;
	}
	
	/**
	 * Verifying if the data from the Request is valid.
	 * @param input	The data from the Request.
	 * @return	true if the data is valid, false if not.
	 */
	public boolean productDataExists(String input) {
		if (input.equals("")){
			return false;
		}
		
		JSONObject json = new JSONObject(input);
		if (json.get("name").equals("") || json.get("description").equals("") || json.getInt("instock") <= 0 || json.getLong("price") <= 0) {
			return false;
		}
		
		return true;
	}
}
