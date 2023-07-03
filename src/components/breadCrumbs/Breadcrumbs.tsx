import closeAngleBracketImg from "../../assets/logos/bracket.svg";
import verticalBarImg from "../../assets/logos/verticalBar.svg";

function Breadcrumbs() {
  return (
    <div className="ml-36 flex h-16 items-center gap-3">
      <div className="flex items-center">
        Home
        <img
          src={closeAngleBracketImg}
          alt="close-angle-bracket"
          className="pl-5"
        />
      </div>
      <div className="flex items-center">
        Shop
        <img
          src={closeAngleBracketImg}
          alt="close-angle-bracket"
          className="pl-5"
        />
      </div>
      <div className="flex items-center">
        <img src={verticalBarImg} alt="vertical-bar" className="mr-3" />
        Tire
      </div>
    </div>
  );
}

export default Breadcrumbs;
