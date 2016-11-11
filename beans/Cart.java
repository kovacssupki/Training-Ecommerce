package com.beans;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Cart {

	private long id;
	
	@JsonProperty("totalQuantity")
	private int totalQuantity;
	
	@JsonProperty("totalCost")
	private long totalCost;
	
	@JsonProperty("items")
	private List<String> items;

	public Cart() {
	}

	public Cart(int totalQuantity, long totalCost, List<String> items) {
		this.totalQuantity = totalQuantity;
		this.totalCost = totalCost;
		this.items = items;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public int getTotalQuantity() {
		return totalQuantity;
	}

	public void setTotalQuantity(int totalQuantity) {
		this.totalQuantity = totalQuantity;
	}

	public long getTotalCost() {
		return totalCost;
	}

	public void setTotalCost(long totalCost) {
		this.totalCost = totalCost;
	}

	public List<String> getItems() {
		return items;
	}

	public void setItems(List<String> items) {
		this.items = items;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (int) (id ^ (id >>> 32));
		result = prime * result + ((items == null) ? 0 : items.hashCode());
		result = prime * result + (int) (totalCost ^ (totalCost >>> 32));
		result = prime * result + totalQuantity;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Cart other = (Cart) obj;
		if (id != other.id)
			return false;
		if (items == null) {
			if (other.items != null)
				return false;
		} else if (!items.equals(other.items))
			return false;
		if (totalCost != other.totalCost)
			return false;
		if (totalQuantity != other.totalQuantity)
			return false;
		return true;
	}

		
}
