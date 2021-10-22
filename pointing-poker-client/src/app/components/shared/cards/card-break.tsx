import './cards.scss'

function CardBreak(): JSX.Element {
  return (
    <div className="card-face card-data-block">
      <div className="card-front-up">Break</div>
      <div className="card-front-center card-front-cup" />
      <div className="card-front-down">Break</div>
    </div>
 );
}

export default CardBreak;