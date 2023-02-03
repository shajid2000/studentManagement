import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Alert from "../../pages/Alert";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {

    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "students"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "students", id));
      setShow(false)
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE
  const handleUpdate = (id) => {
    console.log(id)
    navigate(`/update?id=${id}`)
  };

  // OPERATION BUTTONS- VIEW,UPDATE,DELETE
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">

            <div className="viewButton" onClick={() => navigate(`/view?id=${params.row.id}`)}>View</div>
            {/* </Link> */}
            <div
              className="deleteButton"
              onClick={() => handleUpdate(params.row.id)}
            >
              Update
            </div>
            <div
              className="deleteButton"

              onClick={() => {
                setShow(true)
                setId(params.row.id)
              }}
            >
              Delete

            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
    Student List
        <Link to="/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        // checkboxSelection
      />
      {show && <div className="alert">
        <Alert id={id} handleDelete={handleDelete} setShow={setShow} />
      </div>}
    </div>
  );
};

export default Datatable;
