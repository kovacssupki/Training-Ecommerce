package com.encrypt;

import java.security.Key;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

import com.beans.Client;
import com.dao.ClientDao;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


public class CodeDecodeTokens {
	
	private ClientDao clientDao = new ClientDao();
	
	public String generateToken(String id, String subject, String issuer, long ttlMillis) {
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
		long nowMillis = System.currentTimeMillis();
		Date now = new Date(nowMillis);
		
		byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(("Shopping cart"));
		Key signingkey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
		
		JwtBuilder builder = Jwts.builder().setId(id)
							.setIssuedAt(now)
							.setSubject(subject)
							.setIssuer(issuer)
							.signWith(signatureAlgorithm, signingkey);
		
		// add the expiration date
		if (ttlMillis >0 ){
			long expMillis = nowMillis + ttlMillis;
			Date exp = new Date(expMillis);
			builder.setExpiration(exp);
		}
		
		return builder.compact();
	}
	
	public Claims decodeToken(String token) {
		Claims claims = null;
		
		try {
			claims = Jwts.parser()
				.setSigningKey(DatatypeConverter.parseBase64Binary("Shopping cart"))
				.parseClaimsJws(token).getBody();
		} catch (ArrayIndexOutOfBoundsException e) {
			
		}
		
//		System.out.println("ID: " + claims.getId());
//		System.out.println("Subject: " + claims.getSubject());
//		System.out.println("Issuer: " + claims.getIssuer());
//		System.out.println("Expiration: " + claims.getExpiration());
		
		return claims;
	}
	
	public boolean inspectToken(String token) {
		Claims claims = decodeToken(token);
		Client admin = null;
		
		if (claims != null) {
			admin = clientDao.getClientWithId(claims.getId());
			if (admin.isIsadmin() && admin.getUsername().equals(claims.getSubject()) && admin.getPassword().equals(claims.getIssuer())) {
				return false;
			}
		}
		
		return true;
	}
}
