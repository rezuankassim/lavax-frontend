import { gql } from "@apollo/client";

const CREATE_CART = gql`
  mutation ($input: CreateCartInput!) {
    createCart(input: $input) {
      id
      user {
        name
      }
    }
  }
`;

const UPDATE_CART = gql`
  mutation ($input: UpdateCartInput!) {
    updateCart(input: $input) {
      id
      user {
        name
      }
    }
  }
`;

const CREATE_ORDER = gql`
  mutation ($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;

export { CREATE_CART, UPDATE_CART, CREATE_ORDER };
