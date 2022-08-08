import React from "react";

const Result = ({ word, phonetics, meanings, setText }) => {
  return (
    <ul>
      <li className="word">
        <h2>{word}</h2>
        {phonetics.map((phonetic, index) => {
          return <span key={index}>{phonetic.text}</span>;
        })}
      </li>
      {meanings.map((meaning, index) => {
        return (
          <li className="contain">
            <h3>Noun</h3>
            <div className="details meaning">
              <h3>Meaning</h3>
              {meaning.definitions.map((d, i) => (
                <p key={i}>- {d.definition}</p>
              ))}
            </div>
            {meaning.synonyms.length !== 0 && (
              <div className="details synonyms">
                <h3>synonyms</h3>

                {meaning.synonyms.map((s, i) => (
                  <span onClick={() => setText(s)} key={i}>
                    {s},{" "}
                  </span>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Result;
