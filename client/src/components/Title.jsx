import React from "react";

const Title = ({
  title1,
  title2,
  titleStyles,
  title2Styles,
  paraStyles,
  para,
}) => {
  return (
    <div className={`${titleStyles}`}>
      <h4 className="h4 text-secondary">{title1}</h4>
      <h1 className={`${title2Styles} h2 capitalize`}>{title2}</h1>
      <p className={`${paraStyles} max-w-lg mt-2`}>
        {para
          ? para
          : "Find affordable student housing near your campus — safe, simple, and built for students."}
      </p>
    </div>
  );
};

export default Title;