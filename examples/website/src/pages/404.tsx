import { Link } from "routini";
console.log("404 page imported");
export default function Default404() {
  console.log("404 page rendered");
  return (
    <>
      <h1>404 NOT FOUND</h1>
      <p>This page does not exist.</p>
      <Link to="/">Go back to home.</Link>
    </>
  );
}
