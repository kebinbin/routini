import { useEffect } from "react";
import { useParams } from "routini";

export default function Search() {
  const { query } = useParams<{ query: string }>();
  useEffect(() => {
    //Do fetch to API here.
  }, []);

  return (
    <>
      <h1>Search results</h1>
      <p>{query}</p>
    </>
  );
}
