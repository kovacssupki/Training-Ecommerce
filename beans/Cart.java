package com.beans;

import java.util.Arrays;

public class Cart {

	private long id;
	private int totalQuantity;
	private long totalCost;
	private Product[] items;

	public Cart() {
	}

	public Cart(int totalQuantity, long totalCost, Product[] items) {
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

	public Product[] getItems() {
		return items;
	}

	public void setItems(Product[] items) {
		this.items = items;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (int) (id ^ (id >>> 32));
		result = prime * result + Arrays.hashCode(items);
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
		if (!Arrays.equals(items, other.items))
			return false;
		if (totalCost != other.totalCost)
			return false;
		if (totalQuantity != other.totalQuantity)
			return false;
		return true;
	}

}
