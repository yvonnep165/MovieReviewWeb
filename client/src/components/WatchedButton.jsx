import React from "react";
import { useParams } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export default function WatchedButton() {
  const { movieId } = useParams();
  const { accessToken } = useAuthToken();
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState();
  const [comment, setComment] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const newReview = {
    rating: parseFloat(rating),
    comment: comment
  }

  function handleSave() {
    fetch(`${process.env.REACT_APP_API_URL}/details/review/${movieId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        body: JSON.stringify(newReview),
    })
    .then((response) => {
        console.log("New review has been added.", response);
    })
    .catch((error) => {
        console.log("Error:", error);
    })

    fetch(`${process.env.REACT_APP_API_URL}/details/watched/${movieId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      window.location.reload();
  })
  }

  const handleSaveAndClose = () => {
    handleClose();
    handleSave();
  };
  

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Watched
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>I've Watched This Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>My Rating</Form.Label>
              <Form.Control type="text" value={rating} onChange={(e) => setRating(e.currentTarget.value)} autoFocus />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Comment</Form.Label>
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
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveAndClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
