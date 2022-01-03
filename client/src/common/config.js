const REACT_APP_CLOUD_FUNCTION_URL =
  "https://us-central1-csci-5410-project-316112.cloudfunctions.net/api";

export const config = {
  CLOUD_FUNCTION_URL:
    process.env.NODE_ENV === "production"
      ? REACT_APP_CLOUD_FUNCTION_URL
      : "http://localhost:5001/csci-5410-project-316112/us-central1/api",
};
