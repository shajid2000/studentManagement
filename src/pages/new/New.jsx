import "./new.scss";
import "./common.css"
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useSearchParams } from "react-router-dom";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);
  const [t, sett] = useState(false);
  const [p, setp] = useState(false);
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();

  // FILE UPLOAD 
  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  // GET SPECIFIC DOC FOR UPDATE 
  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDoc(doc(db, "students", searchParams.get('id')))
        console.log(querySnapshot.data())
        setData(querySnapshot.data())
        console.log("list");
      } catch (err) {
        console.log(err);
      }
    };
    searchParams.get("id") && fetchData();
    if (searchParams.get("id") == null) {
      setData({})

    }
  }, [searchParams.get("id")])


  // HANDING UPDATE 
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {

      await setDoc(doc(db, "students", searchParams.get('id')), {
        ...data,
      });
      navigate(-1)
    } catch (err) {
      console.log(err);
    }
  };

  // HANDLE CHANGE 
  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    console.log(id, value, value.length)
    if (id == "RollNo" && value.length > 2) {
      sett(true)
      return
    }
    if (id == "RollNo" && value.length <= 2) {
      sett(false)
    }
    if (id == "Pincode" && value.length > 6) {
      setp(true)
      return
    }
    if (id == "Pincode" && value.length <= 6) {
      setp(false)
    }
    setData({ ...data, [id]: value });
  };

  // ADDING TO FIREBASE 
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "students"), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      navigate(-1)
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={data.img ? data.img : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={!searchParams.get("id") ? handleAdd : handleUpdate}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input, i) => (
                <div className="formInput" key={input.id}>

                  {input.type != "option" && input.id != "RollNo" ? <> <label>{input.label}</label>
                    <input
                      id={input.id}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={handleInput}
                      value={data[input.id]}
                    />

                  </> : input.id == "RollNo" ? <>
                    <label>{input.label}</label>

                    <input
                      id={input.id}
                      type={input.type}
                      // placeholder={input.placeholder}
                      value={data.RollNo}
                      onChange={handleInput}
                    />
                    {(t && input.id == "RollNo") && <p style={{ color: "red" }}>Roll no. should not exceed from two digit</p>}</> : <><label>{input.id}
                      <select value={(input.div === false) ? data.Class : data.Division} id={input.id} onChange={handleInput}>
                        <option value="" disabled selected>Select {input.id}</option>
                        {!input.div ? input.class.map((d) => {
                          return (
                            <option key={d}>{d}</option>
                          );
                        }) : input.division.map((d) => {
                          return (
                            <option key={d}>{d}</option>
                          );
                        })}
                      </select>
                    </label></>}
                </div>
              ))}
              <div className="inpdiv">
                <div className="add">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="">Address Line 1</label>
                    <textarea name="" id="addressLine1" cols="40" rows="2" value={data.addressLine1}
                      onChange={handleInput} ></textarea>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label htmlFor="">Address Line 2</label>
                    <textarea name="" id="addressLine2" cols="40" rows="2" value={data.addressLine2}
                      onChange={handleInput}></textarea>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", flexDirection: "column", width: "80%", margin: "20px" }}>
                    <label>Landmark</label>
                    <input
                      id="Landmark"
                      type="text"
                   
                      value={data.Landmark}
                      onChange={handleInput}
                    />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", flexDirection: "column", width: "80%", margin: "20px" }}>
                    <label>City</label>
                    <input
                      id="City"
                      type="text"
                    
                      value={data.City}
                      onChange={handleInput}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", width: "80%", margin: "20px" }}>
                    <label>Pincode</label>
                    <input
                      id="Pincode"
                      type="number"
                    
                      value={data.Pincode}
                      onChange={handleInput}
                    />
                    {p && <p style={{ color: "red" }}>Pincode should not exceed from six digit</p>}
                  </div>
                </div>
              </div>

              <button disabled={per !== null && per < 100} type="submit">
                {!searchParams.get("id") ? "Create" : "Update"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
