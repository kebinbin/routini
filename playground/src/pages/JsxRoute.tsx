export default function JsxRoute() {
  return (
    <>
      <h1 className="page-title">JSX &lt;Route&gt; form</h1>
      <p className="page-intro">
        This route wasn’t in the <code>routes</code> array — it’s declared as a{" "}
        <code>&lt;Route path="/jsx-route" lazy=&#123;...&#125; /&gt;</code> child
        of <code>&lt;Router&gt;</code> in <code>App.tsx</code>. Router
        concatenates array routes and <code>&lt;Route&gt;</code> children, so
        both forms work together.
      </p>
    </>
  );
}
