import "./App.css";
import Result from "./Result";
import { useEffect, useMemo, useState } from "react";

const synth = window.speechSynthesis;

function App() {
  const voices = useMemo(() => synth.getVoices(), []);
  const [voiceSelected, setVoiceSelected] = useState("Google US English");
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState("");
  const [meanings, setMeanings] = useState([]);
  const [phonetics, setPhonetics] = useState([]);
  const [word, setWord] = useState("");
  const [err, setErr] = useState("");

  const startSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find((voice) => voice.name === voiceSelected);
    synth.speak(utterance);
  };
  const fetchData = () => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;
    fetch(url)
      .then((res) => res.json())
      .then((rs) => {
        setMeanings(rs[0].meanings);
        setPhonetics(rs[0].phonetics);
        setWord(rs[0].word);
      })
      .catch((err) => {
        setErr(err);
      });
  };
  const reset = () => {
    setText("");
    setMeanings([]);
    setPhonetics([]);
    setWord("");
  };

  const handleSpeech = () => {
    if (!text.trim()) return;
    if (!synth.speaking) {
      startSpeech(text);
      setIsSpeaking("speak");
    } else {
      synth.cancel();
    }
    setInterval(() => {
      if (!synth.speaking) {
        setIsSpeaking("");
      }
    }, 100);
  };
  useEffect(() => {
    if (!text.trim()) return reset();
    const debounce = setTimeout(() => {
      fetchData(text);
    }, 1000);
    return () => clearTimeout(debounce);
  }, [text]);
  return (
    <>
      <div className="container">
        <h1>English Dictionary</h1>
        <form action="">
          <div className="row">
            <textarea
              onChange={(e) => setText(e.target.value)}
              name=""
              id=""
              cols="30"
              rows="4"
              value={text}
              placeholder="Enter some words..."
            ></textarea>
            <div className="voices-icons">
              <div className="select-voices">
                <select
                  value={voiceSelected}
                  onChange={(e) => setVoiceSelected(e.target.value)}
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <i
                  className={`fa-solid fa-volume-high ${isSpeaking}`}
                  onClick={handleSpeech}
                ></i>
              </div>
            </div>
          </div>
        </form>
        {text.trim() !== "" && (
          <Result
            word={word}
            phonetics={phonetics}
            meanings={meanings}
            setText={setText}
          />
        )}
      </div>
    </>
  );
}

export default App;
