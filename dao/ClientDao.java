package com.dao;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;

import com.beans.Client;
import com.encrypt.EncryptPassword;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.service.MailService;

public class ClientDao {
	
	public boolean validateClient(Client client) {
		if (isValidEmail(client.getEmail())) {
			return true;
		} else {
			return false;
		}
	}
	
	private boolean isValidEmail(String email) {
		
		Pattern pattern  = Pattern.compile("[a-zA-Z0-9_.]*@[a-zA-Z]*.[a-zA-Z]*");
		Matcher matcher = pattern.matcher(email);
		boolean result = matcher.matches();
		
		return result;
		
	}
	
	public String insertClient(Client client){
		// create a hash(md5) for the password, and repassword, and that will be saved in elasticsearch
		EncryptPassword encrypt = new EncryptPassword();
		client.setPassword(encrypt.encryptpasswordMD5(client.getPassword()));
		
		TransportClient transportClient = null;
		String id = null;
		
		try {
			transportClient =  TransportClient.builder().build()
			        .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));	
		
			IndexRequest indexRequest = new IndexRequest("shoppingcart", "client");
			indexRequest.source(new Gson().toJson(client));		
		
			IndexResponse response = transportClient.prepareIndex("shoppingcart", "client")
		        .setSource(new Gson().toJson(client))
		        .get();
			
			id = response.getId();
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}finally{
			if (transportClient != null) {
				transportClient.close();
			}
		}
		return id;
	}
	
	public Client getClientWithId(String id) {
		TransportClient transportClient = null;
		Client client = null;
	
		try {
			transportClient =  TransportClient.builder().build()
			        .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));

			GetResponse response = transportClient.prepareGet("shoppingcart", "client", id).get();
			
			if (!response.isExists()) {			// if the user with the id don't exists, return null
				return null;
			} else {
				ObjectMapper mapper = new ObjectMapper();
				client = mapper.readValue(response.getSourceAsString(), Client.class);
			}
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (transportClient != null) {
				transportClient.close();
			}
		}
		if (client != null) {
			client.setId(id);
		}
		
		return client;
	}
	
	public void clientActivation(Client client, boolean isactive) {
		TransportClient transportClient = null;
		
		try {
			transportClient = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			UpdateRequest updateRequest = new UpdateRequest("shoppingcart", "client", client.getId());
			
			updateRequest.doc(jsonBuilder().startObject().field("isactive", isactive).endObject());
			transportClient.update(updateRequest).get();
			
		} catch (UnknownHostException | InterruptedException | ExecutionException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (transportClient != null) {
				transportClient.close();
			}		
		}

	}
	
	public void resetPassword(Client client) {
		TransportClient transportClient = null;
		
		EncryptPassword encrypt = new EncryptPassword();
		client.setPassword(encrypt.encryptpasswordMD5(client.getPassword()));				// encrypt the password
		
		try {
			transportClient = TransportClient.builder().build()
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			UpdateRequest updateRequest = new UpdateRequest("shoppingcart", "client", client.getId());
			
			updateRequest.doc(jsonBuilder().startObject().field("password", client.getPassword()).endObject());
			transportClient.update(updateRequest).get();
			
		} catch (UnknownHostException | InterruptedException | ExecutionException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (transportClient != null) {
				transportClient.close();
			}		
		}

	}
	
	public boolean clienExists(Client newClient) {
		
		TransportClient transportClient = null;
		Client client = null;
		
		try {
			transportClient =  TransportClient.builder().build()
			        .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			SearchResponse response = transportClient.prepareSearch("shoppingcart")
					.setTypes("client")
					.setQuery(QueryBuilders.termQuery("username", newClient.getUsername()))
					.execute().actionGet();
			
			
			SearchHit[] hit = response.getHits().getHits();

			if (hit.length != 0) {
				String s = hit[0].getSourceAsString();
			
				ObjectMapper mapper = new ObjectMapper();
				client = mapper.readValue(s, Client.class);
			}
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (transportClient != null) {
				transportClient.close();
			}
		}
		
		if (client != null) {
			return true;
		}
		
		return false;
	}

	public void sendRegistrationEmail(Client client) {
		MailService mail = new MailService();

		String subject = "Dear " + client.getName() 
					+ "\nYou been registered to Shopping Cart."
					+ "\nYour username is " + client.getUsername() + "."
					+ "\nThe activation code is: " + client.getActivationcode()
					+ "\nThe activation link is: " + "http://localhost:8080/ShoppingCart/user/" + client.getId() + "/activate/" + client.getActivationcode();
		
		mail.sendMail(client.getEmail(), subject);
	}
	
	public void sendResetPasswordEmail(String emailAddress, String subject) {
		MailService mail = new MailService();
		
		mail.sendMail(emailAddress, subject);
	}
}
