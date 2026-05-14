import { useParams } from "../routini/hooks/useParams";

export default function Product() {
  const { productId } = useParams();
  return (
    <>
      <h1>Product page</h1>
      <p>{productId}</p>
    </>
  );
}
