import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getProduct, saveProduct } from "../services/productService";
import { Link } from "react-router-dom";

class ProductForm extends Form {
  state = {
    data: {
      name: "",
      cost: "",
      description: ""
    },
    errors: {},
  };

  schema = {
    id: Joi.number(),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    cost: Joi.number()
      .required()
      .min(0)
      .label("Price")
  };

  async populateProduct() {
    try {
      const productId = this.props.match.params.id;
      if (productId === "new") return;

      const { data: product } = await getProduct(productId);
      this.setState({ data: this.mapToViewModel(product) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateProduct();
  }

  mapToViewModel(product) {
    return {
      id: product.id,
      name: product.name,
      cost: product.cost,
      description: product.description
    };
  }

  doSubmit = async () => {
    await saveProduct(this.state.data);

    this.props.history.push("/products");
  };
  render() {
    return (
      <div>
        <h1>{this.props.match.params.id === 'new' ? 'Add' : 'Edit'} Item</h1>
        <form action="" onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("description", "Description")}
          {this.renderInput("cost", "Price", "number")}
          <Link
              className="btn btn-primary"
              to="/products"
              style={{ marginRight: 20 }}
            >
              Cancel
            </Link>
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default ProductForm;
