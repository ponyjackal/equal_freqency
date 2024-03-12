import { useEffect, useState } from "react";

const Layout = () => {
  const [layout, setLayout] = useState("");

  useEffect(() => {
    const fetchLayout = async () => {
      const data = await fetch("http://localhost:3000/get-layout", {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      setLayout(data.layout);
    };

    fetchLayout();
  }, [setLayout]);

  return (
    <div style={{ border: "1px solid #000", padding: "10px" }}>
      <p>{layout}</p>
    </div>
  );
};

export default Layout;
