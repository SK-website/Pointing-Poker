import './cards.scss';

interface CardFaceProps {
  value: string;
  type: string;
}

function CardFace({ value, type }: CardFaceProps): JSX.Element {
  return (
    <div className="card-face card-data-block">
      <div className="card-front-up">{value}</div>
      <div className="card-front-center card-value-name">
        {value === 'Pass' || value === '?' ? value : type}
      </div>
      <div className="card-front-down">{value}</div>
    </div>
  );
}

export default CardFace;
