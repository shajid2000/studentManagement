import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  doc,
  getDoc
} from "firebase/firestore";
import { db} from "../../firebase";
import { useEffect, useState } from "react";

const Single = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({})
  const navigate = useNavigate()

  // FETCHING SINGLE DOC 
  useEffect(() => {
    const docRef = doc(db, "students", searchParams.get('id'));
       const fetchData = async () => {
    
        try {
          const querySnapshot =await getDoc(docRef)
            setData({id:querySnapshot.id, ...querySnapshot.data()})
        
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
  }, [])

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={()=>{  navigate(`/update?id=${searchParams.get("id")}`)

            }}>Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={data.img}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.FirstName}{" "}{data.MiddleName?data.MiddleName:""}{data.LastName}</h1>
                <div className="detailItem">
                  <span className="itemKey">Class:</span>
                  <span className="itemValue">{data.Class}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Division:</span>
                  <span className="itemValue">{data.Division}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Roll No:</span>
                  <span className="itemValue">{data.RollNo}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {data.addressLine1}{" , "}{data.addressLine2}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">LandMark:</span>
                  <span className="itemValue">{data.Landmark?data.Landmark:"NA"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">City:</span>
                  <span className="itemValue">{data.City?data.City:"NA"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Pincode:</span>
                  <span className="itemValue">{data.Pincode?data.Pincode:"NA"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="Student Activity ( Last 6 Months)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
