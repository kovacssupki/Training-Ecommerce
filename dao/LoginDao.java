package com.dao;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;

import com.beans.Client;
import com.encrypt.EncryptPassword;
import com.fasterxml.jackson.databind.ObjectMapper;

public class LoginDao {

	public Client getClientWithUsername(String username, String pass) {
		TransportClient transportClient = null;
		Client client = null;
		
		EncryptPassword encrypt = new EncryptPassword();
		
		String password = encrypt.encryptpasswordMD5(pass);
		
		try {
			transportClient =  TransportClient.builder().build()
			        .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("localhost"), 9300));
			
			SearchResponse response = transportClient.prepareSearch("shoppingcart")
					.setTypes("client")
					.setQuery(QueryBuilders.termQuery("username", username))
					.execute().actionGet();
			
			
			SearchHit[] hit = response.getHits().getHits();
			String s = hit[0].getSourceAsString();
			
			ObjectMapper mapper = new ObjectMapper();
			client = mapper.readValue(s, Client.class);
			client.setId(hit[0].getId());
			
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (transportClient != null) {
				transportClient.close();
			}
		}
		
		if (!password.equals(client.getPassword())) {
			return null;
		}
		
		return client;
	}
	
}
