/**
 * This class is one of the Bean classes of the application.
 * It contains information about the product:
 * 	name	- Name of the product.
 * 	description	- Description of the product.
 * 	instock	- Number of product in the stock.
 * 	price	- The price of the product.
 * 
 * @author sandor.naghi
 */

package com.beans;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Product {

	private String id;
	@JsonProperty("name")
	private String name;
	@JsonProperty("description")
	private String description;
	@JsonProperty("instock")
	private int instock;
	@JsonProperty("price")
	private long price;

	/**
	 * Default constructor of the Class.
	 */
	public Product() {
	}

	/**
	 * Constructor with arguments of the class.
	 * @param name	Name of product.
	 * @param descirption	Description of product.
	 * @param instock	Number of products in stock.
	 * @param price	The price of the product.
	 */
	public Product(String name, String descirption, int instock, long price) {
		this.name = name;
		this.description = descirption;
		this.instock = instock;
		this.price = price;
	}

	/**
	 * Public getters and setters.
	 */
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getInstock() {
		return instock;
	}

	public void setInstock(int instock) {
		this.instock = instock;
	}

	public long getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}

	/**
	 * The overridden hashcode method.
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + instock;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + (int) (price ^ (price >>> 32));
		return result;
	}

	/**
	 * The overridden equals method.
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Product other = (Product) obj;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (instock != other.instock)
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (price != other.price)
			return false;
		return true;
	}

	
}
