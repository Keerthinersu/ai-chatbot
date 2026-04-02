const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


/* ---------------- TEXT CHAT ---------------- */

app.post("/chat", async (req, res) => {

  try {

    const completion = await groq.chat.completions.create({

      messages: [
        {
          role: "user",
          content: req.body.message
        }
      ],

      model: "llama-3.1-8b-instant"

    });

    res.json({

      content: completion.choices[0].message.content

    });

  }

  catch (error) {

    console.log("Chat error:", error);

    res.json({

      content: "Chat error"

    });

  }

});


/* ---------------- IMAGE ANALYSIS ---------------- */

app.post("/image", upload.single("image"), async (req, res) => {

  try {

    if(!req.file){

      return res.json({

        content: "No image uploaded"

      });

    }

    const base64 = req.file.buffer.toString("base64");

    const completion = await groq.chat.completions.create({

      messages: [

        {

          role: "user",

          content: [

            {
              type: "text",
              text: "Describe this image in simple words"
            },

            {
              type: "image_url",

              image_url: {

                url: `data:image/jpeg;base64,${base64}`

              }

            }

          ]

        }

      ],

      model: "meta-llama/llama-4-scout-17b-16e-instruct"

    });

    res.json({

      content: completion.choices[0].message.content

    });

  }

  catch (error) {

    console.log("Image error:", error);

    res.json({

      content: "Image analysis failed"

    });

  }

});


/* ---------------- SERVER ---------------- */

app.listen(5000, () => {

  console.log("Server running on port 5000");

});