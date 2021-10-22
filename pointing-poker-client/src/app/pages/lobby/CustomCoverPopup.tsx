import { SyntheticEvent } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  addNewCardCoverAction,
  closeCustomCoverPopupAction,
  setSelectedCardCoverAction,
} from '../../redux/reducers/custom-cover-reducer';
import { saveCardCoverAction } from '../../redux/reducers/game-settings-reducer';

function CustomCoverPopup(): JSX.Element {
  const dispatch = useAppDispatch();

  const customCoverPopupVisible = useAppSelector(
    (state) => state.customCover.customCoverPopupVisible
  );
  const prevCover = useAppSelector((state) => state.customCover.prevCardCover);
  const covers = useAppSelector((state) => state.customCover.covers);

  const cardCover = useAppSelector((state) => state.gameSettings.cardCover);

  const closeCustomCoverPopup = () => {
    dispatch(saveCardCoverAction(prevCover));
    dispatch(closeCustomCoverPopupAction());
  };

  const handelChangeColorInput = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(saveCardCoverAction(value));
  };
  const saveChoice = () => {
    const ElId = covers.length + 1;
    dispatch(closeCustomCoverPopupAction());
    dispatch(addNewCardCoverAction({ id: ElId, cover: cardCover }));
    dispatch(setSelectedCardCoverAction(ElId));
  };

  return (
    <Modal
      show={customCoverPopupVisible}
      onHide={closeCustomCoverPopup}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Select card cover color</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label htmlFor="colorPicker">Choose your color</Form.Label>
        <Form.Control
          type="color"
          id="colorPicker"
          defaultValue={cardCover}
          title="Choose your color"
          onChangeCapture={handelChangeColorInput}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="button" onClick={saveChoice}>
          Save my choice
        </Button>
        <Button variant="secondary" onClick={closeCustomCoverPopup}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomCoverPopup;
