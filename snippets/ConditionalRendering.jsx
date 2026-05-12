//Conditional Rendering (The Clean Way)
//Avoid long ternary chains by creating a utility component or using an object lookup.

// Object Lookup Pattern
const STATUS_COLORS = {
  success: "green",
  error: "red",
  pending: "yellow",
};

const StatusBadge = ({ status }) => (
  <span style={{ color: STATUS_COLORS[status] || "gray" }}>
    {status.toUpperCase()}
  </span>
);