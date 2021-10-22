import './members.scss';
import KickPopup from '../kick-popup/KickPopup';
import Member from '../../shared/member/member';
import { useAppSelector } from '../../../redux/hooks';
import { membersState } from '../../../redux/reducers/members-reducer';

function Members(): JSX.Element {
  const { members } = useAppSelector(membersState);

  return (
    <section className="section-wrap">
      <h3 className="section-title">Members:</h3>
      <div className="members-container">
        <div className="members-list">
          {members.map((member) => (
            <Member
              key={member.id}
              id={member.id}
              firstName={member.firstName}
              lastName={member.lastName}
              jobPosition={member.jobPosition}
              avatar={member.avatar}
              isAdmin={member.isAdmin}
              isGame={false}
              kickCounter={member.kickCounter}
              role={member.role}
            />
          ))}
        </div>
      </div>
      <KickPopup />
    </section>
  );
}

export default Members;
