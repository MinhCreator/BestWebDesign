// Fetching Data with `useEffect` (Clean Pattern)
// Standard way to handle asynchronous API calls inside a component.

const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true; // Prevent state updates on unmounted component

  fetch("https://api.example.com/data")
    .then((res) => res.json())
    .then((json) => {
      if (isMounted) {
        setData(json);
        setLoading(false);
      }
    });

  return () => {
    isMounted = false;
  };
}, []);