import { useParams } from "routini";

export default function Product() {
  const { productId } = useParams();
  return (
    <>
      <h1>Product page</h1>
      <p>{productId}</p>
    </>
  );
}
