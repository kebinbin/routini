import { Link } from "../routini/components/Link";

export default function Home() {
  const lang = "en"; // This could be dynamic based on user preference or browser settings
  const search = "123456"; // Example search query
  const productId = "567"; // Example product ID
  return (
    <>
      <h1>Home</h1>
      <Link to={`/${lang}/about`}>Go to about in {lang}</Link>
      <Link to={`/search/${search}`}>Search for {search}</Link>
      <Link to={`/product/${productId}`}>Go to product {productId}</Link>
      <Link to="/dashboard">Go to dashboard (protected route)</Link>
      <Link to={`/login`}>Login</Link>
      <Link to="/contact">Contact us</Link>
    </>
  );
}
