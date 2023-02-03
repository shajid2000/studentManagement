export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "img",
    headerName: "Photo",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
      
        </div>
      );
    },
  },
  {
    field: "name",
    headerName: "Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.FirstName}{" "}{params.row.LastName}
        </div>
      );
    },
  },

  {
    field: "class",
    headerName: "Class",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.Class}
        </div>
      );
    },
  },
  {
    field: "div",
    headerName: "Division",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.Division}
        </div>
      );
    },
  },
  {
    field: "add",
    headerName: "Address",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.addressLine1}
        </div>
      );
    },
  },
];
