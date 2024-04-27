const axios = require("axios");

exports.chatBot = (req, res, next) => {
  const messeges = req.body.messeges;
  const sys = process.env.LLAMA_SYS_MSG;
  messeges.unshift(JSON.parse(sys));
  axios
    .post(
      process.env.LLAMA_URL,
      {
        model: process.env.LLAMA_MODEL,
        max_tokens: 250,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["[/INST]", "</s>"],
        messages: messeges,
      },
      {
        headers: {
          Authorization: process.env.LLAMA_TOKEN,
        },
      }
    )
    .then(
      (response) => {
        res.status(200).json({
          status: "success",
          response: response["data"]["choices"][0]["message"],
        });
      },
      (error) => {
        console.log(error);
      }
    );
};
