import { Modal, Spinner } from 'react-bootstrap';
import { useAppSelector } from '../../../redux/hooks';

function Loader(): JSX.Element {
  const { isLoading } = useAppSelector((state) => state.spinner);

  return (
    <Modal
      centered
      show={isLoading}
      backdrop="static"
      keyboard={false}
      contentClassName="spinner-container"
    >
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Modal>
  );
}

export default Loader;
