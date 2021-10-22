import { SyntheticEvent, useEffect } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  saveCurrCardValueAction,
  closeSetOwnCardValuePopupAction,
  setOwnCardValueAction,
  valueIsInSelectedAction,
} from '../../redux/reducers/add-card-reducer';
import { setCardValuesFinalSetAction } from '../../redux/reducers/game-settings-reducer';

function OwnCardValuePopup(): JSX.Element {
  const dispatch = useAppDispatch();

  const { scoreType } = useAppSelector((state) => state.gameSettings);
  const {
    setOwnCardValuePopupVisible,
    currCardValue,
    cardsSelected,
    valueIsInSelected,
  } = useAppSelector((state) => state.addCardValues);

  useEffect(() => {
    if (cardsSelected.length > 1)
      dispatch(setCardValuesFinalSetAction(cardsSelected));
  }, [cardsSelected]);

  const closePopup = () => {
    dispatch(closeSetOwnCardValuePopupAction());
    dispatch(saveCurrCardValueAction('0'));
  };

  const handelSetCardInput = (e: SyntheticEvent) => {
    dispatch(valueIsInSelectedAction(false));
    const { value } = e.target as HTMLInputElement;
    dispatch(saveCurrCardValueAction(value));
  };

  const addOwnCard = () => {
    const isInSelected = cardsSelected.some((card) => card === currCardValue);
    if (!isInSelected) {
      dispatch(setOwnCardValueAction());
    } else dispatch(valueIsInSelectedAction(true));
  };

  return (
    <Modal show={setOwnCardValuePopupVisible} onHide={closePopup} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select card value (score type: {scoreType})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Set card value</Form.Label>
          {valueIsInSelected && (
            <p className="card-warning">
              This value is already exist in your deck of cards!
            </p>
          )}
          <Form.Control
            type="text"
            value={currCardValue}
            onChange={handelSetCardInput}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="button" onClick={addOwnCard}>
          Add card
        </Button>
        <Button variant="secondary" onClick={closePopup}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OwnCardValuePopup;
