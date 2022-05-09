import React, { Component } from "react";
import ProductsTable from "./productsTable";
import { getProducts, deleteProduct } from "../services/productService";
import Paginations from "./common/paginations";
import { paginate } from "../utils/paginate";
import SearchBox from "./common/searchBox";
import _ from "lodash";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

class Products extends Component {
  state = {
    products: [],
    pageSize: 7,
    searchQuery: "",
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    const { data } = await getProducts();
    this.setState({ products: data });
  }

  handleDelete = async (product) => {
    // authorization : user should be a admin user (isAdmin property must be true for an admin user)
    const originalProducts = this.state.products;
    const products = originalProducts.filter((m) => m.id !== product.id);
    this.setState({ products });

    try {
      await deleteProduct(product.id);
      toast.success("Successfully Deleted");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("this product has already been deleted");

      this.setState({ products: originalProducts });
    }
  };

  handlePage = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      currentPage,
      pageSize,
      searchQuery,
      products: allProducts,
      sortColumn,
    } = this.state;

    let filtered = allProducts;
    if (searchQuery)
      filtered = allProducts.filter((m) =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const products = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: products };
  };

  render() {
    const { length: count } = this.state.products;
    const { currentPage, pageSize, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    const { totalCount, data: products } = this.getPagedData();

    return (
      <div className="row">
        <div className="col">
          {user && (
            <div className="row">
               <div className="col">
              <Link
                className="btn btn-primary"
                to="/products/new"
                style={{ marginBottom: 20 }}
              >
                New Item
              </Link>
              </div>
              <div className="col">
                <a
                style={{textAlign: 'right'}}
                target="_blank"
                href="http://localhost:8000/download"
                >
                  Export to CSV
                </a>
              </div>
            </div>
          )}
          <p>Total {totalCount} items</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <ProductsTable
            products={products}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />

          <Paginations
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePage}
          />
        </div>
      </div>
    );
  }
}

export default Products;
