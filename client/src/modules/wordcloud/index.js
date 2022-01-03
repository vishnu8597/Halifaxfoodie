import api from "common/api";
import Loading from "components/Loading";
import { useEffect, useState } from "react";

function WordCloud() {
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState("");

  const fetchWordCloud = async (text) => {
    const options = {
      method: "POST",
      url: "https://textvis-word-cloud-v1.p.rapidapi.com/v1/textToCloud",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key": "77e6bc68aamsh3a903882d995e41p10f1f2jsn9aff61a37339",
        "x-rapidapi-host": "textvis-word-cloud-v1.p.rapidapi.com",
      },
      data: {
        text,
        scale: 0.5,
        width: 400,
        height: 400,
        colors: ["#375E97", "#FB6542", "#FFBB00", "#3F681C"],
        font: "Tahoma",
        use_stopwords: true,
        language: "en",
        uppercase: false,
      },
    };
    try {
      const response = await api.request(options);

      const { data } = response;

      setSrc(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        "https://kd4s80oifi.execute-api.us-east-1.amazonaws.com/test/wordcloud"
      );
      const { data } = response;

      const dishesText = data?.length ? data.join(" ") : "";

      await fetchWordCloud(dishesText);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loading />;
  return (
    <div className="d-flex">
      <img src={src} className="sdp-wc" alt="Word Cloud" />
    </div>
  );
}

export default WordCloud;
