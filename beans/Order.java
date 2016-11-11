package com.beans;

import java.util.Arrays;

public class Order {

	private long id;
	private Product[] items;

	public Order() {

	}

	public Order(Product[] items) {
		this.items = items;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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
		Order other = (Order) obj;
		if (id != other.id)
			return false;
		if (!Arrays.equals(items, other.items))
			return false;
		return true;
	}

}
