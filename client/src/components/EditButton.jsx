import React from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useAuthToken } from "../AuthTokenContext";
import "../style/reviewInput.css";

export default function Edit({movieId}) {
    const { accessToken } = useAuthToken();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [currentRating, setCurrentRating] = useState();
    const [comment, setComment] = useState();

    const newReview = {
        rating: parseFloat(currentRating),
        comment: comment,
      };
    
    function handleSave() {
        fetch(`${process.env.REACT_APP_API_URL}/details/review/${movieId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview),
        })
          .then((response) => {
            console.log("New review has been added.", response);
            window.location.reload();
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      }
    
      const handleSaveAndClose = () => {
        handleClose();
        handleSave();
      };

    return (
        <>
          <button className="edit-button" variant="primary" onClick={handleShow}>
            Edit
          </button>
    
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="popup">
              <Modal.Title className="popup pop-title">I've Watched This Movie</Modal.Title>
            </Modal.Header>
            <Modal.Body className="popup">
              <Form className="popup">
                <Form.Group className="mb-3 popup" controlId="exampleForm.ControlInput1">
                  <Form.Label className="popup pop-title">My Rating</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentRating}
                    onChange={(e) => setCurrentRating(e.currentTarget.value)}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3 popup"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label className="popup pop-title">Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    placeholder="Write your review (optional)"
                    onChange={(e) => setComment(e.currentTarget.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className="popup">
              <button className="pop-button" variant="secondary" onClick={handleClose}>
                Close
              </button>
              <button className="pop-button" variant="primary" onClick={handleSaveAndClose}>
                Save
              </button>
            </Modal.Footer>
          </Modal>
        </>
      );
}