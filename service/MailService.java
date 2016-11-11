/**
 * This class is used to send an email to the Client, for registration, or password reseting.
 * The email is send from the email: "2016shoppingcart@gmail.com".
 * 
 * @author sandor.naghi
 */
package com.service;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class MailService {

	/**
	 * Sending an email.
	 * @param to	The Clients email address.
	 * @param subject	The subject of the email.
	 */
	public void sendMail(String to, String subject) {

		final String username = "2016shoppingcart@gmail.com";
		final String password = "2016ShopCart";

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		 });

		try {

			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("2016shoppingcart@gmail.com"));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
			message.setSubject("Hello");
			message.setText(subject);

			Transport.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException(e);
		}
	}
}