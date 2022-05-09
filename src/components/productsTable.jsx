import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";
import authService from "../services/authService";

class ProductsTable extends Component {
  columns = [
    { path: "name", label: "Name" },
    { path: "cost", label: "Price" },
    { path: "description", label: "Description" }
  ];

  deleteColumn = {
    key: "delete",
    content: (product) => (
      <button
        onClick={() => this.props.onDelete(product)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    ),
  };

  editColumn = {
    key: "edit",
    content: (product) => (
      <Link
        className="btn btn-primary"
        to={`/products/${product.id}`}
        style={{ marginBottom: 20 }}
      >
        Edit
      </Link>
    )
  };

  constructor() {
    super();
    const user = authService.getCurrentUser();
    if (user){
      this.columns.push(this.editColumn);
      this.columns.push(this.deleteColumn);
    }
  }

  render() {
    const { products, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={products}
      />
    );
  }
}

export default ProductsTable;
