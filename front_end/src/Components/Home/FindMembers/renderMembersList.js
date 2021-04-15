import { Link } from "react-router-dom";

const renderMemberLists = (members, username, lang) => {
  const option = { year: "numeric", month: "long", day: "numeric" };
  return members.map((member, index) => {
    if (member.guest || member.username === username) return null;
    const { lastname, firstname } = member.name;
    const fullname =
      (firstname ? firstname : "") + " " + (lastname ? lastname : "");
    const joinDate = new Date(member.join).toLocaleDateString(
      lang === "English" ? "us-US" : "vi-VI",
      option
    );

    return (
      <li className="member" key={`member-${index}`}>
        <Link
          className="member-profile-link"
          to={`/home/${member.username}`}
          target="_blank"
        >
          <div>
            <img src={member.photo} />
          </div>
          <div className="member-info">
            <div className="name-and-state">
              <p className="member-name">{member.username}</p>
              <p className={`member-state ${member.socketID ? "online" : ""}`}>
                {member.socketID ? "Online" : "Offline"}
              </p>
            </div>
            <div className="join-date-and-name">
              <p>{fullname}</p>
              <p>{(lang === "English" ? "Join: " : "Tham Gia: ") + joinDate}</p>
            </div>
          </div>
        </Link>
      </li>
    );
  });
};

export default renderMemberLists;
