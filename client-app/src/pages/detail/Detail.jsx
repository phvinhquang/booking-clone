import DetailHeader from "../../components/DetailPage/DetailHeader";
import DetailImg from "../../components/DetailPage/DetailImg";
import DetailDescription from "../../components/DetailPage/DetailDescription";
import Header from "../../components/Header/Header";
import Footer from "../../components/MainContent/Footer";
import { useEffect, useState } from "react";
import styles from "./Detail.module.css";
import { useParams } from "react-router-dom";
import { url } from "../../utils/backendUrl";

const Detail = () => {
  const [detail, setDetail] = useState([]);
  const params = useParams();
  // console.log(params);

  useEffect(() => {
    const fetchDetail = async function () {
      try {
        const res = await fetch(`${url}/hotels/${params.hotelId}`);

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        const data = await res.json();
        // console.log(data);

        setDetail(data);
      } catch (err) {}
    };

    fetchDetail();
  }, [params]);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <DetailHeader hotel={detail} />
        <DetailImg hotel={detail} />
        <DetailDescription hotel={detail} />
      </div>
      <Footer />
    </div>
  );
};

export default Detail;
