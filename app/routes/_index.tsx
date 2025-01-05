import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "OGP" },
    { name: "description", content: "Remix OGP Viewer" },
  ];
};

interface OgpData {
  title: string;
  description: string;
  image: string;
}

export default function Index() {
  const [url, setUrl] = useState("");
  const [ogpData, setOgpData] = useState<[OgpData | null, boolean]>([null, false]);
  const [error, setError] = useState("");

  const fetchOgpData = async () => {
    setError("");
    setOgpData([null, false]);

    try {
      const response = await fetch(`/ogp?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const isCached = response.headers.get("X-Cache") === "HIT";

      if (response.ok) {
        setOgpData([data, isCached]);
      } else {
        setError(data.error || "Failed to fetch OGP data");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="container w-full max-w-screen-lg mx-auto flex flex-col space-y-4 py-4">
      <h1 className="text-2xl font-bold">Link Preview Demo</h1>
      <p className="text-gray-600">
        This is a simple OGP viewer. Enter a URL and click the "Fetch Preview" button to see the OGP data.
      </p>
      <p className="text-yellow-600">
        !Attention! This is using chache with Redis. You should keep in mind that a maximum of 1 day cache is used.
      </p>
      <input
        type="text"
        placeholder="Enter a URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="outline-none focus-visible:outline-none border border-sky-600 rounded px-2 py-1"
      />
      <button onClick={fetchOgpData} className="outline-none focus-visible:outline-none border border-sky-600 text-sky-600 rounded px-2 py-1">Fetch Preview</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {ogpData[0] && (
        <div className={`border border-gray-200 p-4 flex flex-col space-y-2`}>
          {
            ogpData[1] && (
              <p className="text-yellow-600">Cached</p>
            )
          }
          <h3 className="text-xl font-semibold">{ogpData[0].title}</h3>
          <p>{ogpData[0].description}</p>
          {ogpData[0].image && <img src={ogpData[0].image} alt="OGP Preview" style={{ width: "300px" }} />}
        </div>
      )}
    </div>
  );
}