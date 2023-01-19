import { gql } from "@apollo/client";

const GET_ME = gql`
  query {
    me {
      id
      name
      email
      created_at
      updated_at
    }
  }
`;

const GET_PRODUCTS = gql`
  query ($title: String, $orderBy: [OrderByClause!], $first: Int, $page: Int) {
    products(title: $title, orderBy: $orderBy, first: $first, page: $page) {
      data {
        id
        slug
        title
        photoUrl
        price
        created_at
        updated_at
      }
      paginatorInfo {
        count
        total
        perPage
        lastPage
        currentPage
        hasMorePages
        lastItem
        firstItem
      }
    }
  }
`;

const GET_PRODUCT_BY_SLUG = gql`
  query ($slug: String) {
    product(slug: $slug) {
      id
      slug
      title
      description
      photoUrl
      price
      created_at
      updated_at
    }
  }
`;

const GET_CART_BY_USER_ID = gql`
  query ($user_id: ID!, $status: Int!) {
    cart(user_id: $user_id, status: $status) {
      id
      products {
        id
        title
        slug
        photoUrl
        price
        stripe_price_id
        pivot {
          quantity
        }
      }
    }
  }
`;

const GET_ORDERS_BY_USER_ID = gql`
  query ($user_id: ID, $orderBy: [OrderByClause!], $first: Int, $page: Int) {
    orders(user_id: $user_id, first: $first, page: $page, orderBy: $orderBy) {
      data {
        id
        uuid
        created_at
        updated_at
        user {
          id
          name
          email
        }
        cart {
          id
          status
          products {
            id
            slug
            title
            photoUrl
            price
            pivot {
              quantity
            }
          }
        }
      }
      paginatorInfo {
        count
        total
        perPage
        lastPage
        currentPage
        hasMorePages
        lastItem
        firstItem
      }
    }
  }
`;

export {
  GET_ME,
  GET_PRODUCTS,
  GET_PRODUCT_BY_SLUG,
  GET_CART_BY_USER_ID,
  GET_ORDERS_BY_USER_ID,
};
