import React from "https://esm.sh/react@18.2.0";
const e = React.createElement;

export default function CyberPetsAiTrainerEmbed() {
  return e("iframe", {
    src: "./public/CyberPetsAiTrainer/index.html",
    width: "100%",
    height: "600",
    style: { border: "none", borderRadius: "12px" }
  });
}
