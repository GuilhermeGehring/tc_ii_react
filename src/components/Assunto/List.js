import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Modal } from "react-bootstrap";
import { db } from "../../firebase";

export default function Assunto() {
  const [assuntos, setAssuntos] = useState([]);
  const [show, setShow] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setSelectedId(id)
    setShow(true)
  };

  useEffect(() => {
    db.collection("assuntos").onSnapshot((querySnapshot) => {
      const docs = []
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id })
      })
      setAssuntos(docs)
    });
  }, []);

  function deleteItem() {
    setShow(false)
    db.collection("assuntos")
      .doc(selectedId)
      .delete()
      .then(() => {
        setSuccessAlert(true)
      })
      .catch(() => {
        setDangerAlert(true)
      });
  }

  return (
    <>
      <Alert show={successAlert} variant="success">Exclusão realizada com sucesso</Alert>
      <Alert show={dangerAlert} variant="danger">Ocorreu um erro ao excluir</Alert>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>Delete item forever?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteItem}>
            Deletar
          </Button>
        </Modal.Footer>
      </Modal>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {assuntos.map((assunto, index) => {
            return (
              <tr key={`${assunto}${index}`}>
                <td>{assunto.id}</td>
                <td>{assunto.titulo}</td>
                <td>{assunto.descricao}</td>
                <td>
                  <div style={{ width: "150px" }}>
                    <Button>Editar</Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleShow(assunto.id)}
                    >
                      Deletar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Button variant="success">Adicionar</Button>
      {/* <ModalForm buttonLabel="Add Item" addItemToState={this.addItemToState}/> */}
    </>
  );
}
