import React from "react";

function ProductSelection() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-heading tracking-800">
        <span className="num">2. </span>
        <span>Select Products for Your Campaign</span>
      </h1>
      <p className="text-neutral-light tracking-40 text-sm">
        Amplify AI has fetched your products from Shopify. Select the ones you’d
        like to promote.
      </p>
    </div>
  );
}

export default ProductSelection;
