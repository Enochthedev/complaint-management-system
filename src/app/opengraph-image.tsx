import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "UI CS Complaint System";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: "white",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: "bold",
              color: "#3b82f6",
              marginRight: 40,
            }}
          >
            UI
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "white",
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: "bold",
                margin: 0,
                lineHeight: 1,
              }}
            >
              CS Complaint System
            </h1>
            <p
              style={{
                fontSize: 32,
                margin: 0,
                opacity: 0.9,
                marginTop: 10,
              }}
            >
              University of Ibadan
            </p>
          </div>
        </div>
        <p
          style={{
            fontSize: 24,
            color: "white",
            opacity: 0.8,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Submit and track your academic complaints efficiently
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
