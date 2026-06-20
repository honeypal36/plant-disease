import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const remedies = {
    "Early Blight": {
      color: "text-orange-600",
      steps: [
        "Remove infected leaves immediately",
        "Avoid overhead irrigation",
        "Maintain proper spacing between plants",
      ],
      treatment: [
        "Spray Mancozeb fungicide",
        "Apply Chlorothalonil",
        "Repeat treatment every 7-10 days",
      ],
    },

    "Late Blight": {
      color: "text-red-600",
      steps: [
        "Remove infected plants immediately",
        "Avoid excess moisture",
        "Improve air circulation",
      ],
      treatment: [
        "Apply Metalaxyl fungicide",
        "Use Copper-based fungicides",
        "Monitor crop daily",
      ],
    },

    Healthy: {
      color: "text-green-600",
      steps: [
        "No disease detected",
        "Continue regular monitoring",
      ],
      treatment: [
        "Maintain balanced fertilization",
        "Use proper irrigation practices",
      ],
    },
  };

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const predict = async () => {
    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div
      className="
      min-h-screen
      w-full
      bg-[url('./assets/bg_farm.avif')]
      bg-cover
      bg-center
      bg-no-repeat
      "
    >
      {/* Navbar */}
      <div className="flex flex-col h-16 w-full bg-green-900 items-center justify-center rounded-b-xl shadow-lg">
        <h1 className="text-white font-extrabold font-chelsea text-3xl">
          Plant Disease Detection
        </h1>

        <h6 className="text-green-200">
          Making Indian farmers technologically smart
        </h6>
      </div>

      {/* Main Card */}
      <div className="flex justify-center items-center py-10">
        <div
          className="
          w-[90%]
          max-w-xl
          p-8
          rounded-3xl
          bg-white/20
          backdrop-blur-lg
          border border-white/30
          shadow-2xl
          "
        >
          {/* Upload */}
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center cursor-pointer"
          >
            <FaCloudUploadAlt
              size={80}
              className="text-green-800"
            />

            <p className="mt-3 text-xl font-semibold">
              Upload Plant Leaf Image
            </p>
          </label>

          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="
              w-full
              h-72
              object-cover
              rounded-2xl
              mt-6
              shadow-lg
              "
            />
          )}

          {/* Predict Button */}
          <button
            onClick={predict}
            disabled={loading}
            className="
            w-full
            mt-6
            py-3
            rounded-xl
            bg-green-800
            hover:bg-green-900
            text-white
            font-semibold
            transition
            disabled:opacity-50
            "
          >
            {loading ? "Predicting..." : "Predict Disease"}
          </button>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center mt-6">
              <div
                className="
                h-12
                w-12
                border-4
                border-green-800
                border-t-transparent
                rounded-full
                animate-spin
                "
              ></div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div
              className="
              mt-8
              p-6
              rounded-2xl
              bg-white/40
              backdrop-blur-md
              "
            >
              <h2
                className={`text-3xl font-bold ${
                  remedies[result.class]?.color
                }`}
              >
                {result.class}
              </h2>

              <div className="mt-3">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">
                    Confidence
                  </span>

                  <span>
                    {(result.confidence * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div
                    className="bg-green-700 h-3 rounded-full"
                    style={{
                      width: `${
                        result.confidence * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Immediate Steps */}
              <div className="mt-6">
                <h3 className="font-bold text-lg">
                  Immediate Steps
                </h3>

                <ul className="list-disc ml-6 mt-2">
                  {remedies[result.class]?.steps.map(
                    (step, idx) => (
                      <li key={idx}>{step}</li>
                    )
                  )}
                </ul>
              </div>

              {/* Treatment */}
              <div className="mt-6">
                <h3 className="font-bold text-lg">
                  Recommended Treatment
                </h3>

                <ul className="list-disc ml-6 mt-2">
                  {remedies[result.class]?.treatment.map(
                    (item, idx) => (
                      <li key={idx}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;