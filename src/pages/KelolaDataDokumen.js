import React, { useState, useEffect } from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Button,
} from "@mui/material";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { DocumentService } from "../services/DocumentService";
import { Link, useNavigate } from "react-router-dom";
import { EditModal } from "../components";

const KelolaData = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataModal, setDataModal] = useState(null);

  const navigate = useNavigate();
  const deleteDocument = async (id) => {
    await DocumentService.deleteDocument(id);
    navigate("kelola-data/dokumen");
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDokumen = async () => {
      const response = await DocumentService.getDocument();
      const data = response.data;
      setDocuments(data);
    };

    fetchDokumen();
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - documents.length) : 0;

  return (
    <>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Master Data
      </Typography>
      <Typography
        variant="h6"
        fontWeight={600}
        gutterBottom
        style={{
          color: "#6F8197",
        }}
      >
        Data Dokumen
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" width={50}>
                <Typography variant="h6">No</Typography>
              </TableCell>
              <TableCell align="center" width={50}>
                <Typography variant="h6">Id</Typography>
              </TableCell>
              <TableCell align="center" width={200}>
                <Typography variant="h6">Judul Dokumen</Typography>
              </TableCell>
              <TableCell align="center" width={100}>
                <Typography variant="h6">PIC</Typography>
              </TableCell>
              <TableCell align="center" width={50}>
                <Typography variant="h6">Kategori</Typography>
              </TableCell>
              <TableCell align="center" width={50}>
                <Typography variant="h6">Kelola</Typography>
              </TableCell>
              <TableCell align="center" width={50}>
                <Typography variant="h6">Pinjam</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell align="center">
                    <Typography variant="subtitle1">
                      {page * rowsPerPage + (index + 1)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1">
                      {data.id_dokumen}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1">
                      {data.judul_dokumen}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1">{data.nama_pic}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1">
                      {data.kategori_dokumen}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => deleteDocument(data.id_dokumen)}
                      color="error"
                    >
                      <FiTrash2 />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setDataModal(data);
                        handleOpen();
                      }}
                      color="green"
                    >
                      <FiEdit />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      component={Link}
                      to={`/konfirmasi-peminjaman/dokumen/${data.id_dokumen}`}
                      variant="contained"
                      color="green"
                    >
                      <Typography variant="subtitle1">Pinjam</Typography>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            <EditModal
              open={open}
              handleClose={() => handleClose()}
              datas={dataModal}
            />
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 73 * emptyRows,
                }}
              >
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={documents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 25]}
      />
    </>
  );
};

export default KelolaData;
