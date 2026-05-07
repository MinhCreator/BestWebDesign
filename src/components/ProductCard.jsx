const ProductCard = ({ props }) => {
    return (
        <>
        <div key={props.id} className="j-card">
              {props.badge && <div className="j-badge">{props.badge}</div>}
              <button className={`j-heart-btn ${props.heartFilled ? 'filled' : ''}`}>
                <svg viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <img src={props.img} alt={props.name} className="j-props-img" />
              <div className="j-brand">{props.brand}</div>
              <div className="j-name">{props.name}</div>
              <div className="j-price-row">
                <span className="j-price">$ {props.price.toFixed(2)}</span>
                {props.oldPrice && (
                  <span className="j-old-price">$ {props.oldPrice.toFixed(2)}</span>
                )}
              </div>
              <button className="j-add-btn">View Details</button>
            </div>
        </>
    )
}

export default ProductCard