import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();
  const bottomRef = useRef();


  /* auto scroll */

  useEffect(()=>{

    bottomRef.current?.scrollIntoView({behavior:"smooth"});

  },[chat]);


  /* send text */

  const sendMessage = async () => {

    if(!message.trim()) return;

    setChat(prev=>[

      ...prev,

      {sender:"user",text:message}

    ]);

    setMessage("");

    setLoading(true);

    const res = await axios.post(

      "http://localhost:5000/chat",

      {message}

    );

    setLoading(false);

    setChat(prev=>[

      ...prev,

      {sender:"bot",text:res.data.content}

    ]);

  };


  /* send image */

  const sendImage = async (e) => {

    const file = e.target.files[0];

    if(!file) return;

    const imageURL = URL.createObjectURL(file);

    const formData = new FormData();

    formData.append("image",file);


    setChat(prev=>[

      ...prev,

      {sender:"user",image:imageURL}

    ]);


    setLoading(true);

    const res = await axios.post(

      "http://localhost:5000/image",

      formData

    );

    setLoading(false);

    setChat(prev=>[

      ...prev,

      {sender:"bot",text:res.data.content}

    ]);

  };


  /* enter key */

  const handleKey = (e)=>{

    if(e.key==="Enter"){

      sendMessage();

    }

  };


  /* new chat */

  const newChat = ()=>{

    if(chat.length>0){

      setHistory(prev=>[chat,...prev]);

    }

    setChat([]);

  };


  return (

    <div className="layout">


      {/* sidebar */}

      <div className="sidebar">

        <button

          className="newChatBtn"

          onClick={newChat}

        >

          + New Chat

        </button>


        {

          history.map((c,i)=>(

            <div

              key={i}

              className="historyItem"

              onClick={()=>setChat(c)}

            >

              Chat {i+1}

            </div>

          ))

        }

      </div>


      {/* main */}

      <div className="main">


        <div className="header">

          AI-ChatBot 🤖

        </div>


        <div className="chatArea">

          {

            chat.map((msg,i)=>(

              <div

                key={i}

                className={

                  msg.sender==="user"

                  ? "userRow"

                  : "botRow"

                }

              >

                <div className="message">

                  {msg.text}

                  {msg.image && (

                    <img

                      src={msg.image}

                      alt="upload"

                      className="chatImage"

                    />

                  )}

                </div>

              </div>

            ))

          }


          {loading && (

            <div className="botRow">

              <div className="typing">

                AI is thinking...

              </div>

            </div>

          )}


          <div ref={bottomRef}></div>

        </div>


        {/* input */}

        <div className="inputBar">


          <label className="uploadIcon">

            📎

            <input

              type="file"

              hidden

              ref={fileRef}

              onChange={sendImage}

            />

          </label>


          <input

            className="textInput"

            value={message}

            onChange={e=>setMessage(e.target.value)}

            onKeyDown={handleKey}

            placeholder="Message AI..."

          />


          <button

            className="sendBtn"

            onClick={sendMessage}

          >

            Send

          </button>


        </div>


      </div>


    </div>

  );

}

export default App;