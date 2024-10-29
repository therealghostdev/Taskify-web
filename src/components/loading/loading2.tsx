import "../../styles/loading2.scss";

export default function LoadingSpinner2() {
  return (
    <div id="container">
      <svg
        id="svg-spinner"
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="20"
        viewBox="0 0 48 48"
      >
        <circle cx="24" cy="4" r="4" fill="#868" />
        <circle cx="12.19" cy="7.86" r="3.7" fill="#868bf2" />
        <circle cx="5.02" cy="17.68" r="3.4" fill="#8687e4" />
        <circle cx="5.02" cy="30.32" r="3.1" fill="#8b83d7" />
        <circle cx="12.19" cy="40.14" r="2.8" fill="#848fc9" />
        <circle cx="24" cy="44" r="2.5" fill="#8c8bbc" />
        <circle cx="35.81" cy="40.14" r="2.2" fill="#8f87af" />
        <circle cx="42.98" cy="30.32" r="1.9" fill="#8b83a1" />
        <circle cx="42.98" cy="17.68" r="1.6" fill="#8e8f94" />
        <circle cx="35.81" cy="7.86" r="1.3" fill="#868b86" />
      </svg>
    </div>
  );
}
